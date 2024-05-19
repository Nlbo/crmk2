import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import uploadCare from 'uploadcare-widget/uploadcare';
import {NgAudioRecorderService, OutputFormat} from 'ng-audio-recorder';
import {Subject} from 'rxjs';
import {renderGrid} from '@giphy/js-components';
import {GiphyFetch} from '@giphy/js-fetch-api';
import {IStickersModel, IStickersResponseModel} from '@api/stickers/res/stickers.interface';
import {StickersService} from '@api/stickers/stickers.service';
import RecordRTC from 'recordrtc';
import {environment} from '../../../../environments/environment';
import {throttle} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AttachmentService} from '@api/attachment/attachment.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ]

})
export class TextEditorComponent implements OnInit, OnDestroy, ControlValueAccessor, OnChanges {

  @Input('isEnterSend') isEnterSend = false;
  @Input('maxTextCount') maxTextCount = 4096;
  @Input('isPreviewHTML') isPreviewHTML = false;
  @Input('isClearUploadCareState') isClearUploadCareState = false;
  @Input('isClearStickersState') isClearStickersState = false;
  @Input('isVisibleButtonsContainer') isVisibleButtonsContainer = false;
  @Input('border') border = '1px solid #ddd';
  @Input('isBoldBtn') isBoldBtn = true;
  @Input('isItalicBtn') isItalicBtn = true;
  @Input('isUnderlineBtn') isUnderlineBtn = true;
  @Input('isStrikeThroughBtn') isStrikeThroughBtn = true;
  @Input('isLinkBtn') isLinkBtn = true;
  @Input('isBotLinkWithIdBtn') isBotLinkWithIdBtn = true;
  @Input('isBotLinkBtn') isBotLinkBtn = true;
  @Input('isDirectLink') isDirectLink = true;
  @Input('isExternalLinkBtn') isExternalLinkBtn = true;
  @Input('isAddButtonBtn') isAddButtonBtn = true;
  @Input('isStickersBtn') isStickersBtn = true;
  @Input('isAttachmentsBtn') isAttachmentsBtn = true;
  @Input('isAttachmentsVideo') isAttachmentsVideo = false;
  @Input('isSendVideoNote') isSendVideoNote = true;
  @Input('instrumentsContainerHeight') instrumentsContainerHeight = 45;
  @Input('selectedAttachmentId') selectedAttachmentId;
  @Input('selectedAttachments') selectedAttachments;
  @Input('selectedStickerId') selectedStickerId: string = null;
  @Output('selectSticker') selectSticker: EventEmitter<IStickersModel> = new EventEmitter();
  @Output('sendAttachment') sendAttachment: EventEmitter<any> = new EventEmitter();
  @Output('changeAttachmentVideoMode') changeAttachmentVideoMode: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('changeText') changeText: EventEmitter<string> = new EventEmitter();
  @Output('enterSend') enterSend: EventEmitter<any> = new EventEmitter();
  @Output('addButtonTriggerEvent') addButtonTriggerEvent: EventEmitter<any> = new EventEmitter();
  @Output('startUploadingFile') startUploadingFile: EventEmitter<any> = new EventEmitter();
  isVisibleStickersModalFlag = false;
  isVisibleLinkModal = false;
  isUploadFileModalVisible = false;
  isUploadFileDone = false;
  uploadFileUuid = '';
  uploadFileType = '';
  isVisibleBotLinkWithIdModal = false;
  linkFormControl = new FormControl('', [Validators.required]);
  botLinkWithIdFormControl = new FormControl('', [Validators.required]);
  isAudioRecording = false;
  isVideoNote = false;
  previewHTML = '';
  searchGifFormControl = new FormControl('facepalm');
  sendAudioStreamSubscribe = null;
  sendGifStreamSubscribe = null;
  isDisabled = false;
  stickersList: IStickersModel[] = [];
  gf = new GiphyFetch('kYlBVHQuVocFl39fBKJq8ke6CprkiONf');
  recorder;
  uploadFileId;
  attachVisibleFlag = false;
  attachCleaningAcceptFlag = false;
  fileCustomLink = '';
  attachSendLoading = false;


  @ViewChild('body') body;
  onChange: any = null;

