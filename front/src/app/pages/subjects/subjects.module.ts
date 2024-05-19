import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SubjectsRoutingModule} from './subjects-routing.module';
import {SubjectsComponent} from './subjects.component';
import {SubjectsListComponent} from './pages/subjects-list/subjects-list.component';
import {SubjectsManageComponent} from './pages/subjects-manage/subjects-manage.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [SubjectsComponent, SubjectsListComponent, SubjectsManageComponent],
  imports: [
    CommonModule,
    SubjectsRoutingModule,
    SharedModule
  ]
})
export class SubjectsModule {
}
