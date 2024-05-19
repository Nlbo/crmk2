import {Component, OnInit} from '@angular/core';
import {of} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {SubjectsManageModel} from '@api/subjects/req/subjects.manage.model';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {SubjectsService} from '@api/subjects/subjects.service';
import {ISubjectModel} from '@api/subjects/res/subjects.interface';

@Component({
  selector: 'app-subjects-manage',
  templateUrl: './subjects-manage.component.html',
  styleUrls: ['./subjects-manage.component.scss']
})
export class SubjectsManageComponent implements OnInit {
  manageSubjectsModel = new SubjectsManageModel();
  ManageType: ManageTypesEnum = ManageTypesEnum.Add;
  ManageTypesEnum = ManageTypesEnum;
  isGettingOneSubject$ = of(false);
  isManagingSubject = false;

  constructor(public router: Router, private activatedRoute: ActivatedRoute, private subjectsService: SubjectsService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.ManageType = ManageTypesEnum.Edit;
        this.isGettingOneSubject$ = of(true);
        this.subjectsService.getOneSubject(params.id).subscribe((subject: ISubjectModel) => {
          this.isGettingOneSubject$ = of(false);
          if (subject) {
            this.manageSubjectsModel.formGroup.patchValue(subject);
            if (this.router.url.includes(ManageTypesEnum.Preview)) {
              this.ManageType = ManageTypesEnum.Preview;
              this.manageSubjectsModel.manageAllFields(false);
            }
          }
        }, err => {
          this.isGettingOneSubject$ = of(false);
        });
      }
    });
  }

  submitForm(): void {
    switch (this.ManageType) {
      case ManageTypesEnum.Add:
        this.isManagingSubject = true;
        this.subjectsService.createSubject(this.manageSubjectsModel.getCreateValues()).subscribe(() => {
          this.router.navigate(['', 'dictionaries', 'subjects']);
          this.isManagingSubject = false;
        }, err => this.isManagingSubject = false);
        break;
      case ManageTypesEnum.Edit:
        this.isManagingSubject = true;
        this.subjectsService.editSubject(this.manageSubjectsModel.getEditValues(), this.manageSubjectsModel.id.value)
          .subscribe(() => {
            this.router.navigate(['', 'dictionaries', 'subjects']);
            this.isManagingSubject = false;
          }, err => this.isManagingSubject = false);
        break;
    }
  }
}
