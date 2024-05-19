import {BaseResponseModel} from '@models/base-response-model';
import {ILanguagesModel} from '@api/languages/res/languages.interface';
import {ICharactersModel} from '@api/characters/res/characters.interface';
import {IPostsModel} from '@api/posts/res/posts.interface';
import {IAvatarModel} from '@api/customers/res/avatar.interfacce';
import {ICountryModel} from '@api/countries/res/country.interface';
import {ISubjectModel} from '@api/subjects/res/subjects.interface';
import {ICategoriesModel} from '@api/categories/res/categories.interface';

export interface IChannelsResponseModel extends BaseResponseModel {
  data: IChannelsModel[];
}

export interface IChannelsModel {
  id?: string;
  telegram_id: string;
  title: string;
  language_id: string;
  external_link: string;
  direct_link: string;
  characters: ICharactersModel[];
  countries: ICountryModel[];
  subjects: ISubjectModel[];
  non_schedule_categories: ICategoriesModel[] | string[];
  language?: ILanguagesModel;
  posters: IPostsModel[];
  managers: IManagersModel[];
}


export interface IManagersModel {
  avatar: IAvatarModel;
  id: string;
  title: string;
  token: string;
}
