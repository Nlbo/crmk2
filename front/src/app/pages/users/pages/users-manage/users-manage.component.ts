import {Component, OnDestroy, OnInit} from '@angular/core';
import {of} from 'rxjs';
import {IPermissionsModel} from '@api/permissions/res/permissions.interface';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PermissionsService} from '@api/permissions/permissions.service';
import {RolesService} from '@api/roles/roles.service';
import {IRolesModel} from '@api/roles/res/roles.interface';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {UsersManageModel} from '@api/users/req/users.manage.model';
import {UsersService} from '@api/users/users.service';
import {IUsersModel} from '@api/users/res/users.interface';
import {PermissionsEnum} from '@enums/permissions.enum';
import {TranslateLocalService} from '@services/translate-local.service';
import {AuthHelperService} from "@pages/auth/services/auth-helper.service";

@Component({
  selector: 'app-users-manage',
  templateUrl: './users-manage.component.html',
  styleUrls: ['./users-manage.component.scss']
})
export class UsersManageComponent implements OnInit, OnDestroy {

  ManageType: ManageTypesEnum = ManageTypesEnum.Add;
  ManageTypesEnum = ManageTypesEnum;
  PermissionsEnum = PermissionsEnum;
  isGettingOneUser$ = of(false);
  isManagingUser = false;
  usersManageModel = new UsersManageModel();
  permissionsList: IPermissionsModel[] = [];
  rolesList: IRolesModel[] = [];
  passwordVisible = false;
  isEditPassword = false;
  subscribe;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private permissionsService: PermissionsService,
    private rolesService: RolesService,
    private usersService: UsersService,
    private authHelperService: AuthHelperService,
    private translateLocalService: TranslateLocalService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.usersManageModel.id.setValue(params.id);
        this.ManageType = ManageTypesEnum.Edit;
        this.isGettingOneUser$ = of(true);
        this.usersService.getOneUser(params.id).subscribe((user: IUsersModel) => {
          this.isGettingOneUser$ = of(false);
          if (user) {
            this.usersManageModel.originalPermissions.setValue(user.permissions.map((item => item.id)));
            this.usersManageModel.permissions.setValue(user.permissions.map((item => item.id)));
            this.usersManageModel.originalRoles.setValue(user.roles.map((item => item.id)));
            this.usersManageModel.roles.setValue(user.roles.map((item => item.id)));
            this.usersManageModel.name.setValue(user.name);
            this.usersManageModel.password.setValue(user.password);
            this.usersManageModel.email.setValue(user.email);
            if (this.router.url.includes(ManageTypesEnum.Preview)) {
              this.ManageType = ManageTypesEnum.Preview;
              this.usersManageModel.manageAllFields(false);
            }
          }
        }, err => {
          this.isGettingOneUser$ = of(false);
        });
      }
    });
    this.initializeValues();
    this.subscribe = this.translateLocalService.languageChangeEvent.subscribe(() => {
      this.initializeValues();
    });
  }

  submitForm(): void {
    switch (this.ManageType) {
      case ManageTypesEnum.Add:
        this.isManagingUser = true;
        this.usersService.registerUser(this.usersManageModel.getCreateValues()).subscribe(() => {
          this.router.navigate(['', 'settings', 'users']);
          this.isManagingUser = false;
        }, error => {
          this.isManagingUser = false;
        });
        break;
      case ManageTypesEnum.Edit:
        this.isManagingUser = true;
        this.usersService.editUser(this.usersManageModel.getEditValues(), this.usersManageModel.id.value).subscribe(() => {
          window.location.href = `${window.location.origin}/settings/users`;
          this.isManagingUser = false;
        }, error => {
          this.isManagingUser = false;
        });
        break;
    }
  }

  initializeValues() {
    if (this.authHelperService.availablePermissionsList.includes(PermissionsEnum.ManageRolesAndPermissions)) {
      this.permissionsService.getPermissionsList(0, false)
        .subscribe((permissionsList: IPermissionsModel[]) => this.permissionsList = permissionsList);
      this.rolesService.getRolesList(0, false)
        .subscribe((rolesList: IRolesModel[]) => this.rolesList = rolesList);
    }
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

}
