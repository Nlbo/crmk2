import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ICharactersModel, ICharactersResponseModel} from '@api/characters/res/characters.interface';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  titleFilter: string = '';

  constructor(private httpClient: HttpClient) {
  }

  getCharactersList(page = 1, paginated = true): Observable<ICharactersResponseModel | ICharactersModel[]> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    if (this.titleFilter) {
      params = params.set('filter[title]', this.titleFilter);
    }

    return this.httpClient.get<ICharactersResponseModel | ICharactersModel[]>('characters', {params});
  };

  getOneCharacter(id: string): Observable<ICharactersModel> {
    return this.httpClient.get<ICharactersModel>(`characters/${id}`);
  }

  createCharacter(data: ICharactersModel): Observable<ICharactersModel> {
    return this.httpClient.post<ICharactersModel>('characters', data);
  };

  editCharacter(data: ICharactersModel, id: string): Observable<ICharactersModel> {
    return this.httpClient.patch<ICharactersModel>(`characters/${id}`, data);
  };

  deleteCharacter(id: string) {
    return this.httpClient.delete(`characters/${id}`);
  }
}
