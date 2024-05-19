import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ILanguagesModel, ILanguagesResponseModel} from '@api/languages/res/languages.interface';
import {ILanguagesIsoModel} from '@models/languages-iso.interface';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  titleFilter: string = '';
  codeFilter: string = '';

  constructor(private httpClient: HttpClient) {
  }

  getLanguagesList(page = 1, paginated = true): Observable<ILanguagesResponseModel | ILanguagesModel[]> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    if (this.titleFilter) {
      params = params.set('filter[title]', this.titleFilter);
    }

    if (this.codeFilter) {
      params = params.set('filter[code]', this.codeFilter);
    }

    return this.httpClient.get<ILanguagesResponseModel | ILanguagesModel[]>('languages', {params});
  };

  getOneLanguage(id: string): Observable<ILanguagesModel> {
    return this.httpClient.get<ILanguagesModel>(`languages/${id}`);
  }

  createLanguage(data: ILanguagesModel): Observable<ILanguagesModel> {
    return this.httpClient.post<ILanguagesModel>('languages', data);
  };

  editLanguage(data: ILanguagesModel, id: string): Observable<ILanguagesModel> {
    return this.httpClient.patch<ILanguagesModel>(`languages/${id}`, data);
  };

  getLanguagesIsoList(): Observable<ILanguagesIsoModel[]> {
    return this.httpClient.get<ILanguagesIsoModel[]>(`${window.location.origin}/assets/json/languages-iso.json`);
  }

  deleteLanguage(id: string) {
    return this.httpClient.delete(`languages/${id}`);
  }
}
