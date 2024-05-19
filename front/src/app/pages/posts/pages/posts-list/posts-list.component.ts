import {Component, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {PostsService} from '@api/posts/posts.service';
import {IPostsModel, IPostsResponseModel} from '@api/posts/res/posts.interface';
import {ManageTypesEnum} from '@enums/manage-types.enum';
import {PermissionsEnum} from '@enums/permissions.enum';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {ILanguagesModel} from '@api/languages/res/languages.interface';
import {ICategoriesModel} from '@api/categories/res/categories.interface';
import {ICharactersModel} from '@api/characters/res/characters.interface';
import {NzTableFilterList} from 'ng-zorro-antd/table/src/table.types';
import {LanguagesService} from '@api/languages/languages.service';
import {CategoriesService} from '@api/categories/categories.service';
import {CharactersService} from '@api/characters/characters.service';
import {PostsListColumnKeysEnum} from '@pages/posts/posts-list-column-keys.enum';
import {AppHelper} from '@services/app-helper.service';
import {of, Subscription} from 'rxjs';

@Component({
  selector: 'app-posts-lis' +
    't',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit, OnDestroy {
  @ViewChildren('headerColumns') headerColumns;
  visibleTitleFilter = false;
  postsResponse: IPostsResponseModel = null;
  postsList: IPostsModel[] = [];
  pageIndex = 1;
  pageSize = 15;
  PostsListColumnKeysEnum = PostsListColumnKeysEnum;
  ManageTypesEnum = ManageTypesEnum;
  PermissionsEnum = PermissionsEnum;
  languagesList: NzTableFilterList = [];
  categoriesList: NzTableFilterList = [];
  charactersList: NzTableFilterList = [];
  params: NzTableQueryParams;
  isGettingPostsList$ = of(true);
  isGettingPostsListRequest$: Subscription;

  constructor(
    public postsService: PostsService,
    private languagesService: LanguagesService,
    private categoriesService: CategoriesService,
    private charactersService: CharactersService) {
  }

  ngOnInit() {
    this.initializeValues();
    AppHelper.changeRouteEvent.subscribe((url) => {
      if (!AppHelper.changeRouteEventLastValueBeforeChange.includes(url)) {
        this.languagesList = [];
        this.categoriesList = [];
        this.charactersList = [];
        this.headerColumns?._results?.forEach(item => {
          item.sortOrder = null;
        });
        this.postsList = [];
        this.getPostsList({} as NzTableQueryParams);
        this.initializeValues();
      }
    });
  }

  initializeValues() {
    this.visibleTitleFilter = false;
    this.languagesService.getLanguagesList(0, false).subscribe((languagesList: ILanguagesModel[]) => {
      this.languagesList = languagesList.map(language => {
        return {text: language.title, value: language.title};
      }) as NzTableFilterList;
    });
    this.categoriesService.getCategoriesList(0, false).subscribe((categoriesList: ICategoriesModel[]) => {
      this.categoriesList = categoriesList.map(category => {
        return {text: category.title, value: category.title};
      }) as NzTableFilterList;
    });
    this.charactersService.getCharactersList(0, false).subscribe((charactersList: ICharactersModel[]) => {
      this.charactersList = charactersList.map(character => {
        return {text: character.title, value: character.title};
      }) as NzTableFilterList;
    });
  }

  getPostsList(params: NzTableQueryParams = this.params) {
    if (this.isGettingPostsListRequest$) {
      this.isGettingPostsListRequest$.unsubscribe()
    }
    this.isGettingPostsList$ = of(true);
    this.isGettingPostsListRequest$ = this.postsService.getPostsList(this.pageIndex, true, params).subscribe((data) => {
      this.postsResponse = data;
      this.postsList = this.postsResponse.data;
      this.isGettingPostsList$ = of(false);
      this.isGettingPostsListRequest$.unsubscribe();
    }, err => {
      this.isGettingPostsList$ = of(false);
      this.isGettingPostsListRequest$.unsubscribe();
    });
  }

  deletePost(id: string) {
    this.postsService.deletePost(id).subscribe((data) => {
      this.getPostsList();
    });
  }

  ngOnDestroy() {
  }

}
