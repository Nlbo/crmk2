import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ISchedulesModel} from '@api/schedule/res/schedule.interface';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private httpClient: HttpClient) { }

  getSchedules(channelId: string, date = new Date()): Observable<ISchedulesModel[]> {
    let params = new HttpParams();
    params = params.set('month', `${(date.getUTCMonth() + 1) > 9 ? (date.getUTCMonth() + 1) : '0' + (date.getUTCMonth() + 1)}-${date.getFullYear()}`)

    return this.httpClient.get<ISchedulesModel[]>(`channels/${channelId}/schedule`, {params});
  }

  createSchedule(data: ISchedulesModel, channelId: string): Observable<ISchedulesModel> {
    return this.httpClient.post<ISchedulesModel>(`channels/${channelId}/scheduleTimes`, data);
  }

  editSchedule(data: ISchedulesModel, channelId: string, id: string): Observable<ISchedulesModel> {
    return this.httpClient.patch<ISchedulesModel>(`channels/${channelId}/scheduleTimes/${id}`, data);
  }

  deleteSchedule(channelId: string, id: string): Observable<ISchedulesModel> {
    return this.httpClient.delete<ISchedulesModel>(`channels/${channelId}/scheduleTimes/${id}`);
  }
}
