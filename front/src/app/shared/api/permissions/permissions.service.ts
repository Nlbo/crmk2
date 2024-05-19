import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPermissionsModel, IPermissionsResponseModel} from '@api/permissions/res/permissions.interface';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private httpClient: HttpClient) {
  }

  getPermissionsList(page = 1, paginated = true): Observable<IPermissionsResponseModel | IPermissionsModel[]> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    return this.httpClient.get<IPermissionsResponseModel | IPermissionsModel[]>('permissions', {params});
  }
}
