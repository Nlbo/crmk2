import {Component, OnInit} from '@angular/core';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {CategoriesService} from '@api/categories/categories.service';
import {ICategoriesModel, ICategoriesResponseModel} from '@api/categories/res/categories.interface';
import {PermissionsEnum} from '@enums/permissions.enum';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  categoriesResponse: ICategoriesResponseModel = null;
  categoriesList: ICategoriesModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  ManageTypesEnum = ManageTypesEnum;
  visibleTitleFilter: boolean = false;
  PermissionsEnum = PermissionsEnum;

  constructor(public categoriesService: CategoriesService) {
  }

  ngOnInit() {
    this.initializeValues();
  }

  initializeValues() {
    this.visibleTitleFilter = false;
    this.categoriesService.getCategoriesList(this.pageIndex).subscribe((data: ICategoriesResponseModel) => {
      this.categoriesResponse = data;
      this.categoriesList = this.categoriesResponse.data;
    });
  }

  deleteCategory(id: string) {
    this.categoriesService.deleteCategory(id).subscribe((data) => {
      this.initializeValues();
    })
  }

}
