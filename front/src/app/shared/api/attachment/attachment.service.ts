import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(private httpClient: HttpClient) { }

  uploadAttachment(formData: object): Observable<any> {
    return this.httpClient.post('upload', formData);
  }
}
