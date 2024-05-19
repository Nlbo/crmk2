import {Component, OnDestroy, OnInit} from '@angular/core';
import {of} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {ICharactersModel} from '@api/characters/res/characters.interface';
import {ILanguagesModel} from '@api/languages/res/languages.interface';
import {ICategoriesModel} from '@api/categories/res/categories.interface';
import {LanguagesService} from '@api/languages/languages.service';
import {CategoriesService} from '@api/categories/categories.service';
import {CharactersService} from '@api/characters/characters.service';
import {PostsManageModel} from '@api/posts/req/posts-manage.model';
import {PostsService} from '@api/posts/posts.service';
import {IPostsModel} from '@api/posts/res/posts.interface';
import {ICountryModel} from '@api/countries/res/country.interface';
import {ISubjectModel} from '@api/subjects/res/subjects.interface';
import {CountriesService} from '@api/countries/countries.service';
import {SubjectsService} from '@api/subjects/subjects.service';
import {IChannelsModel, IChannelsResponseModel} from '@api/channels/res/channels.interface';
import {ChannelsService} from '@api/channels/channels.service';
import {FormControl} from '@angular/forms';
import {IPostScheduleTime} from '@api/posts/req/post-schedule-time.model';
import {DatePipe} from '@angular/common';
import {AppHelper} from '@services/app-helper.service';

@Component({
  selector: 'app-posts-manage',
  templateUrl: './posts-manage.component.html',
  styleUrls: ['./posts-manage.component.scss']
})
export class PostsManageComponent implements OnInit, OnDestroy {

