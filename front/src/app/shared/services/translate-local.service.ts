import {Injectable} from '@angular/core';
import {LanguageEnum} from '@enums/language.enum';
import {Observable, Subject} from 'rxjs';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeRu from '@angular/common/locales/ru';
import {en_GB, NzI18nService, ru_RU} from 'ng-zorro-antd/i18n';
import {enGB, ru} from 'date-fns/locale';

@Injectable({providedIn: 'root'})
export class TranslateLocalService {
  language = localStorage.getItem('language') || LanguageEnum.English;
  languageChangeEvent = new Subject<{language: LanguageEnum}>();

  constructor(private translateService: TranslateService, private i18n: NzI18nService, private translatePipe: TranslatePipe) {
    this.languageChangeEvent.subscribe(({language}) => {
      switch (language) {
        case LanguageEnum.English:
          this.i18n.setDateLocale(enGB);
          this.i18n.setLocale(en_GB);
          break;
        case LanguageEnum.Russian:
          this.i18n.setDateLocale(ru);
          this.i18n.setLocale(ru_RU);
          break;
      }
      this.translateService.use(language);
      this.language = language;
      localStorage.setItem('language', language);
    });

    // Set date languages
    registerLocaleData(localeEn);
    registerLocaleData(localeRu);
  }

  translate(key: string): string {
    return this.translatePipe.transform(key);
  }
}
