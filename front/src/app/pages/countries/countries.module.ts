import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CountriesRoutingModule} from './countries-routing.module';
import {CountriesComponent} from './countries.component';
import {SharedModule} from '@shared/shared.module';
import { CountriesListComponent } from './pages/countries-list/countries-list.component';


@NgModule({
  declarations: [CountriesComponent, CountriesListComponent],
  imports: [
    CommonModule,
    CountriesRoutingModule,
    SharedModule
  ]
})
export class CountriesModule {
}
