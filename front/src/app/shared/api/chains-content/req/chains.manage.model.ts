import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IChainsContentModel} from '@api/chains-content/res/chains-content.interface';

export class ChainsManageModel {
  id = new FormControl('');
  title = new FormControl('', [Validators.required]);
  interval = new FormControl('');
  intervalType = new FormControl('days');
  telegramBotId = new FormControl('');
  timeFrom = new FormControl( null);
  timeTo = new FormControl( null);
  isActive = new FormControl( false);

  formGroup = new FormGroup({
    id: this.id,
    interval: this.interval,
    intervalType: this.intervalType,
    title: this.title,
    telegramBotId: this.telegramBotId,
    timeFrom: this.timeFrom,
    timeTo: this.timeTo,
    isActive: this.isActive
  });

  getCreateValues(): IChainsContentModel {
    return {
      title: this.title.value,
      telegram_bot_id: this.telegramBotId.value,
      time_from: this.timeFrom.value,
      time_to: this.timeTo.value,
      is_active: this.isActive.value,
      send_interval: `${this.interval.value} ${this.intervalType.value}`
    };
  }

  getEditValues(): IChainsContentModel {
    return {
      id: this.id.value,
      title: this.title.value,
      telegram_bot_id: this.telegramBotId.value,
      time_from: this.timeFrom.value,
      time_to: this.timeTo.value,
      is_active: this.isActive.value,
      send_interval: `${this.interval.value}${this.intervalType.value}`
    };
  }

  manageAllFields(flag = false) {
    if (flag) {
      this.title.enable();
      this.telegramBotId.enable();
      this.timeFrom.enable();
      this.timeTo.enable();
      this.isActive.enable();
    } else {
      this.title.disable();
      this.telegramBotId.disable();
      this.timeFrom.disable();
      this.timeTo.disable();
      this.isActive.disable();
    }
  }
}
