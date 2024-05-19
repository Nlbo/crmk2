import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ICategoriesModel, ICategoriesResponseModel} from '@api/categories/res/categories.interface';
import {ICharactersModel} from '@api/characters/res/characters.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  titleFilter: string = '';

  constructor(private httpClient: HttpClient) {
  }

  getCategoriesList(page = 1, paginated = true): Observable<ICategoriesResponseModel | ICharactersModel[]> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    if (this.titleFilter) {
      params = params.set('filter[title]', this.titleFilter);
    }

    return this.httpClient.get<ICategoriesResponseModel | ICategoriesModel[]>('categories', {params});
  };

  getOneCategory(id: string): Observable<ICategoriesModel> {
    return this.httpClient.get<ICategoriesModel>(`categories/${id}`);
  }

  createCategory(data: ICategoriesModel): Observable<ICategoriesModel> {
    return this.httpClient.post<ICategoriesModel>('categories', data);
  };

  editCategory(data: ICategoriesModel, id: string): Observable<ICategoriesModel> {
    return this.httpClient.patch<ICategoriesModel>(`categories/${id}`, data);
  };

  deleteCategory(id: string) {
    return this.httpClient.delete(`categories/${id}`);
  }
}
