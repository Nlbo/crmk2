import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChannelsRoutingModule} from './channels-routing.module';
import {ChannelsComponent} from './channels.component';
import {ChannelsListComponent} from './pages/channels-list/channels-list.component';
import {ChannelsManageComponent} from './pages/channels-manage/channels-manage.component';
import {ChannelsCalendarComponent} from './pages/channels-calendar/channels-calendar.component';
import {SharedModule} from '@shared/shared.module';
import { ChannelsCalendarSchedulesManageComponent } from './pages/channels-calendar-schedules-manage/channels-calendar-schedules-manage.component';


@NgModule({
  declarations: [ChannelsComponent, ChannelsListComponent, ChannelsManageComponent, ChannelsCalendarComponent, ChannelsCalendarSchedulesManageComponent],
  imports: [
    CommonModule,
    ChannelsRoutingModule,
    SharedModule
  ]
})
export class ChannelsModule {
}
