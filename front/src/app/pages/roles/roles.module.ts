import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RolesRoutingModule} from './roles-routing.module';
import {RolesComponent} from './roles.component';
import {RolesListComponent} from './pages/roles-list/roles-list.component';
import {RolesManageComponent} from './pages/roles-manage/roles-manage.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [RolesComponent, RolesListComponent, RolesManageComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    SharedModule
  ]
})
export class RolesModule {
}
