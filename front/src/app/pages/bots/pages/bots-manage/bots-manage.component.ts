import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {BotsService} from '@api/bots/bots.service';
import {BotsManageModel} from '@api/bots/req/bots.manage.model';
import {IBotsModel} from '@api/bots/res/bots.interface';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {of} from 'rxjs';

@Component({
  selector: 'app-bots-manage',
  templateUrl: './bots-manage.component.html',
  styleUrls: ['./bots-manage.component.scss']
})
export class BotsManageComponent implements OnInit {
  manageBotsModel = new BotsManageModel();
  ManageType: ManageTypesEnum = ManageTypesEnum.Add;
  ManageTypesEnum = ManageTypesEnum;
  isGettingOneBot$ = of(false);
  isManagingBot = false;
  passwordVisible = false;

  constructor(public router: Router, private activatedRoute: ActivatedRoute, private botsService: BotsService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.ManageType = ManageTypesEnum.Edit;
        this.isGettingOneBot$ = of(true);
        this.botsService.getOneBot(params.id).subscribe((bot: IBotsModel) => {
          this.isGettingOneBot$ = of(false);
          if (bot) {
            this.manageBotsModel.formGroup.patchValue(bot);
            this.manageBotsModel.setWebhook.setValue(bot.set_webhook, {emitEvent: false});
            if (this.router.url.includes(ManageTypesEnum.Preview)) {
              this.ManageType = ManageTypesEnum.Preview;
              this.manageBotsModel.manageAllFields(false);
            }
          }
        }, err => {
          this.isGettingOneBot$ = of(false);
        });
      }
    });
  }

  submitForm(): void {
    switch (this.ManageType) {
      case ManageTypesEnum.Add:
        this.isManagingBot = true;
        this.botsService.createBot(this.manageBotsModel.getCreateValues()).subscribe(() => {
          this.router.navigate(['', 'bots']);
          this.isManagingBot = false;
        }, err => this.isManagingBot = false);
        break;
      case ManageTypesEnum.Edit:
        this.isManagingBot = true;
        this.botsService.editBot(this.manageBotsModel.getEditValues(), this.manageBotsModel.id.value).subscribe(() => {
          this.router.navigate(['', 'bots']);
          this.isManagingBot = false;
        }, err => this.isManagingBot = false);
        break;
    }
  }


}
