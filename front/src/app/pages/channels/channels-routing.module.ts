import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {ChannelsComponent} from '@pages/channels/channels.component';
import {ChannelsListComponent} from '@pages/channels/pages/channels-list/channels-list.component';
import {ChannelsManageComponent} from '@pages/channels/pages/channels-manage/channels-manage.component';
import {ChannelsCalendarComponent} from '@pages/channels/pages/channels-calendar/channels-calendar.component';
import {PermissionsEnum} from '@enums/permissions.enum';
import {PermissionGuard} from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '', component: ChannelsComponent, children: [
      {
        path: 'list',
        component: ChannelsListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewChannelsList]}
      },
      {
        path: ManageTypesEnum.Add,
        component: ChannelsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.CreateChannel]}
      },
      {
        path: `${ManageTypesEnum.Edit}/:id`,
        component: ChannelsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewChannel, PermissionsEnum.UpdateChannel]}
      },
      {
        path: `${ManageTypesEnum.Preview}/:id`,
        component: ChannelsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewChannel]}
      },
      {
        path: `:id/calendar`,
        component: ChannelsCalendarComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewSchedule]}
      },
      {
        path: '**',
        redirectTo: 'list',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelsRoutingModule {
}
