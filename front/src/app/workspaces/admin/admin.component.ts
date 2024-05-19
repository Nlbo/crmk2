import {Component, OnInit} from '@angular/core';
import {Router, RouteReuseStrategy} from '@angular/router';
import {LanguageEnum} from '@enums/language.enum';
import {MenuItemTypeEnum} from '@enums/menu-item-type.enum';
import {AppHelper} from '@services/app-helper.service';
import {TranslateLocalService} from '@services/translate-local.service';
import {MenuHelperService} from './services/menu-helper.service';
import {AuthService} from '@api/auth/auth.service';
import {AuthHelperService} from '@pages/auth/services/auth-helper.service';
import {UsersService} from '@api/users/users.service';
import {ManageTypesEnum} from "@enums/manage-types.enum";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  AppHelper = AppHelper;
  isCollapsed = false;
  menuItemTypeEnum = MenuItemTypeEnum;
  LanguageEnum = LanguageEnum;
  isShowBreadcrumb = false;
  ManageTypesEnum = ManageTypesEnum;
  constructor(
    public helperService: MenuHelperService,
    public appHelper: AppHelper,
    public router: Router,
    public translateLocalService: TranslateLocalService,
    public authHelperService: AuthHelperService,
    private userService: UsersService,
  ) {
  }

  ngOnInit(): void {
    this.initializeValues();
  }


  logOut() {
    localStorage.clear();
    window.location.href = window.location.origin;
  }

  initializeValues() {
    setTimeout(() => {
      this.isShowBreadcrumb = true;
      this.translateLocalService.languageChangeEvent.next({language: this.authHelperService.user.language});
    });
  }

  onSelectLanguage(language: LanguageEnum) {
    const user = {
      language
    };
    this.userService.editUser(user, this.authHelperService.user.id).subscribe(() => {
      this.translateLocalService.languageChangeEvent.next({language});
    });
  }

  translateFn = (key: string) => {
    if (key) {
      return this.translateLocalService.translate(key);
    }
  };

  changeRoute(url: string): void {
    AppHelper.changeRouteEventLastValueBeforeChange = window.location.href;
    AppHelper.changeRouteEvent.next(url);
  }
}


