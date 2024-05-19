import {Component, OnInit} from '@angular/core';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {ChannelsService} from '@api/channels/channels.service';
import {IChannelsModel, IChannelsResponseModel} from '@api/channels/res/channels.interface';
import {PermissionsEnum} from '@enums/permissions.enum';

@Component({
  selector: 'app-channels-list',
  templateUrl: './channels-list.component.html',
  styleUrls: ['./channels-list.component.scss']
})
export class ChannelsListComponent implements OnInit {

  channelsResponse: IChannelsResponseModel = null;
  channelsList: IChannelsModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  ManageTypesEnum = ManageTypesEnum;
  visibleTitleFilter: boolean = false;
  PermissionsEnum = PermissionsEnum;

  constructor(public channelsService: ChannelsService) {
  }

  ngOnInit() {
    this.initializeValues();
  }

  initializeValues() {
    this.visibleTitleFilter = false;
    this.channelsService.getChannelsList(this.pageIndex).subscribe((data) => {
      this.channelsResponse = data;
      this.channelsList = this.channelsResponse.data;
    });
  }

  deleteChannel(id: string) {
    this.channelsService.deleteChannel(id).subscribe((data) => {
      this.initializeValues();
    });
  }

}
