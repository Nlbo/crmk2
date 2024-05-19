import {Injectable, Injector} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {NESTED_URL_BY_PERMISSIONS, PermissionsEnum} from '@enums/permissions.enum';
import {AuthHelperService} from '@pages/auth/services/auth-helper.service';
import {AppHelper} from '@services/app-helper.service';
import {Observable} from 'rxjs';
import {retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PermissionGuard implements CanActivate {
  constructor(private authHelperService: AuthHelperService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree | any {
    if (!next.data.permissions.includes(PermissionsEnum.AllowAnyway)) {
      if (!AppHelper.intersection(this.authHelperService.availablePermissionsList, next.data.permissions).length) {
        const firstAvailableRoute = this.authHelperService.getFirstAvailablePageRoute();
        if (firstAvailableRoute) {
          this.router.navigate([firstAvailableRoute]);
        } else {
          this.router.navigate(['', 'result', 'have-not-permissions']);
          return false;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}
