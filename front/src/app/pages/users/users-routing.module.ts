import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from '@pages/users/users.component';
import {UsersListComponent} from '@pages/users/pages/users-list/users-list.component';
import {UsersManageComponent} from '@pages/users/pages/users-manage/users-manage.component';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {PermissionsEnum} from '@enums/permissions.enum';
import {PermissionGuard} from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '', component: UsersComponent, children: [
      {
        path: 'list',
        component: UsersListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewUsers]}
      },
      {
        path: ManageTypesEnum.Add,
        component: UsersManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.InviteUsers]}
      },
      {
        path: `${ManageTypesEnum.Edit}/:id`,
        component: UsersManageComponent,
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
export class UsersRoutingModule {
}
