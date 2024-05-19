import {AfterViewInit, Component, OnInit} from '@angular/core';
import {of} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {ChainsManageModel} from '@api/chains-content/req/chains.manage.model';
import {IChainsContentModel} from '@api/chains-content/res/chains-content.interface';
import {ChainsContentService} from '@api/chains-content/chains-content.service';
import {AppHelper} from '@services/app-helper.service';

@Component({
  selector: 'app-chains-manage',
  templateUrl: './chains-manage.component.html',
  styleUrls: ['./chains-manage.component.scss']
})
export class ChainsManageComponent implements OnInit, AfterViewInit {

  chainsManageModel = new ChainsManageModel();
  ManageType: ManageTypesEnum = ManageTypesEnum.Add;
  ManageTypesEnum = ManageTypesEnum;
  isGettingOneChain$ = of(false);
  isManagingChain = false;
  isCustomTime = false;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  selectTimeInterval = [
    {
      label: 'days',
      value: 'd'
    },
    {
      label: 'hours',
      value: 'h'
    },
    {
      label: 'minutes',
      value: 'm'
    }
  ];

  constructor(public router: Router, private activatedRoute: ActivatedRoute, private chainsContentService: ChainsContentService) {
  }

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe((parentParams: Params) => {
      if (parentParams.telegramBotId) {
        this.chainsManageModel.telegramBotId.setValue(parentParams.telegramBotId);
        this.activatedRoute.params.subscribe((childParams: Params) => {
          if (childParams.id) {
            this.chainsManageModel.id.setValue(childParams.id);
            this.ManageType = ManageTypesEnum.Edit;
            this.isGettingOneChain$ = of(true);
            this.chainsContentService.getOneChainContent(parentParams.telegramBotId, childParams.id).subscribe((chain: IChainsContentModel) => {
              this.isGettingOneChain$ = of(false);
              if (chain) {
                if (chain.time_to && chain.time_from) {
                  this.chainsManageModel.formGroup.patchValue({
                    title: chain.title,
                    isActive: chain.is_active,
                    timeFrom: AppHelper.convertTZ(chain.time_from, 'Europe/Moscow'),
                    timeTo: AppHelper.convertTZ(chain.time_to, 'Europe/Moscow'),
                    interval: chain.send_interval.match(/\d+/g)[0],
                    intervalType: chain.send_interval.match(/[a-zA-Z]+/g)[0],
                  });
                  this.isCustomTime = true;
                } else {
                  this.chainsManageModel.formGroup.patchValue({
                    title: chain.title,
                    isActive: chain.is_active,
                    timeFrom: null,
                    timeTo: null,
                    interval: chain.send_interval.match(/\d+/g)[0],
                    intervalType: chain.send_interval.match(/[a-zA-Z]+/g)[0],
                  });
                  this.isCustomTime = false;
                }
                if (this.router.url.includes(ManageTypesEnum.Preview)) {
                  this.ManageType = ManageTypesEnum.Preview;
                  this.chainsManageModel.manageAllFields(false);
                }
              }
            }, err => {
              this.isGettingOneChain$ = of(false);
            });
          }
        });
      }
    });
    this.chainsManageModel.timeFrom.valueChanges.subscribe((data) => {
      if (new Date(data).getMinutes() < 45) {
        this.chainsManageModel.timeTo.setValue(new Date(data).setMinutes(new Date(data).getMinutes() + 15));
      } else {
        if (new Date(data).getHours() < 23) {
          this.chainsManageModel.timeTo.setValue(new Date(new Date(data).setMinutes(0)).setHours(new Date(data).getHours() + 1));
        } else {
          this.chainsManageModel.timeFrom.setValue(new Date(new Date(data).setHours(23)).setMinutes(30));
        }
      }
    });
  }

  disabledHours(): number[] {
    const hoursArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    return [...hoursArray].filter(item => item < new Date(this.chainsManageModel.timeFrom.value).getHours());
  }


  disabledMinutes(hour): number[] {
    const minutesArray = [0, 15, 30, 45];
    if (hour <= new Date(this.chainsManageModel.timeFrom.value).getHours()) {
      return minutesArray.filter(item => item <= (new Date(this.chainsManageModel.timeFrom.value).getMinutes()));
    } else {
      return [];
    }
  }

  setCustomTimes(event): void {
    if (!event) {
      this.chainsManageModel.timeFrom.setValue(null);
      this.chainsManageModel.timeTo.setValue(null);
    }
  }

  submitForm(): void {
    switch (this.ManageType) {
      case ManageTypesEnum.Add:
        this.isManagingChain = true;
        this.chainsContentService.createChainsContent(this.chainsManageModel.getCreateValues(), this.chainsManageModel.telegramBotId.value).subscribe(() => {
          this.router.navigate(['', 'bots', this.chainsManageModel.telegramBotId.value, 'chains']);
          this.isManagingChain = false;
        }, err => this.isManagingChain = false);
        break;
      case ManageTypesEnum.Edit:
        this.isManagingChain = true;
        this.chainsContentService.editChainsContent(this.chainsManageModel.getEditValues(), this.chainsManageModel.telegramBotId.value, this.chainsManageModel.id.value).subscribe(() => {
          this.router.navigate(['', 'bots', this.chainsManageModel.telegramBotId.value, 'chains']);
          this.isManagingChain = false;
        }, err => this.isManagingChain = false);
        break;
    }
  }

  ngAfterViewInit() {
    if (document.getElementsByClassName('ant-picker-input').length) {
      document.getElementsByClassName('ant-picker-input')[0].getElementsByTagName('input')[0].onkeydown = (e) => e.preventDefault();
      document.getElementsByClassName('ant-picker-input')[1].getElementsByTagName('input')[0].onkeydown = (e) => e.preventDefault();
    }
  }
}
