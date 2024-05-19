import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IChannelsModel} from '@api/channels/res/channels.interface';

export class ChannelsManageModel {
  id = new FormControl('');
  characters = new FormControl([]);
  categories = new FormControl([]);
  countries = new FormControl([]);
  subjects = new FormControl([]);
  externalLink = new FormControl('');
  directLink = new FormControl('');
  languageId = new FormControl('', [Validators.required]);
  managers = new FormControl('', [Validators.required]);
  posters = new FormControl('', [Validators.required]);
  telegramId = new FormControl('', [Validators.required, Validators.pattern('^(@).*')]);
  title = new FormControl('', [Validators.required]);


  formGroup = new FormGroup({
    id: this.id,
    characters: this.characters,
    categories: this.categories,
    countries: this.countries,
    subjects: this.subjects,
    externalLink: this.externalLink,
    directLink: this.directLink,
    languageId: this.languageId,
    managers: this.managers,
    posters: this.posters,
    telegramId: this.telegramId,
    title: this.title
  });

  getCreateValues(): IChannelsModel {
    return {
      title: this.title.value,
      posters: [this.posters.value],
      characters: this.characters.value,
      countries: this.countries.value,
      subjects: this.subjects.value,
      non_schedule_categories: this.categories.value,
      language_id: this.languageId.value,
      external_link: this.externalLink.value,
      direct_link: this.directLink.value,
      managers: [this.managers.value],
      telegram_id: this.telegramId.value,
    };
  }

  getEditValues(): IChannelsModel {
    return {
      title: this.title.value,
      posters: [this.posters.value],
      characters: this.characters.value,
      countries: this.countries.value,
      subjects: this.subjects.value,
      non_schedule_categories: this.categories.value,
      language_id: this.languageId.value,
      external_link: this.externalLink.value,
      direct_link: this.directLink.value,
      managers: [this.managers.value],
      telegram_id: this.telegramId.value,
    };
  }

  manageAllFields(flag = false) {
    if (flag) {
      this.title.enable();
      this.posters.enable();
      this.characters.enable();
      this.subjects.enable();
      this.countries.enable();
      this.categories.enable();
      this.languageId.enable();
      this.externalLink.enable();
      this.directLink.enable();
      this.managers.enable();
      this.telegramId.enable();
    } else {
      this.title.disable();
      this.posters.disable();
      this.characters.disable();
      this.subjects.disable();
      this.countries.disable();
      this.categories.disable();
      this.languageId.disable();
      this.externalLink.disable();
      this.directLink.disable();
      this.managers.disable();
      this.telegramId.disable();
    }
  }
}
