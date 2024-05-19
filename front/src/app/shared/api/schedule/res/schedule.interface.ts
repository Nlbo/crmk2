import {ICategoriesModel} from '@api/categories/res/categories.interface';
import {IPostsModel} from '@api/posts/res/posts.interface';
import {SchedulesTypesEnum} from '@pages/channels/enums/scheduler.enums';
import {IChannelsModel} from '@api/channels/res/channels.interface';

export interface ISchedulesModel {
  id: string;
  time: string;
  channel_id: string;
  post_id: string;
  schedule_day_id: string;
  channel?: IChannelsModel;
  category_id: string;
  status: string;
  status_code: SchedulesTypesEnum;
  category: ICategoriesModel;
  post: IPostsModel;
}
