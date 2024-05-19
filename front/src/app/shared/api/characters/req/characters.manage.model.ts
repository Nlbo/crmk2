import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ICharactersModel} from '@api/characters/res/characters.interface';

export class CharactersManageModel {
  id = new FormControl('');
  title = new FormControl('', [Validators.required]);

  formGroup = new FormGroup({
    id: this.id,
    title: this.title
  })

  getCreateValues(): ICharactersModel {
    return {
      title: this.title.value
    }
  }

  getEditValues(): ICharactersModel {
    return {
      title: this.title.value
    }
  }

  manageAllFields(flag = false) {
    if (flag) {
      this.title.enable();
    } else {
      this.title.disable();
    }
  }
}
