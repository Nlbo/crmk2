import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ChatsService} from '@api/chats/chats.service';
import {IChatsMessages, IChatsMessagesResponseModel} from '@api/chats/res/chat-messages.interface';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import {IStickersModel} from '@api/stickers/res/stickers.interface';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {FormControl} from '@angular/forms';
import {environment} from '../../../../../../../environments/environment';
import io from 'socket.io-client'

@Component({
  selector: 'app-messanger-box',
  templateUrl: './messanger-box.component.html',
  styleUrls: ['./messanger-box.component.scss']
})
export class MessangerBoxComponent implements OnInit, OnDestroy {
  customerId: string = null;
  @ViewChild('chatBox') chatBox = null;
  chatId: string = null;
  chatsList: IChatsMessages[] = [];
  candidateChat: IChatsMessages = null;
  candidateChatFormControl = new FormControl('');
  pageIndex: number = 1;
  isLoadingOldMessages: boolean = false;
  isSendingMessage: boolean = false;
  totalPagesCount: number = null;
  isUserScroll = false;

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private chatsService: ChatsService,
    private nzContextMenuService: NzContextMenuService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.customerId) {
        this.chatsList = [];
        this.customerId = params.customerId;
        this.isUserScroll = false;
        this.pageIndex = 1;
        this.getChatMessages();
        this.subscribeSocket();
      }
      this.activatedRoute.parent?.params.subscribe((params: Params) => {
        if (params.id) {
          this.chatId = params.id;
        }
      });
    });
    this.chatsService.isChangeChatSubject.subscribe((flag) => {
      if (flag) {
        this.candidateChatFormControl.disable();
      } else {
        this.candidateChatFormControl.enable();
      }
    })
  }

  getChatMessages() {
    this.isLoadingOldMessages = true;
    this.chatsService.getChatMessages(this.customerId, this.pageIndex).subscribe((chatsMessagesResponseModel: IChatsMessagesResponseModel) => {
      this.chatsList = chatsMessagesResponseModel.data.reverse();
      this.isLoadingOldMessages = false;
      this.totalPagesCount = chatsMessagesResponseModel.last_page;
      this.scrollToDownChats();
    }, error => {
      this.isLoadingOldMessages = false;
    });
  }

  scrollEvent(event) {
      if (this.isUserScroll && event.target.scrollTop === 0 && (this.pageIndex < this.totalPagesCount)) {
        this.pageIndex += 1;
        this.isLoadingOldMessages = true;
        const oldScrollHeight = event.target.scrollHeight;
        this.chatsService.getChatMessages(this.customerId, this.pageIndex).subscribe((chatsMessagesResponseModel: IChatsMessagesResponseModel) => {
          this.chatsList.unshift(...chatsMessagesResponseModel.data.reverse());
          event.target.scrollTop = event.target.scrollHeight - oldScrollHeight;
          this.isLoadingOldMessages = false;
        }, err => {
          this.isLoadingOldMessages = false;
        });
      }
  }

  scrollToDownChats() {
    requestAnimationFrame(() => {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    });
  }

  getLocalStorageItem(name: string) {
    return localStorage.getItem(name);
  }

  subscribeSocket() {
    window['io'] = io;
    window['Echo'] = new Echo({
      broadcaster: 'socket.io',
      host: environment.wsHost,
      authEndpoint: `${environment.apiUrl}broadcasting/auth`,
      auth: {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
    });

    window['Echo'].private(`App.Models.Update.${this.customerId}`).listen('.UpdateReceived',
      (newMessage: IChatsMessages) => {
        const idx = this.chatsList.findIndex(item => item.id === newMessage.id);
        if (idx >= 0) {
          this.chatsList[idx] = newMessage;
        } else {
          this.chatsList.push(newMessage);
        }
        this.scrollToDownChats();
      });
  }

  sendSms(event) {
    if (event) {
      const data = {
        text: event,
        format: 'HTML'
      };
      this.createChatMessage(data);
    }
  }

  sendSticker(sticker: IStickersModel) {
    let data = {
      sticker_id: sticker.id
    };
    this.createChatMessage(data);
  }

  sendAttachment(attachment) {
    let data = {
      attachments: [attachment]
    };
    this.createChatMessage(data);
  }

  createChatMessage(data) {
    this.isSendingMessage = true;
    this.scrollToDownChats();
    if (this.candidateChat) {
      this.chatsService.editChatMessages(this.chatId, this.candidateChat.id, data).subscribe((data) => {
        const idx = this.chatsList.findIndex(item => item.id === this.candidateChat.id);
        this.chatsList[idx] = data;
        this.candidateChat = null;
        this.candidateChatFormControl.setValue('');
        this.isSendingMessage = false;
      }, err => {
        this.isSendingMessage = false;
      });
    } else {
      this.chatsService.createChatMessages(this.customerId, data).subscribe((data) => {
        this.chatsList.push(...data);
        this.isSendingMessage = false;
        this.scrollToDownChats();
      }, err => {
        this.isSendingMessage = false;
      });
    }
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, candidateChat): void {
    this.candidateChat = candidateChat;
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  editChat() {
    this.candidateChatFormControl.setValue(this.candidateChat.text);
    this.closeMenu();
  }

  ngOnDestroy() {
    this.chatsService.isChangeChatSubject.unsubscribe();
  }

}
