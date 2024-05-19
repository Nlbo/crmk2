import {Component, OnInit} from '@angular/core';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {ILanguagesModel, ILanguagesResponseModel} from '@api/languages/res/languages.interface';
import {LanguagesService} from '@api/languages/languages.service';
import {PermissionsEnum} from '@enums/permissions.enum';

@Component({
  selector: 'app-languages-list',
  templateUrl: './languages-list.component.html',
  styleUrls: ['./languages-list.component.scss']
})
export class LanguagesListComponent implements OnInit {
  visibleTitleFilter: boolean = false;
  visibleCodeFilter: boolean = false;
  languagesResponse: ILanguagesResponseModel = null;
  languagesList: ILanguagesModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  ManageTypesEnum = ManageTypesEnum;
  PermissionsEnum = PermissionsEnum;

  constructor(public languagesService: LanguagesService) {
  }

  ngOnInit() {
    this.initializeValues();
  }

  initializeValues() {
    this.closeAllFilters();
    this.languagesService.getLanguagesList(this.pageIndex).subscribe((data: ILanguagesResponseModel) => {
      this.languagesResponse = data;
      this.languagesList = this.languagesResponse.data;
    });
  }

  deleteLanguage(id: string) {
    this.languagesService.deleteLanguage(id).subscribe((data) => {
      this.initializeValues();
    });
  }

  closeAllFilters() {
    this.visibleTitleFilter = false;
    this.visibleCodeFilter = false;
  }

}
