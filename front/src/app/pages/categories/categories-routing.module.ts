import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {CategoriesComponent} from '@pages/categories/categories.component';
import {CategoriesListComponent} from '@pages/categories/pages/categories-list/categories-list.component';
import {CategoriesManageComponent} from '@pages/categories/pages/categories-manage/categories-manage.component';
import {PermissionsEnum} from '@enums/permissions.enum';
import {PermissionGuard} from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '', component: CategoriesComponent, children: [
      {
        path: 'list',
        component: CategoriesListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewCategoriesList]}
      },
      {
        path: ManageTypesEnum.Add,
        component: CategoriesManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.CreateCategory]}
      },
      {
        path: `${ManageTypesEnum.Edit}/:id`,
        component: CategoriesManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewCategory, PermissionsEnum.UpdateCategory]}
      },
      {
        path: `${ManageTypesEnum.Preview}/:id`,
        component: CategoriesManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewCategory]}
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
export class CategoriesRoutingModule { }
