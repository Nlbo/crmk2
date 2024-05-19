import {FormControl, FormGroup, Validators} from '@angular/forms';

export class ChainsContentManageModel {
  id = new FormControl('');
  chainId = new FormControl('');
  telegramBotId = new FormControl('');
  title = new FormControl('', [Validators.required]);
  body = new FormControl('');
  format = new FormControl('HTML');
  stickers = new FormControl(null);
  buttons = new FormControl(null);
  attachments = new FormControl(null);
  attachmentId = new FormControl(null);

  formGroup = new FormGroup({
    title: this.title,
    body: this.body,
    buttons: this.buttons,
  })

  getCreateValues() {
    return {
      title: this.title.value,
      body: this.body.value,
      buttons: [this.buttons.value].filter(item => item),
      format: this.format.value,
      stickers: [this.stickers.value].filter(item => item),
      attachments: [this.attachments.value].filter(item => item),
    }
  }


  getEditValues() {
    return {
      title: this.title.value,
      body: this.body.value,
      buttons: [this.buttons.value].filter(item => item),
      format: this.format.value,
      stickers: [this.stickers.value].filter(item => item),
      attachments: [this.attachments.value].filter(item => item),
    }
  }

  manageAllFields(flag = false) {
    if (flag) {
      this.title.enable();
      this.buttons.enable();
      this.body.enable();
    } else {
      this.title.disable();
      this.buttons.disable();
      this.body.disable();
    }
  }
}
