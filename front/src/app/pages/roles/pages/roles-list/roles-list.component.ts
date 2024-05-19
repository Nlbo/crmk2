import {Component, OnDestroy, OnInit} from '@angular/core';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {RolesService} from '@api/roles/roles.service';
import {IRolesModel, IRolesResponseModel} from '@api/roles/res/roles.interface';
import {PermissionsEnum} from '@enums/permissions.enum';
import {TranslateLocalService} from '@services/translate-local.service';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit, OnDestroy{

  rolesResponse: IRolesResponseModel = null;
  rolesList: IRolesModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  ManageTypesEnum = ManageTypesEnum;
  PermissionsEnum = PermissionsEnum;
  subscribe;

  constructor(public rolesService: RolesService, private translateLocalService: TranslateLocalService) {
  }

  ngOnInit() {
    this.initializeValues();
    this.subscribe = this.translateLocalService.languageChangeEvent.subscribe(() => {
      this.initializeValues();
    });
  }

  initializeValues() {
    this.rolesService.getRolesList(this.pageIndex).subscribe((data: IRolesResponseModel) => {
      this.rolesResponse = data;
      this.rolesList = this.rolesResponse.data;
    });
  }

  deleteRole(id: string) {
    this.rolesService.deleteRole(id).subscribe((data) => {
      this.initializeValues();
    })
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }
}
