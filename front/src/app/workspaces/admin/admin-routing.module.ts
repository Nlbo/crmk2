import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {PermissionGuard} from '@shared/guards/permission.guard';
import {PermissionsEnum} from '@enums/permissions.enum';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'messenger',
        loadChildren: () => import('@pages/messenger/messenger.module').then(m => m.MessengerModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ManageChats]}
      },
      {
        path: 'bots/:telegramBotId/chains/:chainId/content',
        loadChildren: () => import('@pages/chains-content/chains-content.module').then(m => m.ChainsContentModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewContentsList]}
      },
      {
        path: 'bots/:telegramBotId/chains',
        loadChildren: () => import('@pages/chains/chains.module').then(m => m.ChainsModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewChainsList]}
      },
      {
        path: 'bots',
        loadChildren: () => import('@pages/bots/bots.module').then(m => m.BotsModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewBotsList]}
      },
      {
        path: 'channels',
        loadChildren: () => import('@pages/channels/channels.module').then(m => m.ChannelsModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewChannelsList]}
      },
      {
        path: 'posts',
        loadChildren: () => import('@pages/posts/posts.module').then(m => m.PostsModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewPostsList]}
      },
      {
        path: 'dictionaries/languages',
        loadChildren: () => import('@pages/languages/languages.module').then(m => m.LanguagesModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewLanguagesList]}
      },
      {
        path: 'dictionaries/categories',
        loadChildren: () => import('@pages/categories/categories.module').then(m => m.CategoriesModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewCategoriesList]}
      },
      {
        path: 'dictionaries/characters',
        loadChildren: () => import('@pages/characters/characters.module').then(m => m.CharactersModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewCharactersList]}
      },
      {
        path: 'dictionaries/countries',
        loadChildren: () => import('@pages/countries/countries.module').then(m => m.CountriesModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewCountriesList]}
      },
      {
        path: 'dictionaries/subjects',
        loadChildren: () => import('@pages/subjects/subjects.module').then(m => m.SubjectsModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ViewSubjectsList]}
      },
      {
        path: 'settings/permissions',
        loadChildren: () => import('@pages/permissions/permissions.module').then(m => m.PermissionsModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ManageRolesAndPermissions]}
      },
      {
        path: 'settings/roles',
        loadChildren: () => import('@pages/roles/roles.module').then(m => m.RolesModule),
        canActivate: [PermissionGuard],
        data: {permissions: [PermissionsEnum.ManageRolesAndPermissions]}
      },
      {
        path: 'settings/users',
        loadChildren: () => import('@pages/users/users.module').then(m => m.UsersModule),
      },
      {
        path: '**',
        redirectTo: 'bots',
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
