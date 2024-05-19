import {Component, OnInit} from '@angular/core';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {UsersService} from '@api/users/users.service';
import {IUsersModel, IUsersResponseModel} from '@api/users/res/users.interface';
import {PermissionsEnum} from '@enums/permissions.enum';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  usersResponse: IUsersResponseModel = null;
  usersList: IUsersModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  ManageTypesEnum = ManageTypesEnum;
  PermissionsEnum = PermissionsEnum;

  constructor(public usersService: UsersService) {
  }

  ngOnInit() {
    this.initializeValues();
  }

  initializeValues() {
    this.usersService.getUsersList(this.pageIndex).subscribe((data) => {
      this.usersResponse = data;
      this.usersList = this.usersResponse.data;
    });
  }

  deleteUser(id: string) {
    this.usersService.deleteUser(id).subscribe((data) => {
      this.initializeValues();
    })
  }

}
