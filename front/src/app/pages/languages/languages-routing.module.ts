import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LanguagesComponent} from '@pages/languages/languages.component';
import {LanguagesListComponent} from '@pages/languages/pages/languages-list/languages-list.component';
import {PermissionsEnum} from '@enums/permissions.enum';
import {PermissionGuard} from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '', component: LanguagesComponent, children: [
      {
        path: 'list',
        component: LanguagesListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewLanguagesList]}
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
export class LanguagesRoutingModule {
}
