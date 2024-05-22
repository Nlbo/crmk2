import {DatePipe, registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import en from '@angular/common/locales/en';
import ru from '@angular/common/locales/ru';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LanguageEnum} from '@enums/language.enum';
import {TranslateLoader, TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AuthInterceptor} from '@shared/interceptors/auth.interceptor';
import {ErrorInterceptor} from '@shared/interceptors/error.interceptor';
import {UrlInterceptor} from '@shared/interceptors/url.interceptor';
import {enGB as EnglishGreatBritain, ru as Russian} from 'date-fns/locale';
import {en_GB, NZ_DATE_LOCALE, NZ_I18N, ru_RU} from 'ng-zorro-antd/i18n';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Overlay} from '@angular/cdk/overlay';
import {UserInfoPreloader} from '@shared/preloaders/user-info.preloader';
import {AdminModule} from "./workspaces/admin/admin.module";
import { SharedModule } from '@shared/shared.module';

export function UserInfoPreloaderFactory(provider: UserInfoPreloader) {
  return () => provider.load();
}

function getNzi18n() {
  switch (localStorage.getItem('language')) {
    case LanguageEnum.Russian:
      return ru_RU;
    default:
      return en_GB;
  }
}

function getNzDateLocale() {
  switch (localStorage.getItem('language')) {
    case LanguageEnum.Russian:
      return Russian;
    default:
      return EnglishGreatBritain;
  }
}

function getTranslationsDefaultLanguage() {
  switch (localStorage.getItem('language')) {
    case LanguageEnum.Russian:
      return ru;
    default:
      return en;
  }
}

registerLocaleData(getTranslationsDefaultLanguage());

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      defaultLanguage: LanguageEnum.English,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SharedModule
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: UserInfoPreloaderFactory, deps: [UserInfoPreloader], multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: UrlInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: NZ_I18N, useValue: getNzi18n()},
    {provide: NZ_DATE_LOCALE, useValue: getNzDateLocale()},
    DatePipe,
    TranslatePipe,
    NzMessageService,
    Overlay,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
