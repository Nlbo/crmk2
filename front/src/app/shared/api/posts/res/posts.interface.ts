import {BaseResponseModel} from '@models/base-response-model';
import {ILanguagesModel} from '@api/languages/res/languages.interface';
import {ICategoriesModel} from '@api/categories/res/categories.interface';
import {ICharactersModel} from '@api/characters/res/characters.interface';
import {IStickersModel} from '@api/stickers/res/stickers.interface';
import {ICountryModel} from "@api/countries/res/country.interface";
import {ISubjectModel} from "@api/subjects/res/subjects.interface";

export interface IPostsResponseModel extends BaseResponseModel {
  data: IPostsModel[];
}

export interface IPostsModel {
  id?: string;
  language_id: string;
  language: ILanguagesModel;
  category_id: string;
  category: ICategoriesModel;
  character_id: string;
  country: ICountryModel;
  subject_id: string;
  subject: ISubjectModel;
  character: ICharactersModel;
  title: string;
  body: string;
  format: string;
  set_webhook: string;
  type: string;
  schedule_times_count: number;
  stickers: IStickersModel[];
  buttons: IButtonsModel[];
  attachments: IAttachmentsModel[];

}

export interface IButtonsModel {
  id: string;
  url: string;
  text: string;
}

export interface IAttachmentsModel {
  id: string;
  file_path: string;
  file_id: string;
  type: string;
  file_url: string;
  caption: string;
}
