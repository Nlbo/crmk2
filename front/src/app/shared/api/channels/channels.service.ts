import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IChannelsModel, IChannelsResponseModel} from '@api/channels/res/channels.interface';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  titleFilter: string = '';
  languageFilter: string = '';
  countryFilter: string = '';
  subjectFilter: string = '';
  characterFilter: string = '';

  constructor(private httpClient: HttpClient) {
  }

  getChannelsList(page = 1, paginated = true): Observable<IChannelsResponseModel> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    if (this.titleFilter) {
      params = params.set('filter[title]', this.titleFilter);
    }

    if (this.countryFilter) {
      params = params.set(`filter[country.title]`, this.countryFilter);
    }

    if (this.languageFilter) {
      params = params.set(`filter[language.title]`, this.languageFilter);
    }

    if (this.subjectFilter) {
      params = params.set(`filter[subject.title]`, this.subjectFilter);
    }

    if (this.characterFilter) {
      params = params.set(`filter[character.title]`, this.characterFilter);
    }

    return this.httpClient.get<IChannelsResponseModel>('channels', {params});
  };

  getOneChannel(id: string): Observable<IChannelsModel> {
    return this.httpClient.get<IChannelsModel>(`channels/${id}`);
  }

  createChannel(data: IChannelsModel): Observable<IChannelsModel> {
    return this.httpClient.post<IChannelsModel>('channels', data);
  };

  editChannel(data: IChannelsModel, id: string): Observable<IChannelsModel> {
    return this.httpClient.patch<IChannelsModel>(`channels/${id}`, data);
  };

  deleteChannel(id: string) {
    return this.httpClient.delete(`channels/${id}`);
  }
}
