import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {CustomersService} from '@api/customers/customers.service';
import {ICustomersModel} from '@api/customers/res/customers.interface';

@Component({
  selector: 'app-messenger-chat',
  templateUrl: './messenger-chat.component.html',
  styleUrls: ['./messenger-chat.component.scss']
})
export class MessengerChatComponent implements OnInit {

  chatId: string = null;
  customerId: string = null;
  customer: ICustomersModel = null;

  constructor(private activatedRoute: ActivatedRoute, private customersService: CustomersService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.customerId = params.id;
        this.getCustomer();
      }
      this.activatedRoute.firstChild?.params.subscribe((params: Params) => {
        if (params.customerId) {
          this.chatId = params.customerId;
        }
      });
    });
  }

  getLocalStorageItem(name: string) {
    return localStorage.getItem(name);
  }

  getCustomer() {
    this.customersService.getOneCustomer(this.customerId).subscribe((customer: ICustomersModel) => {
      this.customer = customer;
    });
  }

}
