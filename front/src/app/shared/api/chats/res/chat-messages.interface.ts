import {BaseResponseModel} from '@models/base-response-model';
import {ICustomersModel} from '@api/customers/res/customers.interface';
import {IStickersModel} from '@api/stickers/res/stickers.interface';
import {IAttachmentsModel} from '@api/posts/res/posts.interface';
import {IUsersModel} from '@api/users/res/users.interface';
import {IAvatarModel} from '@api/customers/res/avatar.interfacce';

export interface IChatsMessagesResponseModel extends BaseResponseModel {
  data: IChatsMessages[];
}


export interface IChatsMessages {
  attachments: IAttachmentsModel[]
  chat_id: string;
  created_at: string;
  date: string;
  edit_date: string;
  format: string;
  from_id: string;
  from_type: string;
  id: string;
  media_group_id: string
  message_from: MessageFromModel;
  message_to: MessageToModel;
  original: MessageOriginalModel;
  original_id: number;
  reply_to: string
  sticker: IStickersModel
  sticker_id: string
  text: string;
  to_id: string;
  to_type: string;
  type: string;
  updated_at: string
  user: IUsersModel;
  user_id: string;
}

export interface MessageToModel {
  created_at: string;
  id: string;
  title: string;
  token: string;
  updated_at: string;
  avatar: IAvatarModel;
  first_name: string;
  last_name: string;
}
export interface MessageFromModel {
  created_at: string;
  first_name: string;
  id: string;
  is_bot: number;
  language_code: string;
  last_name: string;
  telegram_user_id: number;
  updated_at: string;
  username: string;
  avatar: IAvatarModel;
  title: string;
}

export interface MessageOriginalModel {
  message: {
    chat: {
      first_name: string;
      id: number;
      last_name: string;
      type: string;
      username: string;
    }
    date: number;
    from: {
      first_name: string;
      id: number;
      is_bot: string;
      language_code: string;
      last_name: string;
      username: string;
    }
    message_id: number;
    text: string;
  }
  update_id: number;
}
