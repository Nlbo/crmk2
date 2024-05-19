import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IUsersModel, IUsersResponseModel} from '@api/users/res/users.interface';
import {IAcceptInviteFromUserRequestModel} from '@api/users/req/accept-invite-from-user-request.interface';
import {ILoginResModel} from '@api/auth/res/login-res.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) {
  }

  getUsersList(page = 1, paginated = true): Observable<IUsersResponseModel> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    return this.httpClient.get<IUsersResponseModel>('users', {params});
  };

  getOneUser(id: string): Observable<IUsersModel> {
    return this.httpClient.get<IUsersModel>(`users/${id}`);
  }

  editUser(data, id: number): Observable<IUsersModel> {
    return this.httpClient.patch<IUsersModel>(`users/${id}`, data);
  };

  deleteUser(id: string) {
    return this.httpClient.delete(`users/${id}`);
  }

  registerUser(data) {
    return this.httpClient.post('users/register', data);
  }

}
