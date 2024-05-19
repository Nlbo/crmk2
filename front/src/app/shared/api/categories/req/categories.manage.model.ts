import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ICategoriesModel} from '@api/categories/res/categories.interface';

export class CategoriesManageModel {
  id = new FormControl('');
  title = new FormControl('', [Validators.required]);

  formGroup = new FormGroup({
    id: this.id,
    title: this.title
  })

  getCreateValues(): ICategoriesModel {
    return {
      title: this.title.value
    }
  }

  getEditValues(): ICategoriesModel {
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
