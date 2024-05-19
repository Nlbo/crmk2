import {Component, OnInit} from '@angular/core';
import {IChainsContentModel, IChainsContentResponseModel} from '@api/chains-content/res/chains-content.interface';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {ChainsContentService} from '@api/chains-content/chains-content.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PermissionsEnum} from '@enums/permissions.enum';

@Component({
  selector: 'app-chains-list',
  templateUrl: './chains-list.component.html',
  styleUrls: ['./chains-list.component.scss']
})
export class ChainsListComponent implements OnInit {
  visibleTitleFilter: boolean = false;
  chainsResponse: IChainsContentResponseModel = null;
  chainsList: IChainsContentModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  ManageTypesEnum = ManageTypesEnum;
  telegramBotId: string = null;
  PermissionsEnum = PermissionsEnum;

  constructor(public chainsService: ChainsContentService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe((params: Params) => {
      if (params.telegramBotId) {
        this.telegramBotId = params.telegramBotId;
        this.initializeValues();
      } else {
        this.router.navigate(['', 'bots'])
      }
    })
  }

  initializeValues() {
    this.visibleTitleFilter = false;
    this.chainsService.getChainsContentList(this.telegramBotId, this.pageIndex).subscribe((data) => {
      this.chainsResponse = data;
      this.chainsList = this.chainsResponse.data;
    });
  }

  deleteChain(id: string) {
    this.chainsService.deleteChainsContent(this.telegramBotId, id).subscribe((data) => {
      this.initializeValues();
    });
  }

  changeStatus(chain: IChainsContentModel, is_active: boolean) {
    const obj = {
      is_active
    }
    this.chainsService.editChainsContent(obj, this.telegramBotId, chain.id).subscribe(() => {});
  }

  back() {
    this.router.navigate(['', 'bots']);
  }
}
