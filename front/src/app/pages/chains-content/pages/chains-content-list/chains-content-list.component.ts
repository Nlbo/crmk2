import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, OnInit} from '@angular/core';
import {IContentModel, IContentResponseModel} from '@api/content/res/content.interface';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {ContentService} from '@api/content/content.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-chains-content-list',
  templateUrl: './chains-content-list.component.html',
  styleUrls: ['./chains-content-list.component.scss']
})
export class ChainsContentListComponent implements OnInit {

  contentsResponse: IContentResponseModel = null;
  contentsList: IContentModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  ManageTypesEnum = ManageTypesEnum;
  chainId: string = null;
  telegramBotId: string = null;

  constructor(public contentService: ContentService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe((params: Params) => {
      if (params.chainId && params.telegramBotId) {
        this.chainId = params.chainId;
        this.telegramBotId = params.telegramBotId;
        this.initializeValues();
      } else if (params.telegramBotId) {
        this.telegramBotId = params.telegramBotId;
        this.router.navigate(['', 'bots', this.telegramBotId, 'chains']);
      } else {
        this.router.navigate(['', 'bots']);
      }
    });
    this.initializeValues();
  }

  initializeValues() {
    this.contentService.getContentsList(this.chainId, this.pageIndex).subscribe((data) => {
      this.contentsResponse = data;
      this.contentsList = this.contentsResponse.data;
    });
  }

  deleteBot(id: string) {
    this.contentService.deleteContent(this.chainId, id).subscribe((data) => {
      this.initializeValues();
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.contentsList, event.previousIndex, event.currentIndex);
    this.contentsList.forEach((chainContent, index) => {
      chainContent.order = index + 1;
    })
    const obj = {
      reordered: this.contentsList
    }
    this.contentService.reorderContent(obj, this.chainId).subscribe(() => {});
  }

  back() {
    this.router.navigate(['', 'bots', this.telegramBotId, 'chains']);
  }
}
