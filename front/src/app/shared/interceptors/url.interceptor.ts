import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('assets/i18n/')) {
      return next.handle(req);
    }

    if (!req.url.includes('http')) {
      req = req.clone({
        url: environment.apiUrl + req.url
      });
    }
    return next.handle(req);
  }
}
