import {Component, OnInit} from '@angular/core';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {BotsService} from '@api/bots/bots.service';
import {IBotsModel, IBotsResponseModel} from '@api/bots/res/bots.interface';
import {of} from 'rxjs';
import {PermissionsEnum} from '@enums/permissions.enum';

@Component({
  selector: 'app-bots-list',
  templateUrl: './bots-list.component.html',
  styleUrls: ['./bots-list.component.scss']
})
export class BotsListComponent implements OnInit {
  visibleTitleFilter: boolean = false;
  ManageTypesEnum = ManageTypesEnum;
  botsResponse: IBotsResponseModel = null;
  botsList: IBotsModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  isGettingBotsList$ = of(false);
  PermissionsEnum = PermissionsEnum;

  constructor(public botsService: BotsService) {
  }

  ngOnInit() {
    this.initializeValues();
  }

  initializeValues() {
    this.getList();
  }

  getList() {
    this.visibleTitleFilter = false;
    this.isGettingBotsList$ = of(true);
    this.botsService.getBotsList(this.pageIndex).subscribe((data: IBotsResponseModel) => {
      this.isGettingBotsList$ = of(false);
      this.botsResponse = data;
      this.botsList = this.botsResponse.data;
    }, err => {
      this.isGettingBotsList$ = of(false);
    });
  }

  deleteBot(id: string) {
    this.botsService.deleteBot(id).subscribe((data) => {
      this.initializeValues();
    });
  }
}
