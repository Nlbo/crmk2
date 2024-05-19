import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IBotsModel} from '@api/bots/res/bots.interface';

export class BotsManageModel {
  id = new FormControl('');
  title = new FormControl('', [Validators.required]);
  token = new FormControl('', [Validators.required]);
  setWebhook = new FormControl(false);

  formGroup = new FormGroup({
    id: this.id,
    title: this.title,
    token: this.token,
    setWebhook: this.setWebhook
  });

  getCreateValues(): IBotsModel {
    return {
      title: this.title.value,
      token: this.token.value,
      set_webhook: this.setWebhook.value
    };
  }

  getEditValues(): IBotsModel {
    return {
      id: this.id.value,
      title: this.title.value,
      token: this.token.value,
      set_webhook: this.setWebhook.value
    };
  }

  manageAllFields(flag = false) {
    if (flag) {
      this.title.enable();
      this.token.enable();
      this.setWebhook.enable();
    } else {
      this.title.disable();
      this.token.disable();
      this.setWebhook.disable();
    }
  }
}
