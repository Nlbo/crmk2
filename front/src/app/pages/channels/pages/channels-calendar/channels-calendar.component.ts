import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ScheduleService} from '@api/schedule/schedule.service';
import {ISchedulesModel} from '@api/schedule/res/schedule.interface';
import {SchedulesTypesEnum} from '@pages/channels/enums/scheduler.enums';
import {NzBadgeStatusTypesEnum} from '@enums/nz-badge-status-types.enum';
import {FormControl} from '@angular/forms';
import {PermissionsEnum} from '@enums/permissions.enum';

@Component({
  selector: 'app-channels-calendar',
  templateUrl: './channels-calendar.component.html',
  styleUrls: ['./channels-calendar.component.scss']
})
export class ChannelsCalendarComponent implements OnInit {

  currentDate: Date = new Date();
  channelId: string = null;
  schedulesList: ISchedulesModel[] = [];
  SchedulesTypesEnum = SchedulesTypesEnum;
  NzBadgeStatusTypesEnum = NzBadgeStatusTypesEnum;
  selectedDay: Date = new Date();
  isVisibleSelectedDayModal: boolean = false;
  isCreatingSchedule = false;
  selectedDayModalTabIndex: number = 0;
  createScheduleFormControl = new FormControl(null);
  PermissionsEnum = PermissionsEnum;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private scheduleService: ScheduleService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.channelId = params.id;
        this.initializeValues();
      } else {
        this.router.navigate(['', 'channels']);
      }
    });
  }

  getMonthData(date: Date): number | null {
    if (date.getMonth() === 8) {
      return 1394;
    }
    return null;
  }

  changeTab(index) {
    this.selectedDayModalTabIndex = index;
    requestAnimationFrame(() => {
      if (document.getElementsByClassName('ant-picker-input').length) {
        document.getElementsByClassName('ant-picker-input')[0].getElementsByTagName('input')[0].onkeydown = (e) => e.preventDefault();
      }
    });
  }

  changeDate(date: Date) {
    this.currentDate = date;
    this.initializeValues();
  }

  initializeValues() {
    this.scheduleService.getSchedules(this.channelId, this.currentDate).subscribe((data) => {
      this.schedulesList = data;
    });
  }

  selectDay(event) {
    if (this.selectedDay?.getUTCMonth() === event.getUTCMonth() && this.selectedDay?.getFullYear() === event.getFullYear()) {
      this.isVisibleSelectedDayModal = true;
    } else {
      this.initializeValues();
    }
    this.selectedDay = event;
  }

  manageSelectedDayModal(flag = false) {
    if (flag) {
      this.isCreatingSchedule = true;
      this.scheduleService.createSchedule(this.createScheduleFormControl.value, this.channelId).subscribe((schedule: ISchedulesModel) => {
        this.schedulesList.push(schedule);
        this.createScheduleFormControl.setValue(null);
        this.selectedDayModalTabIndex = 0;
        this.isVisibleSelectedDayModal = false;
        this.isCreatingSchedule = false;
      });
    } else {
      this.selectedDayModalTabIndex = 0;
      this.isVisibleSelectedDayModal = false;
    }
  }

  deleteScheduler(schedulerId: string) {
    this.scheduleService.deleteSchedule(this.channelId, schedulerId).subscribe((scheduler: ISchedulesModel) => {
      this.selectedDayModalTabIndex = 0;
      this.isVisibleSelectedDayModal = false;
      this.schedulesList = this.schedulesList.filter(item => item.id !== schedulerId);
    });
  }

  back() {
    this.router.navigate(['', 'channels']);
  }
}
