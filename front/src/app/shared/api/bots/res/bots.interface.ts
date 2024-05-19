import {BaseResponseModel} from '@models/base-response-model';

export interface IBotsResponseModel extends BaseResponseModel {
  data: IBotsModel[];
}

export interface IBotsModel {
  id?: string;
  title: string;
  token: string;
  set_webhook: boolean;
  updated_at?: string;
  created_at?: string;
}
