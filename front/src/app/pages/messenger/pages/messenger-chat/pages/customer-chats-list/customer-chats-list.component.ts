import { Component, OnInit } from '@angular/core';
import {IChatsCustomersChats, IChatsCustomersChatsResponseModel} from '@api/customers/res/customers-chats.interface';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ChatsService} from '@api/chats/chats.service';
import {CustomersService} from '@api/customers/customers.service';

@Component({
  selector: 'app-customer-chats-list',
  templateUrl: './customer-chats-list.component.html',
  styleUrls: ['./customer-chats-list.component.scss']
})
export class CustomerChatsListComponent implements OnInit {
  customersList: IChatsCustomersChats[] = [];
  loading = false;
  chatId: string = null;
  customerId: string = null;

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private chatsService: ChatsService,
    private customersService: CustomersService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.chatId = params.id;
        if (params.customerId) {
          this.customerId = params.customerId;
        }
        this.getCustomersList();
      } else {
        this.router.navigate(['', 'messenger']);
      }
    });
  }

  getLocalStorageItem(name: string) {
    return localStorage.getItem(name);
  }

  getCustomersList() {
    this.customersService.getCustomerChatsList(this.chatId).subscribe((chatsCustomersChatsResponse: IChatsCustomersChatsResponseModel) => {
      this.customersList = chatsCustomersChatsResponse.data;
      this.chatsService.isChangeChatSubject.next(!!this.customersList.find(item => item.id === this.customerId)?.is_blocked);
    });
  }


  setIsBlockedState(isBlocked: number): void {
    this.chatsService.isChangeChatSubject.next(!!isBlocked);
  }
}
