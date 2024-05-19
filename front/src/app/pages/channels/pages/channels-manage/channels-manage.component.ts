import {Component, OnInit} from '@angular/core';
import {of} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {ChannelsManageModel} from '@api/channels/req/channels.manage';
import {ChannelsService} from '@api/channels/channels.service';
import {IChannelsModel} from '@api/channels/res/channels.interface';
import {ILanguagesModel} from '@api/languages/res/languages.interface';
import {ICharactersModel} from '@api/characters/res/characters.interface';
import {IBotsModel} from '@api/bots/res/bots.interface';
import {LanguagesService} from '@api/languages/languages.service';
import {BotsService} from '@api/bots/bots.service';
import {CharactersService} from '@api/characters/characters.service';
import {ISubjectModel} from '@api/subjects/res/subjects.interface';
import {ICategoriesModel} from '@api/categories/res/categories.interface';
import {ICountryModel} from '@api/countries/res/country.interface';
import {SubjectsService} from '@api/subjects/subjects.service';
import {CategoriesService} from '@api/categories/categories.service';
import {CountriesService} from '@api/countries/countries.service';

@Component({
  selector: 'app-channels-manage',
  templateUrl: './channels-manage.component.html',
  styleUrls: ['./channels-manage.component.scss']
})
export class ChannelsManageComponent implements OnInit {

  manageChannelModel = new ChannelsManageModel();
  ManageType: ManageTypesEnum = ManageTypesEnum.Add;
  ManageTypesEnum = ManageTypesEnum;
  isGettingOneChannel$ = of(false);
  isManagingChannel = false;
  languagesList: ILanguagesModel[] = [];
  charactersList: ICharactersModel[] = [];
  subjectsList: ISubjectModel[] = [];
  categoriesList: ICategoriesModel[] = [];
  countriesList: ICountryModel[] = [];
  botsList: IBotsModel[] = [];

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private channelsService: ChannelsService,
    private languagesService: LanguagesService,
    private botsService: BotsService,
    private charactersService: CharactersService,
    private subjectsService: SubjectsService,
    private categoriesService: CategoriesService,
    private countriesService: CountriesService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.ManageType = ManageTypesEnum.Edit;
        this.isGettingOneChannel$ = of(true);
        this.channelsService.getOneChannel(params.id).subscribe((channel: IChannelsModel) => {
          this.isGettingOneChannel$ = of(false);
          if (channel) {
            this.manageChannelModel.id.setValue(channel.id);
            this.manageChannelModel.externalLink.setValue(channel.external_link);
            this.manageChannelModel.directLink.setValue(channel.direct_link);
            this.manageChannelModel.title.setValue(channel.title);
            this.manageChannelModel.characters.setValue(channel.characters?.map(item => item.id));
            this.manageChannelModel.categories.setValue((channel.non_schedule_categories as ICategoriesModel[])?.map(item => item.id));
            this.manageChannelModel.subjects.setValue(channel.subjects?.map(item => item.id));
            this.manageChannelModel.countries.setValue(channel.countries?.map(item => item.id));
            this.manageChannelModel.languageId.setValue(channel.language.id);
            this.manageChannelModel.posters.setValue(channel.posters.map(item => item.id)[0]);
            this.manageChannelModel.managers.setValue(channel.managers.map(item => item.id)[0]);
            this.manageChannelModel.telegramId.setValue(channel.telegram_id);
            if (this.router.url.includes(ManageTypesEnum.Preview)) {
              this.ManageType = ManageTypesEnum.Preview;
              this.manageChannelModel.manageAllFields(false);
            }
          }
        }, err => {
          this.isGettingOneChannel$ = of(false);
        });
      }
    });
    this.initializeValues();
  }

  submitForm(): void {
    switch (this.ManageType) {
      case ManageTypesEnum.Add:
        this.isManagingChannel = true;
        this.channelsService.createChannel(this.manageChannelModel.getCreateValues()).subscribe(() => {
          this.router.navigate(['', 'channels']);
          this.isManagingChannel = false;
        }, err => this.isManagingChannel = false);
        break;
      case ManageTypesEnum.Edit:
        this.isManagingChannel = true;
        this.channelsService.editChannel(this.manageChannelModel.getEditValues(), this.manageChannelModel.id.value).subscribe(() => {
          this.router.navigate(['', 'channels']);
          this.isManagingChannel = false;
        }, err => this.isManagingChannel = false);
        break;
    }
  }

  initializeValues() {
    this.languagesService.getLanguagesList(0, false).subscribe((languagesList: ILanguagesModel[]) => this.languagesList = languagesList);
    this.botsService.getBotsList(0, false).subscribe((botsList: IBotsModel[]) => this.botsList = botsList);
    this.charactersService.getCharactersList(0, false).subscribe((charactersList: ICharactersModel[]) => this.charactersList = charactersList);
    this.subjectsService.getSubjectsList(0, false).subscribe((subjectsList: ISubjectModel[]) => this.subjectsList = subjectsList);
    this.categoriesService.getCategoriesList(0, false).subscribe((categoriesList: ICategoriesModel[]) => this.categoriesList = categoriesList);
    this.countriesService.getCountriesList(0, false).subscribe((countriesList: ICountryModel[]) => this.countriesList = countriesList);
  }

  isNotSelectedCharacters(value: string): boolean {
    return this.manageChannelModel.characters.value.indexOf(value) === -1;
  }
  isNotSelectedCountries(value: string): boolean {
    return this.manageChannelModel.characters.value.indexOf(value) === -1;
  }
  isNotSelectedSubjects(value: string): boolean {
    return this.manageChannelModel.characters.value.indexOf(value) === -1;
  }
  isNotSelectedCategories(value: string): boolean {
    return this.manageChannelModel.characters.value.indexOf(value) === -1;
  }

}
