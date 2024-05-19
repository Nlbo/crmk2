import {Injectable} from '@angular/core';
import {NESTED_URL_BY_PERMISSIONS, PermissionsEnum} from '@enums/permissions.enum';
import {IUsersModel} from '@api/users/res/users.interface';
import {AppHelper} from '@services/app-helper.service';

const listsPermissions = [
  PermissionsEnum.ViewBotsList,
  PermissionsEnum.ViewChannelsList,
  PermissionsEnum.ViewPost,
  PermissionsEnum.ViewLanguagesList,
  PermissionsEnum.ViewCategoriesList,
  PermissionsEnum.ViewCharactersList,
  PermissionsEnum.ManageRolesAndPermissions,
  PermissionsEnum.ViewUsers,
  PermissionsEnum.ManageChats
];

@Injectable({
  providedIn: 'root'
})

export class AuthHelperService {

  availablePermissionsList: string[] = [];
  user: IUsersModel = null;

  constructor() {
  }

  getFirstAvailablePageRoute(): string {
    const intersection = AppHelper.intersection(listsPermissions, this.availablePermissionsList);
    let firstUrl;
    intersection.forEach(item => {
      if (NESTED_URL_BY_PERMISSIONS[item]) {
        firstUrl = NESTED_URL_BY_PERMISSIONS[item];
      }
    });
    return firstUrl;
  }

  setUserInfoAndSetAvailablePermissions(user: IUsersModel): void {
    this.user = user;
    this.availablePermissionsList = user.permissions.map(permission => permission.name);
    user.roles.forEach(role => {
      this.availablePermissionsList = [...this.availablePermissionsList, ...role.permissions.map(item => item.name)];
    });
  }
}
