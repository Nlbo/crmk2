import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UsersComponent} from '@pages/users/users.component';
import {PermissionGuard} from '@shared/guards/permission.guard';
import {PermissionsEnum} from '@enums/permissions.enum';
import {CountriesListComponent} from '@pages/countries/pages/countries-list/countries-list.component';

const routes: Routes = [
  {
    path: '', component: UsersComponent, children: [
      {
        path: 'list',
        component: CountriesListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewCountriesList]}
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

export class CountriesRoutingModule { }
