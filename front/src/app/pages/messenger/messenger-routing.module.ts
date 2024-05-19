import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MessengerComponent} from '@pages/messenger/messenger.component';
import {CustomersListComponent} from '@pages/messenger/pages/customers-list/customers-list.component';
import {MessengerChatComponent} from '@pages/messenger/pages/messenger-chat/messenger-chat.component';
import {MessangerBoxComponent} from '@pages/messenger/pages/messenger-chat/pages/messanger-box/messanger-box.component';
import {PermissionsEnum} from '@enums/permissions.enum';
import {PermissionGuard} from '@shared/guards/permission.guard';

const routes: Routes = [
  {
    path: '', component: MessengerComponent,
    canActivate: [PermissionGuard],
    data: {permissions: [PermissionsEnum.ManageChats]},
    children: [
      {
        path: 'list',
        component: CustomersListComponent,
      },
      {
        path: 'chats/:id/:customerId',
        component: MessengerChatComponent,
        children: [
          {
            path: '',
            component: MessangerBoxComponent,
          }
        ]
      },
      {
        path: 'chats/:id',
        component: MessengerChatComponent,
      },
      {
        path: '**',
        redirectTo: 'list',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessengerRoutingModule { }
