import {ComponentRef, Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import * as _ from 'lodash';
import clean from 'lodash-clean'
import {NESTED_URL_BY_PERMISSIONS} from '@enums/permissions.enum';
import {MenuHelperService} from '../../workspaces/admin/services/menu-helper.service';
import {AuthHelperService} from '@pages/auth/services/auth-helper.service';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {NzMessageService} from 'ng-zorro-antd/message';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AppHelper {

  constructor(
    private menuHelperService: MenuHelperService,
    private authHelperService: AuthHelperService,
    public msg: NzMessageService
  ) {  }

  static isInnerContentPadding = true;
  static isStopErrorMessaging: boolean;
  static changeRouteEvent: BehaviorSubject<string> = new BehaviorSubject('');
  static changeRouteEventLastValueBeforeChange: string = '';

  static jwtDecode(jwt) {
    const helper = new JwtHelperService();
    return helper.decodeToken(jwt);
  }

  static isNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  static getBase64(file: NzUploadFile | Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  static intersection(arr1, arr2): any[] {
    return _.intersection(arr1, arr2);
  }

  static difference(arr1, arr2): any[] {
    return _.difference(arr1, arr2);
  }

  static isEqual(obj1, obj2): boolean {
    return _.isEqual(obj1, obj2);
  }

  static removeEmptyValues(obj) {
    return  clean(obj);
  }

  static downloadFileFromUrl(url) {
    const anchor: any = document.createElement('A');
    anchor.href = url;
    anchor.download = url.substr(url.lastIndexOf('/') + 1);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  static convertTZ(date, tzString) {
    return new Date((typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {timeZone: tzString}));
  }

  getFirstAvailablePageRoute(): string {
    let route: string;
    for (const menuItem of this.menuHelperService.menuItems) {
      if (route) {
        break;
      }
      const intersection = AppHelper.intersection(menuItem.permissions, this.authHelperService.availablePermissionsList);
      if (intersection.length && NESTED_URL_BY_PERMISSIONS[intersection[0]]) {
        route = `/${menuItem.url}/${NESTED_URL_BY_PERMISSIONS[intersection[0]]}`;
      } else if (intersection.length) {
        route = `/${menuItem.url}`;
      }
    }

    return route;
  }

  showError(text) {
    this.msg.error(text);
  };
}
