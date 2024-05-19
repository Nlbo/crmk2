import {BaseResponseModel} from '@models/base-response-model';
import {IAttachmentsModel, IButtonsModel} from '@api/posts/res/posts.interface';
import {IStickersModel} from '@api/stickers/res/stickers.interface';

export interface IContentResponseModel extends BaseResponseModel {
  data: IContentModel[];
}

export interface IContentModel {
  id: string;
  title: string;
  body: string;
  format: string;
  buttons: IButtonsModel[];
  attachments: IAttachmentsModel[];
  stickers: IStickersModel[];
  order: number;
  created_at: string;
  updated_at: string;
}
