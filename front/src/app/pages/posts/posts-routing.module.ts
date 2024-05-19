import {NgModule} from '@angular/core';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {PostsComponent} from '@pages/posts/posts.component';
import {PostsListComponent} from '@pages/posts/pages/posts-list/posts-list.component';
import {PostsManageComponent} from '@pages/posts/pages/posts-manage/posts-manage.component';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {PermissionsEnum} from '@enums/permissions.enum';
import {PermissionGuard} from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '', component: PostsComponent, children: [
      {
        path: 'list',
        component: PostsListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewPostsList], reuse: true}
      },
      {
        path: ManageTypesEnum.Add,
        component: PostsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewPost]}
      },
      {
        path: `${ManageTypesEnum.Edit}/:id`,
        component: PostsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewPost, PermissionsEnum.UpdatePost]}
      },
      {
        path: `${ManageTypesEnum.Preview}/:id`,
        component: PostsManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewPost]}
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
  exports: [RouterModule],
})
export class PostsRoutingModule {
}
