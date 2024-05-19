import {Component, OnInit} from '@angular/core';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {CustomersService} from '@api/customers/customers.service';
import {ICustomersModel, ICustomersResponseModel} from '@api/customers/res/customers.interface';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {

  visibleUsernameFilter: boolean = false;
  visibleFirstNameFilter: boolean = false;
  visibleLastNameFilter: boolean = false;
  customersResponse: ICustomersResponseModel = null;
  customersList: ICustomersModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  ManageTypesEnum = ManageTypesEnum;

  constructor(public customersService: CustomersService) {
  }

  ngOnInit() {
    this.initializeValues();
  }

  initializeValues() {
    this.closeAllFilters();
    this.customersService.getCustomersList(this.pageIndex).subscribe((data) => {
      this.customersResponse = data;
      this.customersList = this.customersResponse.data;
    });
  }

  deleteCustomer(id: string) {
    this.customersService.deleteCustomer(id).subscribe((data) => {
      this.initializeValues();
    });
  }

  closeAllFilters() {
    this.visibleUsernameFilter = false;
    this.visibleFirstNameFilter = false;
    this.visibleLastNameFilter = false;
  }
}
