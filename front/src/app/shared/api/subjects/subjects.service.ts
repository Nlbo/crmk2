import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ISubjectModel, ISubjectsResponseModel} from '@api/subjects/res/subjects.interface';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  titleFilter: string = '';

  constructor(private httpClient: HttpClient) {
  }

  getSubjectsList(page = 1, paginated = true): Observable<ISubjectsResponseModel | ISubjectModel[]> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    if (this.titleFilter) {
      params = params.set('filter[title]', this.titleFilter);
    }

    return this.httpClient.get<ISubjectsResponseModel | ISubjectModel[]>('subjects', {params});
  };

  getOneSubject(id: string): Observable<ISubjectModel> {
    return this.httpClient.get<ISubjectModel>(`subjects/${id}`);
  }

  createSubject(data: ISubjectModel): Observable<ISubjectModel> {
    return this.httpClient.post<ISubjectModel>('subjects', data);
  };

  editSubject(data: ISubjectModel, id: string): Observable<ISubjectModel> {
    return this.httpClient.patch<ISubjectModel>(`subjects/${id}`, data);
  };

  deleteSubject(id: string) {
    return this.httpClient.delete(`subjects/${id}`);
  }
}
