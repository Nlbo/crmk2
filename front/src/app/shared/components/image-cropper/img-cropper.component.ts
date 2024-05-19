import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';

@Component({
  selector: 'app-img-cropper',
  templateUrl: './img-cropper.component.html',
  styleUrls: ['./img-cropper.component.scss']
})
export class ImgCropperComponent {

  @Output('fileChangeEvent') fileChangeEventEmitter: EventEmitter<ImageCroppedEvent> = new EventEmitter();
  @Output('imageCropped') imageCroppedEmitter: EventEmitter<ImageCroppedEvent> = new EventEmitter();
  @Output('imageLoaded') imageLoadedEmitter: EventEmitter<ImageCroppedEvent> = new EventEmitter();
  @Output('cropperReady') cropperReadyEmitter: EventEmitter<ImageCroppedEvent> = new EventEmitter();
  @Output('loadImageFailed') loadImageFailedEmitter: EventEmitter<ImageCroppedEvent> = new EventEmitter();
  @Output('getCroppedImage') getCroppedImageEmitter: EventEmitter<any> = new EventEmitter();
  @Output('close') close: EventEmitter<any> = new EventEmitter();
  imageChangedEvent: any = '';
  imagePosition: any = null;
  croppedImage: any = '';
  link = '';
  flag = true;
  originalFile = null;

  @Input('showLinkInput') showLinkInput = false;

  @Input('fileChangeEvent') set file(event) {
    requestAnimationFrame(() => {
      this.originalFile = event;
      this.imageChangedEvent = {
        target: {
          files: [event]
        }
      };
    });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imagePosition = event.imagePosition;
    this.imageCroppedEmitter.emit(event);
  }

  imageLoaded() {
    this.imageLoadedEmitter.emit();
  }

  cropperReady() {
    this.imageLoadedEmitter.emit();
  }

  loadImageFailed() {
    this.loadImageFailedEmitter.next();
  }

  handleOk(): void {
    this.getCroppedImageEmitter.emit({
      file: this.originalFile,
      imagePosition: this.imagePosition,
      link: this.link
    });
  }

  handleCancel(): void {
    this.close.emit();
  }

}
