import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ISubjectModel} from '@api/subjects/res/subjects.interface';

export class SubjectsManageModel {
  id = new FormControl('');
  title = new FormControl('', [Validators.required]);

  formGroup = new FormGroup({
    id: this.id,
    title: this.title
  })

  getCreateValues(): ISubjectModel {
    return {
      title: this.title.value
    }
  }

  getEditValues(): ISubjectModel {
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
