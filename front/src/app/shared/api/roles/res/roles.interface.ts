import {IPermissionsModel} from '@api/permissions/res/permissions.interface';
import {BaseResponseModel} from '@models/base-response-model';

export interface IRolesResponseModel extends BaseResponseModel {
  data: IRolesModel[];
}


export interface IRolesModel {
  created_at?: string;
  guard_name?: string;
  id?: number;
  name?: string;
  pivot?: {
    model_id: number;
    permission_id: number;
    model_type: string;
  }
  updated_at?: string;
  permissions: IPermissionsModel[];
}
