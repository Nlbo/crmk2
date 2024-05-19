import {BaseResponseModel} from '@models/base-response-model';

export interface ICategoriesResponseModel extends BaseResponseModel {
  data: ICategoriesModel[];
}

export interface ICategoriesModel {
  id?: string;
  title: string
}
