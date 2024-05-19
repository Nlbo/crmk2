import {BaseResponseModel} from '@models/base-response-model';
import {IManagersModel} from '@api/channels/res/channels.interface';
import {IChatsMessages} from '@api/chats/res/chat-messages.interface';
import {ICustomersModel} from '@api/customers/res/customers.interface';

export interface IChatsCustomersChatsResponseModel extends BaseResponseModel {
  data: IChatsCustomersChats[];
}

export interface IChatsCustomersChats {
  id: string;
  is_blocked: number;
  manager: IManagersModel;
  customer: ICustomersModel;
  messages: IChatsMessages[];
}
