import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersRoutingModule} from './users-routing.module';
import {UsersComponent} from './users.component';
import {UsersListComponent} from './pages/users-list/users-list.component';
import {UsersManageComponent} from './pages/users-manage/users-manage.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [UsersComponent, UsersListComponent, UsersManageComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule {
}
