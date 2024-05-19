import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CharactersComponent} from '@pages/characters/characters.component';
import {CharactersListComponent} from '@pages/characters/pages/characters-list/characters-list.component';
import {CharactersManageComponent} from '@pages/characters/pages/characters-manage/characters-manage.component';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {PermissionsEnum} from '@enums/permissions.enum';
import {PermissionGuard} from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '', component: CharactersComponent, children: [
      {
        path: 'list',
        component: CharactersListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewCharactersList]}
      },
      {
        path: ManageTypesEnum.Add,
        component: CharactersManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.CreateCharacter]}
      },
      {
        path: `${ManageTypesEnum.Edit}/:id`,
        component: CharactersManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewCharacter, PermissionsEnum.UpdateCharacter]}
      },
      {
        path: `${ManageTypesEnum.Preview}/:id`,
        component: CharactersManageComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewCharacter]}
      },
      {
        path: '**',
        redirectTo: 'list',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharactersRoutingModule {
}
