import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PermissionsComponent} from '@pages/permissions/permissions.component';
import {PermissionsListComponent} from '@pages/permissions/pages/permissions-list/permissions-list.component';
import {PermissionsEnum} from '@enums/permissions.enum';
import {PermissionGuard} from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '', component: PermissionsComponent, children: [
      {
        path: 'list',
        component: PermissionsListComponent,
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
export class PermissionsRoutingModule {
}