  constructor(private audioRecorderService: NgAudioRecorderService, private stickersService: StickersService, private attachmentService: AttachmentService) {
    this.audioRecorderService.recorderError.subscribe(recorderErrorCase => {
      this.isAudioRecording = false;
    });
  }

  writeValue(value) {
    if (this.body && this.body.nativeElement && value) {
      this.body.nativeElement.innerHTML = value.replaceAll('\n', '<br>').replaceAll(' ', '&nbsp;');
      this.previewHTML = value;
      requestAnimationFrame(() => {
        this.createLinksClickEvent(this.body.nativeElement.getElementsByTagName('a'));
      });
    }
  }

  registerOnTouched(fn: any) {
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  registerOnChange(fn: any) {
    if (fn) {
      this.onChange = fn;
    }
  }

  ngOnInit(): void {
    // this.initializeValues();
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}): void {
    if (this.selectedAttachments && !this.uploadFileUuid) {
      this.attachVisibleFlag = true;
      this.isUploadFileDone = true;
      this.uploadFileUuid = this.selectedAttachments?.file_id;
      this.uploadFileType = this.selectedAttachments?.type;
    }
  }

  changeAttachment(flag) {
    if (flag) {
      this.attachVisibleFlag = false;
      this.isUploadFileDone = false;
      this.uploadFileUuid = null;
      this.uploadFileType = null;
      this.selectedAttachments = null;
      this.sendAttachment.emit(null);
    } else {
      this.attachCleaningAcceptFlag = false;
    }
  }

  cleanAttachment() {
    this.attachCleaningAcceptFlag = true;
  }

  bold() {
    document.execCommand('bold');
  }

  italic() {
    document.execCommand('italic');
  }

  underline() {
    document.execCommand('underline');
  }

  strikeThrough() {
    document.execCommand('strikeThrough');
  }

  createLinksClickEvent(links) {
    for (const item of links) {
      if (!item.href.includes('tg://user?id={bot_id}') && !item.href.includes('{external}')) {
        if (item.href.includes('tg://user?id=')) {
          item.addEventListener('click', (event) => {
            const url = prompt('Enter the bot id', item.href.split('tg://user?id=')[1]);
            if (url) {
              item.href = `tg://user?id=${url}`;
              item.title = item.href;
              this.setPreviewHTML();
            }
          });
        } else {
          item.addEventListener('click', (event) => {
            const url = prompt('Enter the link', item.href);
            if (url) {
              item.href = url;
              item.title = item.href;
              this.setPreviewHTML();
            }
          });
        }
      }
    }
  }

  link() {
    if ((document.getSelection().anchorNode.parentNode as HTMLAnchorElement).tagName === 'A') {
      const url = (document.getSelection().anchorNode.parentNode as HTMLAnchorElement).href;
      if (url.includes('{bot_link}') || url.includes('{external_link}') || url.includes('tg://')) {
        document.execCommand('unlink', false);
        this.link();
      } else {
        document.execCommand('unlink', false);
      }
      document.getSelection().anchorNode.parentNode.removeEventListener('click', () => {
      });
    } else {
      const link = prompt('Enter the link');
      if (link) {
        document.execCommand('createLink', false, link);
        (getSelection().anchorNode.parentNode as HTMLAnchorElement).title = link;
        this.createLinksClickEvent([getSelection().anchorNode.parentNode]);
        this.isVisibleLinkModal = false;
        this.linkFormControl.setValue('');
      }
    }
  }

  botLinkWithId(flag = false) {
    if ((document.getSelection().anchorNode.parentNode as HTMLAnchorElement).tagName === 'A') {
      const url = (document.getSelection().anchorNode.parentNode as HTMLAnchorElement).href;
      if (!url.includes('tg://')) {
        document.execCommand('unlink', false);
        this.botLinkWithId();
      } else {
        document.execCommand('unlink', false);
      }
      document.getSelection().anchorNode.parentNode.removeEventListener('click', () => {
      });
    } else {
      const link = prompt('Enter the bot id');
      if (link) {
        document.execCommand('createLink', false, `tg://user?id=${link}`);
        (getSelection().anchorNode.parentNode as HTMLAnchorElement).title = link;
        this.createLinksClickEvent([getSelection().anchorNode.parentNode]);
        this.isVisibleBotLinkWithIdModal = false;
        this.botLinkWithIdFormControl.setValue('');
      }
    }
  }

