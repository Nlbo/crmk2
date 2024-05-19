import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {IChatsMessages, IChatsMessagesResponseModel} from '@api/chats/res/chat-messages.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  isChangeChatSubject: Subject<boolean> = new Subject();

  constructor(private httpClient: HttpClient) {
  }

  getChatMessages(id: string, page = 1, paginated = true): Observable<IChatsMessagesResponseModel | IChatsMessages[]> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());
    return this.httpClient.get<IChatsMessagesResponseModel | IChatsMessages[]>(`chats/${id}/messages`, {params});
  }

  createChatMessages(id: string, data): Observable<IChatsMessages[]> {
    return this.httpClient.post<IChatsMessages[]>(`chats/${id}/messages`, data);
  }

  editChatMessages(id: string, messageId: string, data): Observable<IChatsMessages> {
    return this.httpClient.patch<IChatsMessages>(`chats/${id}/messages/${messageId}`, data);
  }
}
