import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IChainsContentModel, IChainsContentResponseModel} from '@api/chains-content/res/chains-content.interface';
import {map} from 'rxjs/operators';
import {DatePipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ChainsContentService {

  titleFilter: string = '';

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) {
  }

  getChainsContentList(telegramBotId: string, page = 1, paginated = true): Observable<IChainsContentResponseModel> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    if (this.titleFilter) {
      params = params.set('filter[title]', this.titleFilter);
    }

    return this.httpClient.get<IChainsContentResponseModel>(`telegram/bots/${telegramBotId}/chains`, {params});
  }

  getOneChainContent(telegramBotId: string, id: string) {
    return this.httpClient.get<IChainsContentModel>(`telegram/bots/${telegramBotId}/chains/${id}`)
  }

  createChainsContent(data: IChainsContentModel, telegramBotId: string): Observable<IChainsContentModel> {
    data.time_to = this.datePipe.transform(data.time_to, 'HH:mm:ss');
    data.time_from = this.datePipe.transform(data.time_from, 'HH:mm:ss');
    return this.httpClient.post<IChainsContentModel>(`telegram/bots/${telegramBotId}/chains`, data);
  };

  editChainsContent(data: IChainsContentModel, telegramBotId: string, id: string): Observable<IChainsContentModel> {
    data.time_to = this.datePipe.transform(data.time_to, 'HH:mm:ss');
    data.time_from = this.datePipe.transform(data.time_from, 'HH:mm:ss');
    return this.httpClient.patch<IChainsContentModel>(`telegram/bots/${telegramBotId}/chains/${id}`, data);
  };

  deleteChainsContent(telegramBotId: string, id: string) {
    return this.httpClient.delete(`telegram/bots/${telegramBotId}/chains/${id}`);
  }
}
