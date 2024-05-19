import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MessengerRoutingModule} from './messenger-routing.module';
import {MessengerComponent} from './messenger.component';
import {CustomersListComponent} from './pages/customers-list/customers-list.component';
import {MessengerChatComponent} from './pages/messenger-chat/messenger-chat.component';
import {SharedModule} from '@shared/shared.module';
import {CustomerChatsListComponent} from './pages/messenger-chat/pages/customer-chats-list/customer-chats-list.component';
import {MessangerBoxComponent} from './pages/messenger-chat/pages/messanger-box/messanger-box.component';
import {MessegeCardComponent} from '@pages/messenger/pages/messenger-chat/pages/messege-card/messege-card.component';


@NgModule({
  declarations: [
    MessengerComponent,
    CustomersListComponent,
    MessengerChatComponent,
    CustomerChatsListComponent,
    MessangerBoxComponent,
    MessegeCardComponent
  ],
  imports: [
    CommonModule,
    MessengerRoutingModule,
    SharedModule
  ]
})
export class MessengerModule {
}
