import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CharactersRoutingModule} from './characters-routing.module';
import {CharactersComponent} from './characters.component';
import {CharactersListComponent} from './pages/characters-list/characters-list.component';
import {CharactersManageComponent} from './pages/characters-manage/characters-manage.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [CharactersComponent, CharactersListComponent, CharactersManageComponent],
  imports: [
    CommonModule,
    CharactersRoutingModule,
    SharedModule
  ]
})
export class CharactersModule {
}
