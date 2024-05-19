import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ICategoriesModel} from '@api/categories/res/categories.interface';
import {CategoriesService} from '@api/categories/categories.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-channels-calendar-schedules-manage',
  templateUrl: './channels-calendar-schedules-manage.component.html',
  styleUrls: ['./channels-calendar-schedules-manage.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChannelsCalendarSchedulesManageComponent),
      multi: true
    }
  ]
})
export class ChannelsCalendarSchedulesManageComponent implements OnInit, ControlValueAccessor {

  @Input('date') set date(value) {
    this.formGroup?.get('time').setValue(value, {emitEvent: false});
  };

  formGroup = new FormGroup({
    category_id: new FormControl(''),
    time: new FormControl('')
  });

  timeFormControl = new FormControl(null);

  onChange = null;
  categoriesList: ICategoriesModel[] = [];
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);

  constructor(private categoriesService: CategoriesService, private datePipe: DatePipe) {
    this.formGroup.valueChanges.subscribe((data) => {
      if (this.onChange) {
        this.onChange({
          category_id: this.formGroup.get('category_id').value,
          time : this.datePipe.transform(data.time, 'yyy-MM-dd HH:mm')
        });
      }
    });

    this.timeFormControl.valueChanges.subscribe((data) => {
      let time = new Date(this.formGroup.get('time').value);
      let newTime = new Date(data);
      time.setHours(newTime.getHours());
      time.setMinutes(newTime.getMinutes());
      time.setSeconds(newTime.getSeconds());
      this.formGroup.get('time').setValue(time);
    });
  }

  ngOnInit(): void {
    this.initializeValues();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.formGroup.patchValue(obj);
      this.timeFormControl.patchValue(obj.time)
    } else {
      this.formGroup.reset();
      this.timeFormControl.reset();
    }
  }

  registerOnTouched(fn: any) {
  }

  initializeValues() {
    this.categoriesService.getCategoriesList(0, false).subscribe((categoriesList: ICategoriesModel[]) => {
      this.categoriesList = categoriesList;
    });
  }

}
