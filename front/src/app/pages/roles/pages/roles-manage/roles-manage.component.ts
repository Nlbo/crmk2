import {Component, OnDestroy, OnInit} from '@angular/core';
import {of} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {RolesManageModel} from '@api/roles/req/roles.manage.model';
import {IPermissionsModel} from '@api/permissions/res/permissions.interface';
import {IRolesModel} from '@api/roles/res/roles.interface';
import {RolesService} from '@api/roles/roles.service';
import {PermissionsService} from '@api/permissions/permissions.service';
import {TranslateLocalService} from '@services/translate-local.service';

@Component({
  selector: 'app-roles-manage',
  templateUrl: './roles-manage.component.html',
  styleUrls: ['./roles-manage.component.scss']
})
export class RolesManageComponent implements OnInit, OnDestroy {
  ManageType: ManageTypesEnum = ManageTypesEnum.Add;
  ManageTypesEnum = ManageTypesEnum;
  isGettingOneRole$ = of(false);
  isManagingRole = false;
  rolesManageModel = new RolesManageModel();
  permissionsList: IPermissionsModel[] = [];
  subscribe;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private permissionsService: PermissionsService,
    private rolesService: RolesService,
    private translateLocalService: TranslateLocalService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.rolesManageModel.id.setValue(params.id);
        this.ManageType = ManageTypesEnum.Edit;
        this.isGettingOneRole$ = of(true);
        this.rolesService.getOneRole(params.id).subscribe((role: IRolesModel) => {
          this.isGettingOneRole$ = of(false);
          if (role) {
            this.rolesManageModel.permissions.setValue(role.permissions.map((item => item.id)));
            this.rolesManageModel.name.setValue(role.name);
            this.rolesManageModel.originalName.setValue(role.name);
            if (this.router.url.includes(ManageTypesEnum.Preview)) {
              this.ManageType = ManageTypesEnum.Preview;
              this.rolesManageModel.manageAllFields(false);
            }
          }
        }, err => {
          this.isGettingOneRole$ = of(false);
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
        this.isManagingRole = true;
        this.rolesService.createRole(this.rolesManageModel.getCreateValues()).subscribe(() => {
          window.location.href = `${window.location.origin}/settings/roles`;
          this.isManagingRole = false;
        }, err => this.isManagingRole = false);
        break;
      case ManageTypesEnum.Edit:
        this.isManagingRole = true;
        this.rolesService.editRole(this.rolesManageModel.id.value, this.rolesManageModel.getEditValues()).subscribe(() => {
          window.location.href = `${window.location.origin}/settings/roles`;
          this.isManagingRole = false;
        }, err => this.isManagingRole = false);
        break;
    }
  }

  initializeValues() {
    this.permissionsService.getPermissionsList(0, false).subscribe((permissionsList: IPermissionsModel[]) => this.permissionsList = permissionsList);
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

}
