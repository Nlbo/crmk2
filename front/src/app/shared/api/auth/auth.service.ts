import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginReqModel} from './req/login-req.model';
import {Observable} from 'rxjs';
import {ILoginResModel} from './res/login-res.interface';
import {IUsersModel} from '@api/users/res/users.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  login(data: LoginReqModel): Observable<ILoginResModel> {
    return this.httpClient.post<ILoginResModel>('login', data);
  }

  logout() {
    return this.httpClient.post<ILoginResModel>('login', {});
  }

  getUserInfo(): Observable<IUsersModel> {
    return this.httpClient.get<IUsersModel>('users/me');
  }

  logoutFromAll() {
    return this.httpClient.post('login', {});
  }
}
