import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChainsComponent} from '@pages/chains/chains.component';
import {ChainsListComponent} from '@pages/chains/pages/chains-list/chains-list.component';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {ChainsManageComponent} from '@pages/chains/pages/chains-manage/chains-manage.component';
import {PermissionsEnum} from '@enums/permissions.enum';
import {PermissionGuard} from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '', component: ChainsComponent, children: [
      {
        path: 'list',
        component: ChainsListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewChainsList]}

      },
      {
        path: ManageTypesEnum.Add,
        component: ChainsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.CreateChain]}
      },
      {
        path: `${ManageTypesEnum.Edit}/:id`,
        component: ChainsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewChain, PermissionsEnum.UpdateChain]}
      },
      {
        path: `${ManageTypesEnum.Preview}/:id`,
        component: ChainsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewChain]}
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
export class ChainsRoutingModule {
}
