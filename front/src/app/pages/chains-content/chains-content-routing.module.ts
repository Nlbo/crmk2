import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChainsContentComponent} from '@pages/chains-content/chains-content.component';
import {ChainsContentListComponent} from '@pages/chains-content/pages/chains-content-list/chains-content-list.component';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {ChainsContentManageComponent} from '@pages/chains-content/pages/chains-content-manage/chains-content-manage.component';
import {PermissionsEnum} from '@enums/permissions.enum';
import {PermissionGuard} from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '', component: ChainsContentComponent, children: [
      {
        path: 'list',
        component: ChainsContentListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewContentsList]}
      },
      {
        path: ManageTypesEnum.Add,
        component: ChainsContentManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.CreateContent]}
      },
      {
        path: `${ManageTypesEnum.Edit}/:id`,
        component: ChainsContentManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewContent, PermissionsEnum.UpdateContent]}
      },
      {
        path: `${ManageTypesEnum.Preview}/:id`,
        component: ChainsContentManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewContent]}
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
export class ChainsContentRoutingModule { }
