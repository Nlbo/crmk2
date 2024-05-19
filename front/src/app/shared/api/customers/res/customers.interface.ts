import {BaseResponseModel} from '@models/base-response-model';
import {IAvatarModel} from '@api/customers/res/avatar.interfacce';

export interface ICustomersResponseModel extends BaseResponseModel {
  data: ICustomersModel[];
}

export interface ICustomersModel {
  id: string;
  telegram_user_id: string;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  language_code: string;
  username: string;
  avatar: IAvatarModel;
}
