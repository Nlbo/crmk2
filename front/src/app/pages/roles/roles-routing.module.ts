import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {RolesComponent} from '@pages/roles/roles.component';
import {RolesListComponent} from '@pages/roles/pages/roles-list/roles-list.component';
import {RolesManageComponent} from '@pages/roles/pages/roles-manage/roles-manage.component';
import {PermissionsEnum} from '@enums/permissions.enum';
import {PermissionGuard} from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '', component: RolesComponent, children: [
      {
        path: 'list',
        component: RolesListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ManageRolesAndPermissions]}
      },
      {
        path: ManageTypesEnum.Add,
        component: RolesManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ManageRolesAndPermissions]}
      },
      {
        path: `${ManageTypesEnum.Edit}/:id`,
        component: RolesManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ManageRolesAndPermissions]}
      },
      {
        path: `${ManageTypesEnum.Preview}/:id`,
        component: RolesManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ManageRolesAndPermissions]}
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
export class RolesRoutingModule { }
