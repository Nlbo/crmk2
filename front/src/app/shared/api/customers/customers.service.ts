import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ICustomersModel, ICustomersResponseModel} from '@api/customers/res/customers.interface';
import {IChatsCustomersChatsResponseModel} from '@api/customers/res/customers-chats.interface';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  usernameFilter: string = '';
  firstNameFilter: string = '';
  lastNameFilter: string = '';

  constructor(private httpClient: HttpClient) {
  }

  getCustomersList(page = 1, paginated = true): Observable<ICustomersResponseModel> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    if (this.usernameFilter) {
      params = params.set('filter[username]', this.usernameFilter);
    }

    if (this.firstNameFilter) {
      params = params.set('filter[first_name]', this.firstNameFilter);
    }

    if (this.lastNameFilter) {
      params = params.set('filter[last_name]', this.lastNameFilter);
    }

    return this.httpClient.get<ICustomersResponseModel>('customers', {params});
  }

  getOneCustomer(id: string): Observable<ICustomersModel> {
    return this.httpClient.get<ICustomersModel>(`customers/${id}`);
  }

  getCustomerChatsList(id: string, page = 1): Observable<IChatsCustomersChatsResponseModel> {
    let params = new HttpParams();
    params = params.set('page', page.toString());

    return this.httpClient.get<IChatsCustomersChatsResponseModel>(`customers/${id}/chats`, {params});
  }

  deleteCustomer(id: string) {
    return this.httpClient.delete(`customers/${id}`);
  }
}
