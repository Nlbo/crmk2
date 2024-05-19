import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ILanguagesModel} from '@api/languages/res/languages.interface';

export class LanguagesManageModel {
  id = new FormControl('');
  title = new FormControl('', [Validators.required]);
  code = new FormControl('', [Validators.required, Validators.maxLength(2), Validators.minLength(2)]);

  formGroup = new FormGroup({
    id: this.id,
    title: this.title,
    code: this.code
  });

  getCreateValues(): ILanguagesModel {
    return {
      title: this.title.value,
      code: this.code.value.toLowerCase()
    };
  }

  getEditValues(): ILanguagesModel {
    return {
      title: this.title.value,
      code: this.code.value.toLowerCase()
    };
  }

  manageAllFields(flag = false) {
    if (flag) {
      this.title.enable();
    } else {
      this.title.disable();
    }
  }
}
