import {Component, OnInit} from '@angular/core';
import {ICharactersModel, ICharactersResponseModel} from "@api/characters/res/characters.interface";
import {ManageTypesEnum} from "@enums/manage-types.enum";
import {PermissionsEnum} from "@enums/permissions.enum";
import {SubjectsService} from "@api/subjects/subjects.service";
import {ISubjectsResponseModel} from "@api/subjects/res/subjects.interface";

@Component({
  selector: 'app-subjects-list',
  templateUrl: './subjects-list.component.html',
  styleUrls: ['./subjects-list.component.scss']
})
export class SubjectsListComponent implements OnInit {

  visibleTitleFilter: boolean = false;
  subjectsResponse: ICharactersResponseModel = null;
  subjectsList: ICharactersModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  ManageTypesEnum = ManageTypesEnum;
  PermissionsEnum = PermissionsEnum;

  constructor(public subjectsService: SubjectsService) {
  }

  ngOnInit() {
    this.initializeValues();
  }

  initializeValues() {
    this.visibleTitleFilter = false;
    this.subjectsService.getSubjectsList(this.pageIndex).subscribe((data: ISubjectsResponseModel) => {
      this.subjectsResponse = data;
      this.subjectsList = this.subjectsResponse.data;
    });
  }

  deleteSubject(id: string) {
    this.subjectsService.deleteSubject(id).subscribe((data) => {
      this.initializeValues();
    });
  }

}
