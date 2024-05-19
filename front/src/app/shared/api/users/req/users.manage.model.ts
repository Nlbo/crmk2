import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IUsersModel} from '@api/users/res/users.interface';
import {IAcceptInviteFromUserRequestModel} from '@api/users/req/accept-invite-from-user-request.interface';
import {AppHelper} from "@services/app-helper.service";

export class UsersManageModel {
  id = new FormControl('');
  name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  originalPermissions = new FormControl([]);
  originalRoles = new FormControl([]);
  permissions = new FormControl([]);
  roles = new FormControl([]);

  formGroup = new FormGroup({
    email: this.email,
    name: this.name,
    password: this.password,
    permissions: this.permissions,
    roles: this.roles
  });

  getCreateValues(): IUsersModel {
    return {
      email: this.email.value,
      name: this.name.value,
      password: this.password.value,
      permissions: this.permissions.value,
      roles: this.roles.value,
    };
  }

  getEditValues(): IUsersModel {
    const obj: IUsersModel = {
      email: this.email.value,
      name: this.name.value,
    };
    if (this.originalPermissions.value.length !== this.permissions.value.length ||
      this.permissions.value.filter(item => !this.originalPermissions.value.includes(item)).length) {
      obj.permissions = this.permissions.value;
    }
    if (this.originalRoles.value.length !== this.roles.value.length ||
      this.roles.value.filter(item => !this.originalRoles.value.includes(item)).length) {
      obj.roles = this.roles.value;
    }
    if (this.password.value) {
      obj.password = this.password.value;
    }
    return obj;
  }


  manageAllFields(flag = false) {
    if (flag) {
      this.name.enable();
      this.permissions.enable();
      this.roles.enable();
      this.email.enable();
      this.password.enable();
    } else {
      this.name.disable();
      this.roles.disable();
      this.permissions.disable();
      this.email.disable();
      this.password.disable();
    }
  }
}