  ManageType: ManageTypesEnum = ManageTypesEnum.Add;
  ManageTypesEnum = ManageTypesEnum;
  isGettingOneChainContent$ = of(false);
  isVisibleButtonsContainer = false;
  isVisibleSendModal = false;
  isVisibleCreateUpdatePostModal = false;
  isSendVideoNote = false;
  isManagingPost = false;
  isAttachmentsVideo = false;
  postsManageModel = new PostsManageModel();
  charactersList: ICharactersModel[] = [];
  languagesList: ILanguagesModel[] = [];
  categoriesList: ICategoriesModel[] = [];
  countriesList: ICountryModel[] = [];
  subjectsList: ISubjectModel[] = [];
  channelsResponse: IChannelsResponseModel = null;
  currentChannelsList: IChannelsModel[] = [];
  channelsList: IChannelsModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  checked = false;
  sendFormControl: FormControl = new FormControl(new Date());
  setOfCheckedId = new Set<string>();
  indeterminate = false;
  originalFormValue = null;
  isEqual = AppHelper.isEqual;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    private languagesService: LanguagesService,
    private categoriesService: CategoriesService,
    private charactersService: CharactersService,
    private countriesService: CountriesService,
    private subjectsService: SubjectsService,
    public channelsService: ChannelsService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.initializeValues();
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.postsManageModel.id.setValue(params.id);
        this.ManageType = ManageTypesEnum.Edit;
        this.isGettingOneChainContent$ = of(true);
        this.postsService.getOnePost(params.id).subscribe((post: IPostsModel) => {
          this.isGettingOneChainContent$ = of(false);
          if (post) {
            this.postsManageModel.attachments.setValue(post.attachments[0], {emitEvent: false});
            this.postsManageModel.attachmentId.setValue(post.attachments[0]?.file_id, {emitEvent: false});
            this.isSendVideoNote = post.attachments[0]?.type === 'VideoNote';
            this.isAttachmentsVideo = post.attachments[0]?.type.includes('Video');
            this.postsManageModel.stickers.setValue(post.stickers[0]?.id, {emitEvent: false});
            this.postsManageModel.body.setValue(post.body, {emitEvent: false});
            this.postsManageModel.title.setValue(post.title, {emitEvent: false});
            this.postsManageModel.categoryId.setValue(post.category_id, {emitEvent: false});
            this.postsManageModel.languageId.setValue(post.language_id, {emitEvent: false});
            this.postsManageModel.characterId.setValue(post.character_id, {emitEvent: false});
            this.postsManageModel.subjectId.setValue(post.subject_id, {emitEvent: false});
            this.postsManageModel.countryId.setValue(post.country?.id, {emitEvent: false});
            if (post.buttons?.length) {
              this.postsManageModel.buttons.setValue({
                url: post.buttons[0].url,
                text: post.buttons[0].text
              });
              this.openButtonsModal();
            }
            if (this.router.url.includes(ManageTypesEnum.Preview)) {
              this.ManageType = ManageTypesEnum.Preview;
              this.postsManageModel.manageAllFields(false);
            }
            this.originalFormValue = this.postsManageModel.getEditValues();
            this.filterChannels();
          }
        }, err => {
          this.isGettingOneChainContent$ = of(false);
        });
      } else {
        this.originalFormValue = this.postsManageModel.getCreateValues();
      }
    });
    this.postsManageModel.formGroup.valueChanges.subscribe((value) => {
     this.filterChannels();
    });
  }

  submitForm(): void {
    switch (this.ManageType) {
      case ManageTypesEnum.Add:
        this.isManagingPost = true;
        this.postsService.createPost(this.postsManageModel.getCreateValues()).subscribe(() => {
          this.router.navigate(['', 'posts']);
          this.isManagingPost = false;
        }, err => this.isManagingPost = false);
        break;
      case ManageTypesEnum.Edit:
        this.isManagingPost = true;
        this.postsService.editPost(this.postsManageModel.getEditValues(), this.postsManageModel.id.value).subscribe(() => {
          this.router.navigate(['', 'posts']);
          this.isManagingPost = false;
        }, err => this.isManagingPost = false);
        break;
    }
  }

  openButtonsModal() {
    this.isVisibleButtonsContainer = true;
  }

  closeButtonsModal() {
    this.postsManageModel.buttons.setValue(null);
    this.isVisibleButtonsContainer = false;
  }

  initializeValues() {
    this.languagesService.getLanguagesList(0, false).subscribe((languagesList: ILanguagesModel[]) => this.languagesList = languagesList);
    this.categoriesService.getCategoriesList(0, false).subscribe((categoriesList: ICategoriesModel[]) => this.categoriesList = categoriesList);
    this.charactersService.getCharactersList(0, false).subscribe((charactersList: ICharactersModel[]) => this.charactersList = charactersList);
    this.countriesService.getCountriesList(0, false).subscribe((countriesList: ICountryModel[]) => this.countriesList = countriesList);
    this.subjectsService.getSubjectsList(0, false).subscribe((subjectsList: ISubjectModel[]) => this.subjectsList = subjectsList);
    this.postsManageModel.languageId.valueChanges.subscribe((value) => value ? this.filterChannels() : null);
    this.postsManageModel.countryId.valueChanges.subscribe((value) => value ? this.filterChannels() : null);
    this.postsManageModel.characterId.valueChanges.subscribe((value) => value ? this.filterChannels() : null);
    this.postsManageModel.subjectId.valueChanges.subscribe((value) => value ? this.filterChannels() : null);
  }

  getChannelsList() {
    this.channelsService.getChannelsList(this.pageIndex).subscribe((data) => {
      this.channelsResponse = data;
      this.currentChannelsList = [...this.channelsResponse.data];
      this.channelsList = [...this.channelsResponse.data];
    });
  }

  onSelectChannel(channel, checked: boolean) {
    this.updateCheckedSet(channel, checked);
    this.refreshCheckedStatus();
  }

  send(): void {
    if (this.ManageType === this.ManageTypesEnum.Add || !AppHelper.isEqual(this.originalFormValue, this.postsManageModel.getCreateValues())) {
      this.isVisibleSendModal = false;
      this.isVisibleCreateUpdatePostModal = true;
    } else {
      const selectedChannelIds = [];
      this.setOfCheckedId.forEach(item => selectedChannelIds.push(item));
      const data: IPostScheduleTime = {
        time: this.datePipe.transform(this.sendFormControl.value, 'yyy-MM-dd HH:mm'),
        channels: selectedChannelIds,
      };
      this.postsService.createScheduleTime(this.postsManageModel.id.value, data).subscribe((schedule) => {
        this.isVisibleSendModal = false;
        this.checked = false;
        this.setOfCheckedId.clear();
        this.refreshCheckedStatus();
      });
    }
  }

  createUpdatePostWithoutRedirect(): void {
    switch (this.ManageType) {
      case ManageTypesEnum.Add:
        this.isManagingPost = true;
        this.postsService.createPost(this.postsManageModel.getCreateValues()).subscribe((post) => {
          window.history.pushState('data', '', `${window.location.href.split(ManageTypesEnum.Add)[0]}${ManageTypesEnum.Edit}/${post.id}`);
          this.postsManageModel.id.setValue(post.id);
          this.originalFormValue = this.postsManageModel.getCreateValues();
          this.ManageType = this.ManageTypesEnum.Edit;
          this.isManagingPost = false;
          this.isVisibleSendModal = true;
          this.isVisibleCreateUpdatePostModal = false;
        }, err => {
          this.isManagingPost = false;
          this.isVisibleCreateUpdatePostModal = false;
          this.isVisibleSendModal = true;
        });
        break;
      case ManageTypesEnum.Edit:
        this.isManagingPost = true;
        this.postsService.editPost(this.postsManageModel.getEditValues(), this.postsManageModel.id.value).subscribe(() => {
          this.originalFormValue = this.postsManageModel.getCreateValues();
          this.ManageType = this.ManageTypesEnum.Edit;
          this.isManagingPost = false;
          this.isVisibleSendModal = true;
          this.isVisibleCreateUpdatePostModal = false;
        }, err => {
          this.isManagingPost = false;
          this.isVisibleCreateUpdatePostModal = false;
          this.isVisibleSendModal = true;
        });
        break;
    }
  }

  filterChannels() {
    this.channelsService.languageFilter = this.languagesList.find(item => item.id === this.postsManageModel.languageId.value)?.title;
    this.channelsService.characterFilter = this.charactersList.find(item => item.id === this.postsManageModel.characterId.value)?.title;
    this.channelsService.subjectFilter = this.subjectsList.find(item => item.id === this.postsManageModel.subjectId.value)?.title;
    this.channelsService.countryFilter = this.countriesList.find(item => item.id === this.postsManageModel.countryId.value)?.title;
    this.getChannelsList();
  }

  ngOnDestroy() {
    this.channelsService.languageFilter = null;
    this.channelsService.countryFilter = null;
    this.channelsService.characterFilter = null;
    this.channelsService.subjectFilter = null;
  }

  changeAttachmentVideoMode($event: boolean) {
   const type = $event ? 'VideoNote' : 'Video';
   const allAttachments = this.postsManageModel.attachments.value;
   if (allAttachments?.type) {
     allAttachments.type = type;
   }
   this.postsManageModel.attachments.setValue(allAttachments);
  }

  sendAttachment(event: any) {
    this.postsManageModel.attachments.reset();
    if (event) {
      this.postsManageModel.attachments.setValue({
        ...event
      });
      this.postsManageModel.attachmentId.setValue(event.file_id);
    }
  }

  onAllChecked(checked: boolean): void {
    this.currentChannelsList
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.currentChannelsList.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = this.currentChannelsList.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onCurrentPageDataChange(listOfCurrentPageData: IChannelsModel[]): void {
    this.currentChannelsList = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }
}
