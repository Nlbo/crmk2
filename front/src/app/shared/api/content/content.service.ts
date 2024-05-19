import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IContentModel, IContentResponseModel} from '@api/content/res/content.interface';
import {IChainsContentReorderedReqModel} from '@api/content/req/chains-content-reordered.req.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private httpClient: HttpClient) { }

  getContentsList(chainId: string, page = 1, paginated = true): Observable<IContentResponseModel> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    return this.httpClient.get<IContentResponseModel>(`chains/${chainId}/content`, {params});
  }

  getOneContent(chainId: string, id: string): Observable<IContentModel> {
    return this.httpClient.get<IContentModel>(`chains/${chainId}/content/${id}`);
  }

  createContent(data, chainId: string): Observable<IContentModel> {
    return this.httpClient.post<IContentModel>(`chains/${chainId}/content`, data);
  }

  reorderContent(data: IChainsContentReorderedReqModel, chainId: string): Observable<IContentModel[]> {
    return this.httpClient.post<IContentModel[]>(`chains/${chainId}/content/reorder`, data);
  }

  editContent(data, chainId: string, id: string): Observable<IContentModel> {
    return this.httpClient.patch<IContentModel>(`chains/${chainId}/content/${id}`, data);
  }

  deleteContent(chainId: string, id: string) {
    return this.httpClient.delete(`chains/${chainId}/content/${id}`);
  }
}
