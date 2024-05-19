import {IUsersModel} from '@api/users/res/users.interface';

export interface ILoginResModel {
  token: string;
  user: IUsersModel
}
