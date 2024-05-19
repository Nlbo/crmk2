import {BaseResponseModel} from '@models/base-response-model';

export interface IPermissionsResponseModel extends BaseResponseModel {
  data: IPermissionsModel[];
}


export interface IPermissionsModel {
  created_at: string;
  guard_name: string;
  id: number;
  name: string;
  description: string;
  title: string;
  pivot: {
    model_id: number;
    permission_id: number;
    model_type: string;
  };
  updated_at: string;
}
