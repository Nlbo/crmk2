import {FormControl, FormGroup, Validators} from '@angular/forms';

export class PostsManageModel {
  id = new FormControl('');
  title = new FormControl('', [Validators.required]);
  body = new FormControl('');
  languageId = new FormControl('', [Validators.required]);
  categoryId = new FormControl('', [Validators.required]);
  characterId = new FormControl('');
  countryId = new FormControl('');
  subjectId = new FormControl('');
  format = new FormControl('HTML');
  stickers = new FormControl(null);
  buttons = new FormControl(null);
  attachments = new FormControl(null);
  attachmentId = new FormControl(null);
  setWebhook = new FormControl('');

  formGroup = new FormGroup({
    title: this.title,
    body: this.body,
    buttons: this.buttons,
    languageId: this.languageId,
    characterId: this.characterId,
    categoryId: this.categoryId,
    countryId: this.countryId,
    subjectId: this.subjectId,
    setWebhook: this.setWebhook,
  })

  getCreateValues() {
    return {
      title: this.title.value,
      body: this.body.value,
      language_id: this.languageId.value,
      character_id: this.characterId.value,
      country_id: this.countryId.value,
      subject_id: this.subjectId.value,
      category_id: this.categoryId.value,
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
      language_id: this.languageId.value,
      character_id: this.characterId.value,
      country_id: this.countryId.value,
      subject_id: this.subjectId.value,
      category_id: this.categoryId.value,
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
      this.languageId.enable();
      this.categoryId.enable();
      this.characterId.enable();
      this.countryId.enable();
      this.subjectId.enable();
    } else {
      this.title.disable();
      this.buttons.disable();
      this.body.disable();
      this.languageId.disable();
      this.categoryId.disable();
      this.characterId.disable();
      this.countryId.disable();
      this.subjectId.disable();
    }
  }
}
