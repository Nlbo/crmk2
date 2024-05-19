import {BaseResponseModel} from '@models/base-response-model';

export interface ILanguagesResponseModel extends BaseResponseModel {
  data: ILanguagesModel[];
}

export interface ILanguagesModel {
  id?: string;
  title: string;
  code: string
}
