import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BotsComponent} from './bots.component';
import {BotsListComponent} from './pages/bots-list/bots-list.component';
import {BotsManageComponent} from './pages/bots-manage/bots-manage.component';
import {BotsRoutingModule} from '@pages/bots/bots-routing.module';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [BotsComponent, BotsListComponent, BotsManageComponent],
  imports: [
    CommonModule,
    BotsRoutingModule,
    SharedModule
  ]
})
export class BotsModule {
}
