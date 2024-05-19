import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LanguagesRoutingModule} from './languages-routing.module';
import {LanguagesComponent} from './languages.component';
import {LanguagesListComponent} from './pages/languages-list/languages-list.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [LanguagesComponent, LanguagesListComponent],
  imports: [
    CommonModule,
    LanguagesRoutingModule,
    SharedModule
  ]
})
export class LanguagesModule {
}
