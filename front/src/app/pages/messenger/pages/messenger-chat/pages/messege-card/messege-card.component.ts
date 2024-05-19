import {Component, Input} from '@angular/core';
import {MessageTypeEnum} from '../../enums/message-type.enum';
import {MessageAttachmentTypeEnum} from '../../enums/message-attachment-type.enum';
import {IChatsMessages} from '@api/chats/res/chat-messages.interface';

@Component({
  selector: 'app-messege-card',
  templateUrl: './messege-card.component.html',
  styleUrls: ['./messege-card.component.scss']
})
export class MessegeCardComponent {

  @Input() chat: IChatsMessages = null;
  @Input() botId: string = null;
  MessageTypeEnum = MessageTypeEnum;
  MessageAttachmentTypeEnum = MessageAttachmentTypeEnum;
}
