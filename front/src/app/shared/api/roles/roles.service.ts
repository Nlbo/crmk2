import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IRolesModel, IRolesResponseModel} from '@api/roles/res/roles.interface';
import {IUsersModel} from '@api/users/res/users.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private httpClient: HttpClient) {
  }

  getRolesList(page = 1, paginated = true): Observable<IRolesResponseModel | IRolesModel[]> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    return this.httpClient.get<IRolesResponseModel | IRolesModel[]>('roles', {params});
  }

  createRole(data: IRolesModel): Observable<IRolesModel> {
    return this.httpClient.post<IRolesModel>('roles', data);
  }

  getOneRole(id: string): Observable<IRolesModel> {
    return this.httpClient.get<IRolesModel>(`roles/${id}`);
  }

  editRole(id: string, data: IRolesModel): Observable<IRolesModel> {
    return this.httpClient.patch<IRolesModel>(`roles/${id}`, data);
  }

  deleteRole(id: string) {
    return this.httpClient.delete(`roles/${id}`);
  }
}
