import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';

import {ResultPagesRoutingModule} from './result-pages-routing.module';
import {ResultPagesComponent} from './result-pages.component';
import {SuccessComponent} from './pages/success/success.component';
import {InfoComponent} from './pages/info/info.component';
import {WarningComponent} from './pages/warning/warning.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {ServerErrorComponent} from './pages/server-error/server-error.component';
import {FaildSubmissionComponent} from './pages/faild-submission/faild-submission.component';
import {PermissionDeniedComponent} from './pages/permission-denied/permission-denied.component';
import { HaveNotPermissionsComponent } from './pages/have-not-permissions/have-not-permissions.component';

@NgModule({
  declarations: [
    ResultPagesComponent,
    SuccessComponent,
    InfoComponent,
    WarningComponent,
    NotFoundComponent,
    ServerErrorComponent,
    FaildSubmissionComponent,
    PermissionDeniedComponent,
    HaveNotPermissionsComponent
  ],
  imports: [
    CommonModule,
    ResultPagesRoutingModule,
    SharedModule
  ]
})
export class ResultPagesModule {
}
