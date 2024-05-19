import {Component, OnInit} from '@angular/core';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {CharactersService} from '@api/characters/characters.service';
import {ICharactersModel, ICharactersResponseModel} from '@api/characters/res/characters.interface';
import {PermissionsEnum} from '@enums/permissions.enum';

@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent implements OnInit {
  visibleTitleFilter: boolean = false;
  charactersResponse: ICharactersResponseModel = null;
  charactersList: ICharactersModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  ManageTypesEnum = ManageTypesEnum;
  PermissionsEnum = PermissionsEnum;

  constructor(public charactersService: CharactersService) {
  }

  ngOnInit() {
    this.initializeValues();
  }

  initializeValues() {
    this.visibleTitleFilter = false;
    this.charactersService.getCharactersList(this.pageIndex).subscribe((data: ICharactersResponseModel) => {
      this.charactersResponse = data;
      this.charactersList = this.charactersResponse.data;
    });
  }

  deleteCharacter(id: string) {
    this.charactersService.deleteCharacter(id).subscribe((data) => {
      this.initializeValues();
    });
  }

}
