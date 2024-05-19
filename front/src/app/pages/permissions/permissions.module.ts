import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PermissionsRoutingModule} from './permissions-routing.module';
import {PermissionsComponent} from './permissions.component';
import {PermissionsListComponent} from './pages/permissions-list/permissions-list.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [PermissionsComponent, PermissionsListComponent],
  imports: [
    CommonModule,
    PermissionsRoutingModule,
    SharedModule
  ]
})
export class PermissionsModule {
}
