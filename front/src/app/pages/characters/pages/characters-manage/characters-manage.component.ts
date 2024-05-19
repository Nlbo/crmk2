import {Component, OnInit} from '@angular/core';
import {of} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {CharactersManageModel} from '@api/characters/req/characters.manage.model';
import {CharactersService} from '@api/characters/characters.service';
import {ICharactersModel} from '@api/characters/res/characters.interface';

@Component({
  selector: 'app-characters-manage',
  templateUrl: './characters-manage.component.html',
  styleUrls: ['./characters-manage.component.scss']
})
export class CharactersManageComponent implements OnInit {

  manageCharactersModel = new CharactersManageModel();
  ManageType: ManageTypesEnum = ManageTypesEnum.Add;
  ManageTypesEnum = ManageTypesEnum;
  isGettingOneCharacter$ = of(false);
  isManagingCharacter = false;

  constructor(public router: Router, private activatedRoute: ActivatedRoute, private charactersService: CharactersService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.ManageType = ManageTypesEnum.Edit;
        this.isGettingOneCharacter$ = of(true);
        this.charactersService.getOneCharacter(params.id).subscribe((character: ICharactersModel) => {
          this.isGettingOneCharacter$ = of(false);
          if (character) {
            this.manageCharactersModel.formGroup.patchValue(character);
            if (this.router.url.includes(ManageTypesEnum.Preview)) {
              this.ManageType = ManageTypesEnum.Preview;
              this.manageCharactersModel.manageAllFields(false);
            }
          }
        }, err => {
          this.isGettingOneCharacter$ = of(false);
        });
      }
    });
  }

  submitForm(): void {
    switch (this.ManageType) {
      case ManageTypesEnum.Add:
        this.isManagingCharacter = true;
        this.charactersService.createCharacter(this.manageCharactersModel.getCreateValues()).subscribe(() => {
          this.router.navigate(['', 'dictionaries', 'characters']);
          this.isManagingCharacter = false;
        }, err => this.isManagingCharacter = false);
        break;
      case ManageTypesEnum.Edit:
        this.isManagingCharacter = true;
        this.charactersService.editCharacter(this.manageCharactersModel.getEditValues(), this.manageCharactersModel.id.value)
          .subscribe(() => {
          this.router.navigate(['', 'dictionaries', 'characters']);
          this.isManagingCharacter = false;
        }, err => this.isManagingCharacter = false);
        break;
    }
  }

}
