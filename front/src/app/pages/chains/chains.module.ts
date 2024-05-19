import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChainsRoutingModule} from './chains-routing.module';
import {ChainsComponent} from './chains.component';
import {ChainsListComponent} from './pages/chains-list/chains-list.component';
import {ChainsManageComponent} from './pages/chains-manage/chains-manage.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [ChainsComponent, ChainsListComponent, ChainsManageComponent],
  imports: [
    CommonModule,
    ChainsRoutingModule,
    SharedModule
  ]
})
export class ChainsModule {
}
