import {BaseResponseModel} from '@models/base-response-model';

export interface ICharactersResponseModel extends BaseResponseModel {
  data: ICharactersModel[];
}


export interface ICharactersModel {
  id?: string;
  title: string;
}
