import {BaseResponseModel} from '@models/base-response-model';

export interface ISubjectsResponseModel extends BaseResponseModel {
  data: ISubjectModel[];
}


export interface ISubjectModel {
  id?: string;
  title: string;
}
