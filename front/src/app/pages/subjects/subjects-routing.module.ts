import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CategoriesComponent} from '@pages/categories/categories.component';
import {PermissionGuard} from '@shared/guards/permission.guard';
import {PermissionsEnum} from '@enums/permissions.enum';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {SubjectsListComponent} from '@pages/subjects/pages/subjects-list/subjects-list.component';
import {SubjectsManageComponent} from '@pages/subjects/pages/subjects-manage/subjects-manage.component';

const routes: Routes = [
  {
    path: '', component: CategoriesComponent, children: [
      {
        path: 'list',
        component: SubjectsListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewSubjectsList]}
      },
      {
        path: ManageTypesEnum.Add,
        component: SubjectsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.CreateSubject]}
      },
      {
        path: `${ManageTypesEnum.Edit}/:id`,
        component: SubjectsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.UpdateSubject, PermissionsEnum.ViewSubject]}
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
export class SubjectsRoutingModule { }
