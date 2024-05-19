import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IBotsModel, IBotsResponseModel} from '@api/bots/res/bots.interface';

@Injectable({
  providedIn: 'root'
})
export class BotsService {

  titleFilter: string = '';

  constructor(private httpClient: HttpClient) {
  }

  getBotsList(page = 1, paginated = true): Observable<IBotsResponseModel | IBotsModel[]> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    if (this.titleFilter) {
      params = params.set('filter[title]', this.titleFilter);
    }

    return this.httpClient.get<IBotsResponseModel | IBotsModel[]>('telegram/bots', {params});
  };

  getOneBot(id: string): Observable<IBotsModel> {
    return this.httpClient.get<IBotsModel>(`telegram/bots/${id}`);
  }

  createBot(data: IBotsModel): Observable<IBotsModel> {
    return this.httpClient.post<IBotsModel>('telegram/bots', data);
  };

  editBot(data: IBotsModel, id: string): Observable<IBotsModel> {
    return this.httpClient.patch<IBotsModel>(`telegram/bots/${id}`, data);
  };

  deleteBot(id: string) {
    return this.httpClient.delete(`telegram/bots/${id}`);
  }
}
