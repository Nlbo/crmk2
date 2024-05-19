import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BotsComponent} from '@pages/bots/bots.component';
import {BotsListComponent} from '@pages/bots/pages/bots-list/bots-list.component';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {BotsManageComponent} from '@pages/bots/pages/bots-manage/bots-manage.component';
import {PermissionsEnum} from '@enums/permissions.enum';
import {PermissionGuard} from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '', component: BotsComponent, children: [
      {
        path: 'list',
        component: BotsListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewBotsList]},
      },
      {
        path: ManageTypesEnum.Add,
        component: BotsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.CreateBot]}
      },
      {
        path: `${ManageTypesEnum.Edit}/:id`,
        component: BotsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewBot, PermissionsEnum.UpdateBot]}
      },
      {
        path: `${ManageTypesEnum.Preview}/:id`,
        component: BotsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewBot]}
      },
      {
        path: '**',
        redirectTo: 'list',
        pathMatch: 'full'
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BotsRoutingModule {
}
