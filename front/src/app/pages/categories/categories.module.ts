import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CategoriesRoutingModule} from './categories-routing.module';
import {CategoriesListComponent} from './pages/categories-list/categories-list.component';
import {CategoriesManageComponent} from './pages/categories-manage/categories-manage.component';
import {CategoriesComponent} from './categories.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [CategoriesComponent, CategoriesListComponent, CategoriesManageComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule
  ]
})
export class CategoriesModule {
}