  botLink(flag = false) {
    if ((document.getSelection().anchorNode.parentNode as HTMLAnchorElement).tagName === 'A') {
      const url = (document.getSelection().anchorNode.parentNode as HTMLAnchorElement).href;
      if (!url.includes('{bot_link}')) {
        document.execCommand('unlink', false);
        this.botLink();
      } else {
        document.execCommand('unlink', false);
      }
    } else {
      const link = 'tg://user?id={bot_id}';
      document.execCommand('createLink', false, link);
      (getSelection().anchorNode.parentNode as HTMLAnchorElement).title = link;
    }
  }

  directLink(flag = false) {
    if ((document.getSelection().anchorNode.parentNode as HTMLAnchorElement).tagName === 'A') {
      const url = (document.getSelection().anchorNode.parentNode as HTMLAnchorElement).href;
      if (!url.includes('{direct_link}')) {
        document.execCommand('unlink', false);
        this.botLink();
      } else {
        document.execCommand('unlink', false);
      }
    } else {
      const link = '{direct_link}';
      document.execCommand('createLink', false, link);
      (getSelection().anchorNode.parentNode as HTMLAnchorElement).title = link;
    }
  }

  externalLink() {
    if ((document.getSelection().anchorNode.parentNode as HTMLAnchorElement).tagName === 'A') {
      const url = (document.getSelection().anchorNode.parentNode as HTMLAnchorElement).href;
      if (!url.includes('{external_link}')) {
        document.execCommand('unlink', false);
        this.botLink();
      } else {
        document.execCommand('unlink', false);
      }
    } else {
      const link = '{external_link}';
      document.execCommand('createLink', false, link);
      (getSelection().anchorNode.parentNode as HTMLAnchorElement).title = link;
    }
  }

  removeFormat() {
    document.execCommand('removeFormat', false);
  }

  addButton() {
    this.addButtonTriggerEvent.emit();
  }

  stickersModal(flag = false) {
    if (flag && this.selectedStickerId) {
      this.selectSticker.emit(this.stickersList.find(item => item.id === this.selectedStickerId));
    }
    if (this.isClearStickersState) {
      this.selectedStickerId = null;
    }
    this.isVisibleStickersModalFlag = false;
  }

  uploadFileModal(flag = false, sendFile?: boolean) {
    if (sendFile && this.fileCustomLink) {
      this.addFileFromLink(this.fileCustomLink);
    }
    this.isUploadFileModalVisible = flag;
  }

  uploadFileChange = ({file}, isLink?) => {
    setTimeout(() => {
      if ((file.status === 'done' && this.uploadFileId) || (isLink && this.uploadFileId)) {
        this.isUploadFileDone = true;
        this.uploadFileUuid = this.uploadFileId;
        this.sendAttachment.emit({
          file_id: this.uploadFileUuid,
          type: this.uploadFileType
        });
      } else {
        this.isUploadFileDone = false;
        this.uploadFileUuid = '';
      }
    }, 0);
  }

  customUploadRequest = (data) => {
    this.attachSendLoading = true;
    const formData = new FormData();
    formData.append(data.name, data.file as any);
    formData.append('type', this.uploadFileType);
    this.attachmentService.uploadAttachment(formData).subscribe(
      (res: any) => {
        data.onSuccess(data.file);
        this.uploadFileId = res?.data?.id;
        this.attachSendLoading = false;
      },
      (err) => {
        data.onError(err, data.file);
      }
    );
  }

  async addFileFromLink(url) {
    const corsUrl = `https://cors.eu.org/${url}`;
    this.attachSendLoading = true;
    fetch(corsUrl)
      .then(res => res.blob())
      .then(blob => {
        const fileName = corsUrl.split('/')[corsUrl.split('/').length - 1];
        const file = new File([blob], fileName);
        const formData = new FormData();
        formData.append('file', file as any);
        formData.append('type', this.uploadFileType);
        this.attachmentService.uploadAttachment(formData).subscribe(
          (res: any) => {
            this.uploadFileId = res?.data?.id;
            this.uploadFileChange({file}, true);
            this.attachSendLoading = false;
          },
          (err) => {
          }
        );
      });
  }

