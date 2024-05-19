import {IPermissionsModel} from '@api/permissions/res/permissions.interface';
import {IRolesModel} from '@api/roles/res/roles.interface';
import {BaseResponseModel} from '@models/base-response-model';
import {LanguageEnum} from '@enums/language.enum';


export interface IUsersResponseModel extends BaseResponseModel {
  data: IUsersModel[];
}

export interface IUsersModel {
  id?: number;
  name?: string;
  email?: string;
  email_verified_at?: null | any;
  created_at?: string;
  updated_at?: string;
  invite_token?: string;
  token?: string;
  permissions?: IPermissionsModel[];
  password?: string;
  roles?: IRolesModel[];
  language?: LanguageEnum;
}
