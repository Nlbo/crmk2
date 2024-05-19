import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules, PreloadingStrategy, Route, RouteReuseStrategy} from '@angular/router';
import {AuthGuard} from '@shared/guards/auth.guard';
import {Observable, of} from 'rxjs';
import {AdminComponent} from "./workspaces/admin/admin.component";
import {PostsComponent} from "@pages/posts/posts.component";
import {CustomRouteReuseStrategy} from "@pages/posts/custom-route-reuse-strategy";

export class CustomPreloader implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data && route.data.preload ? load() : of(null);
  }
}


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
    data: {preload: true}
  },
  {
    path: 'result',
    loadChildren: () => import('./pages/result-pages/result-pages.module').then(m => m.ResultPagesModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./workspaces/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: CustomPreloader
  })],
  exports: [RouterModule],
  providers: [CustomPreloader, {
    provide: RouteReuseStrategy,
    useClass: CustomRouteReuseStrategy,
  }],
})

export class AppRoutingModule {
}

