import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChainsContentRoutingModule} from './chains-content-routing.module';
import {ChainsContentComponent} from './chains-content.component';
import {ChainsContentListComponent} from './pages/chains-content-list/chains-content-list.component';
import {SharedModule} from '@shared/shared.module';
import { ChainsContentManageComponent } from './pages/chains-content-manage/chains-content-manage.component';


@NgModule({
  declarations: [ChainsContentComponent, ChainsContentListComponent, ChainsContentManageComponent],
  imports: [
    CommonModule,
    ChainsContentRoutingModule,
    SharedModule
  ]
})
export class ChainsContentModule {
}