  pastFunction(event: ClipboardEvent) {
    event.preventDefault();
    const div = document.createElement('div');
    let text = event.clipboardData.getData('text/plain');
    div.innerHTML = event.clipboardData.getData('text/html');
    text = this.changeTextEndReturn(div.getElementsByTagName('b'), 'b', text);
    text = this.changeTextEndReturn(div.getElementsByTagName('u'), 'u', text);
    text = this.changeTextEndReturn(div.getElementsByTagName('s'), 'strike', text);
    text = this.changeTextEndReturn(div.getElementsByTagName('i'), 'i', text);
    text = this.changeTextEndReturnByStyle(div.querySelectorAll('*[style]'), 'italic', 'i', text);
    text = this.changeTextEndReturn(div.getElementsByTagName('ins'), 'u', text);
    text = this.changeTextEndReturn(div.getElementsByTagName('strike'), 'strike', text);
    text = this.changeTextEndReturn(div.getElementsByTagName('del'), 'strike', text);
    text = this.changeTextEndReturn(div.getElementsByTagName('strong'), 'strong', text);
    // @ts-ignore
    text = text.replaceAll('\r', '').replaceAll('\n', '<br>').replaceAll(' ', '&nbsp;');
    document.execCommand('insertHtml', false, text);
  }

  changeTextEndReturn(tags: any, changeToTagName, text) {
    if (tags && tags?.length) {
      for (const tag of tags) {
        if (tag.outerText.trim()?.length) {
          if (text.includes(tag.outerText)) {
            text = text.replace(tag.outerText, `<${changeToTagName}>${tag.outerText}</${changeToTagName}>`);
          } else {
            text = text.replace(tag.outerText.trim().replaceAll('\r', ' ').replaceAll('\n', ' '), `<${changeToTagName}>${tag.outerText}</${changeToTagName}>`);
          }
        }
      }
      return text;
    } else {
      return text;
    }
  }

  changeTextEndReturnByStyle(tags: any, attribute, changeToTagName, text) {
    if (tags && tags?.length) {
      for (const tag of tags) {
        if (tag.style.fontStyle === attribute) {
          text = text.replace(tag.outerText.trim(), `<${changeToTagName}>${tag.outerText}</${changeToTagName}>`);
        }
      }
      return text;
    } else {
      return text;
    }
  }

  inputText(event) {
    this.setPreviewHTML();
    if (this.onChange) {
      this.onChange(event.target.innerHTML.replaceAll('<br>', '\n').replaceAll('&nbsp;', ' '));
    }
    this.changeText.emit(event.target.innerHTML.replaceAll('<br>', '\n').replaceAll('&nbsp;', ' '));
  }

  sendText(event) {
    if (this.isEnterSend) {
      const div = document.createElement('div');
      div.innerHTML = this.previewHTML;
      if (div.innerText.length < this.maxTextCount) {
        this.enterSend.emit(event.target.innerHTML.replaceAll('<br>', '\n').replaceAll('&nbsp;', ' '));
        event.target.innerHTML = '';
        this.previewHTML = '';
      }
    } else {
      event.target.innerHTML += '<br>';
      event.target.focus();
      if (typeof window.getSelection !== 'undefined'
        && typeof document.createRange !== 'undefined') {
        const range = document.createRange();
        range.selectNodeContents(event.target);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        // @ts-ignore
      } else if (typeof document.body.createTextRange !== 'undefined') {
        // @ts-ignore
        const textRange = document.body.createTextRange();
        textRange.moveToElementText(event.target);
        textRange.collapse(false);
        textRange.select();
      }
    }
  }

  setPreviewHTML() {
    this.previewHTML = this.body.nativeElement.innerHTML.replaceAll('<br>', '\n').replaceAll('&nbsp;', ' ');
  }

  initializeValues() {
    this.stickersService.getStickersList().subscribe((stickersResponse: IStickersResponseModel[]) => {
      let arr = [];
      stickersResponse.forEach(item => arr = [...arr, ...item.stickers]);
      this.stickersList = arr;
    });
  }

  ngOnDestroy() {
    this.sendAudioStreamSubscribe?.unsubscribe();
    this.sendGifStreamSubscribe?.unsubscribe();
  }
}

