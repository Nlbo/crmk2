import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AppHelper} from '@services/app-helper.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private injector: Injector) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            Object.values(error.error.errors).forEach(error => {
              this.injector.get(AppHelper).showError(error[0])
            });
          } else if (error.status === 422) {
            Object.values(error.error.errors).forEach(error => {
              this.injector.get(AppHelper).showError(error[0])
            });
          } else if (error.status === 401) {
            localStorage.clear();
            this.router.navigate(['auth', 'login']);
          } else if (error.status === 403) {
            window.location.href = 'result/permission-denied';
          } else if (error.status === 404) {
            Object.values(error.error).forEach(error => {
              this.injector.get(AppHelper).showError(error[0])
            });
            // this.router.navigate(['result', 'not-found']);
          } else if (error.status === 500) {
            // Object.values(error.error.errors).forEach(error => {
            //   this.injector.get(AppHelper).showError(error[0])
            // });
            this.router.navigate(['result', 'server-error']);
          } else {
            // this.router.navigate(['result', 'faild-submission']);
          }
          return throwError(error);
        })
      );
  }
}
