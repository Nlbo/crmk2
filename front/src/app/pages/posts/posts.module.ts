import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PostsRoutingModule} from './posts-routing.module';
import {PostsComponent} from './posts.component';
import {PostsListComponent} from './pages/posts-list/posts-list.component';
import {PostsManageComponent} from './pages/posts-manage/posts-manage.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [PostsComponent, PostsListComponent, PostsManageComponent],
  imports: [
    CommonModule,
    PostsRoutingModule,
    SharedModule
  ],
})
export class PostsModule {
}
