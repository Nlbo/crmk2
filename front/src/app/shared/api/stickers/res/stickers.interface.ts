import {BaseResponseModel} from '@models/base-response-model';


export interface IStickersResponseModel extends BaseResponseModel {
  stickers: IStickersModel[];
}

export interface IStickersModel {
  id: string;
  width: number;
  height: number;
  emoji: string;
  set_name: string;
  is_animated: true,
  file_id: string;
  file_unique_id: string;
  file_size: number;
  file_url: string;
  file_path: string;
  converted_url: string;
}
