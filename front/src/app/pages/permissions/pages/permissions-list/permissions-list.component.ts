import {Component, OnDestroy, OnInit} from '@angular/core';
import {IPermissionsModel, IPermissionsResponseModel} from '@api/permissions/res/permissions.interface';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {PermissionsService} from '@api/permissions/permissions.service';
import {TranslateLocalService} from '@services/translate-local.service';

@Component({
  selector: 'app-permissions-list',
  templateUrl: './permissions-list.component.html',
  styleUrls: ['./permissions-list.component.scss']
})
export class PermissionsListComponent implements OnInit , OnDestroy{

  permissionsResponse: IPermissionsResponseModel = null;
  permissionsList: IPermissionsModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  ManageTypesEnum = ManageTypesEnum;
  subscribe;


  constructor(public permissionsService: PermissionsService, private translateLocalService: TranslateLocalService) {
  }

  ngOnInit(): void {
    this.initializeValues();
    this.subscribe = this.translateLocalService.languageChangeEvent.subscribe(() => {
      requestAnimationFrame(() => {
        this.initializeValues();
      })
    });
  }

  initializeValues(): void {
    this.permissionsService.getPermissionsList(this.pageIndex).subscribe((data: IPermissionsResponseModel) => {
      this.permissionsResponse = data;
      this.permissionsList = this.permissionsResponse.data;
    });
  }
  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }
}
