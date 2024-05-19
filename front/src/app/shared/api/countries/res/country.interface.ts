import {BaseResponseModel} from '@models/base-response-model';

export interface ICountryResponseModel extends BaseResponseModel {
  data: ICountryModel[];
}

export interface ICountryModel {
  id: string;
  code: string;
  title: string;
  created_at: string;
  updated_at: string;
}
