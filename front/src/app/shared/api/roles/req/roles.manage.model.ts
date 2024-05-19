import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IRolesModel} from '@api/roles/res/roles.interface';

export class RolesManageModel {
  id = new FormControl('');
  name = new FormControl('', [Validators.required]);
  originalName = new FormControl('');
  permissions = new FormControl([]);

  formGroup = new FormGroup({
    id: this.id,
    name: this.name,
    permissions: this.permissions
  });

  getCreateValues(): IRolesModel {
    return {
      name: this.name.value,
      permissions: this.permissions.value,
    };
  }

  getEditValues(): IRolesModel {
    let obj: any = {
      permissions: this.permissions.value,
    };

    if (this.name.value !== this.originalName.value) {
      obj.name = this.name.value;
    }
    return obj;
  }


  manageAllFields(flag = false) {
    if (flag) {
      this.name.enable();
      this.permissions.enable();
    } else {
      this.name.disable();
      this.permissions.disable();
    }
  }
}
