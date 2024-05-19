import {Injectable} from '@angular/core';
import {AuthService} from '@api/auth/auth.service';
import {AuthHelperService} from '@pages/auth/services/auth-helper.service';
import {finalize} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserInfoPreloader {

  constructor(
    private authService: AuthService,
    private authHelperService: AuthHelperService
  ) {
  }

  load() {
    return new Promise(async (resolve, reject) => {
      if (localStorage.getItem('token')) {
        this.authService.getUserInfo()
          .pipe(finalize(() => resolve(true)))
          .subscribe((user) => {
            localStorage.setItem('language', user.language);
            this.authHelperService.setUserInfoAndSetAvailablePermissions(user);
          });
      } else {
        resolve(true);
      }
    });
  }
}
