import {Component, OnInit} from '@angular/core';
import {of} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {IBotsModel} from '@api/bots/res/bots.interface';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {CategoriesManageModel} from '@api/categories/req/categories.manage.model';
import {CategoriesService} from '@api/categories/categories.service';
import {ICategoriesModel} from '@api/categories/res/categories.interface';

@Component({
  selector: 'app-categories-manage',
  templateUrl: './categories-manage.component.html',
  styleUrls: ['./categories-manage.component.scss']
})
export class CategoriesManageComponent implements OnInit {
  manageCategoryModel = new CategoriesManageModel();
  ManageType: ManageTypesEnum = ManageTypesEnum.Add;
  ManageTypesEnum = ManageTypesEnum;
  isGettingOneCategory$ = of(false);
  isManagingCategory = false;

  constructor(public router: Router, private activatedRoute: ActivatedRoute, private categoriesService: CategoriesService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.ManageType = ManageTypesEnum.Edit;
        this.isGettingOneCategory$ = of(true);
        this.categoriesService.getOneCategory(params.id).subscribe((category: ICategoriesModel) => {
          this.isGettingOneCategory$ = of(false);
          if (category) {
            this.manageCategoryModel.formGroup.patchValue(category);
            if (this.router.url.includes(ManageTypesEnum.Preview)) {
              this.ManageType = ManageTypesEnum.Preview;
              this.manageCategoryModel.manageAllFields(false);
            }
          }
        }, err => {
          this.isGettingOneCategory$ = of(false);
        });
      }
    });
  }

  submitForm(): void {
    switch (this.ManageType) {
      case ManageTypesEnum.Add:
        this.isManagingCategory = true;
        this.categoriesService.createCategory(this.manageCategoryModel.getCreateValues()).subscribe(() => {
          this.router.navigate(['', 'dictionaries', 'categories']);
          this.isManagingCategory = false;
        }, err => this.isManagingCategory = false);
        break;
      case ManageTypesEnum.Edit:
        this.isManagingCategory = true;
        this.categoriesService.editCategory(this.manageCategoryModel.getEditValues(), this.manageCategoryModel.id.value).subscribe(() => {
          this.router.navigate(['', 'dictionaries', 'categories']);
          this.isManagingCategory = false;
        }, err => this.isManagingCategory = false);
        break;
    }
  }
}
