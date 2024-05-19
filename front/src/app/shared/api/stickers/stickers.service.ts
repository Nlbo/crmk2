import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IStickersModel, IStickersResponseModel} from '@api/stickers/res/stickers.interface';

@Injectable({
  providedIn: 'root'
})
export class StickersService {

  constructor(private httpClient: HttpClient) { }

  getStickersList(page = 1, paginated = true): Observable<IStickersResponseModel[]> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    return this.httpClient.get<IStickersResponseModel[]>('stickerSets', {params});
  }

  createSticker(data: IStickersModel): Observable<IStickersModel> {
    return this.httpClient.post<IStickersModel>('stickerSets', data);
  }

  editSticker(data: IStickersModel, id: string): Observable<IStickersModel> {
    return this.httpClient.patch<IStickersModel>(`stickerSets/${id}`, data);
  }
}
