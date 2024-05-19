import {BaseResponseModel} from '@models/base-response-model';

export interface IChainsContentResponseModel extends BaseResponseModel {
  data: IChainsContentModel[];
}

export interface IChainsContentModel {
  id?: string;
  title?: string;
  is_active?: boolean;
  telegram_bot_id?: string;
  time_from?: string;
  time_to?: string;
  send_interval?: string;
}
