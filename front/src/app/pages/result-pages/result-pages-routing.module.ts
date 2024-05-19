import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FaildSubmissionComponent} from '@pages/result-pages/pages/faild-submission/faild-submission.component';
import {InfoComponent} from '@pages/result-pages/pages/info/info.component';
import {NotFoundComponent} from '@pages/result-pages/pages/not-found/not-found.component';
import {PermissionDeniedComponent} from '@pages/result-pages/pages/permission-denied/permission-denied.component';
import {ServerErrorComponent} from '@pages/result-pages/pages/server-error/server-error.component';
import {SuccessComponent} from '@pages/result-pages/pages/success/success.component';
import {WarningComponent} from '@pages/result-pages/pages/warning/warning.component';
import {ResultPagesComponent} from '@pages/result-pages/result-pages.component';
import {HaveNotPermissionsComponent} from '@pages/result-pages/pages/have-not-permissions/have-not-permissions.component';


const routes: Routes = [
  {
    path: '',
    component: ResultPagesComponent,
    children: [
      {
        path: 'faild-submission',
        component: FaildSubmissionComponent
      },
      {
        path: 'info',
        component: InfoComponent
      },
      {
        path: 'not-found',
        component: NotFoundComponent
      },
      {
        path: 'server-error',
        component: ServerErrorComponent
      },
      {
        path: 'success',
        component: SuccessComponent
      },
      {
        path: 'permission-denied',
        component: PermissionDeniedComponent
      },
      {
        path: 'warning',
        component: WarningComponent
      },
      {
        path: 'have-not-permissions',
        component: HaveNotPermissionsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultPagesRoutingModule { }
