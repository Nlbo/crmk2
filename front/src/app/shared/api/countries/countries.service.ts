import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ICountryModel, ICountryResponseModel} from '@api/countries/res/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  titleFilter: string = '';
  codeFilter: string = '';

  constructor(private httpClient: HttpClient) {
  }

  getCountriesList(page = 1, paginated = true): Observable<ICountryResponseModel | ICountryModel[]> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());


    if (this.titleFilter) {
      params = params.set('filter[title]', this.titleFilter);
    }

    if (this.codeFilter) {
      params = params.set('filter[code]', this.codeFilter);
    }

    return this.httpClient.get<ICountryResponseModel | ICountryModel[]>('countries', {params});
  }
}
