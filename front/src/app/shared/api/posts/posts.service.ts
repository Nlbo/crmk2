import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPostsModel, IPostsResponseModel} from '@api/posts/res/posts.interface';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {PostsListColumnKeysEnum} from '@pages/posts/posts-list-column-keys.enum';
import {IPostScheduleTime} from '@api/posts/req/post-schedule-time.model';
import {ISchedulesModel} from '@api/schedule/res/schedule.interface';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  titleFilter = '';

  constructor(private httpClient: HttpClient) {
  }

  getPostsList(page = 1, paginated = true, filters: NzTableQueryParams): Observable<IPostsResponseModel> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('paginated', paginated.toString());

    if (this.titleFilter) {
      params = params.set('filter[title]', this.titleFilter);
    }

    filters.filter?.forEach(item => {
      switch (item.key as PostsListColumnKeysEnum) {
        case PostsListColumnKeysEnum.Title:
          if (item.value?.length) {
            params = params.set(`filter[${PostsListColumnKeysEnum.Title}]`, item.value.join());
          }
          break;
        case PostsListColumnKeysEnum.Language:
          if (item.value?.length) {
            params = params.set(`filter[${PostsListColumnKeysEnum.Language}]`, item.value.join());
          }
          break;
        case PostsListColumnKeysEnum.Category:
          if (item.value?.length) {
            params = params.set(`filter[${PostsListColumnKeysEnum.Category}]`, item.value.join());
          }
          break;
        case PostsListColumnKeysEnum.Character:
          if (item.value?.length) {
            params = params.set(`filter[${PostsListColumnKeysEnum.Character}]`, item.value.join());
          }
          break;
        case PostsListColumnKeysEnum.PublishedItemsCount:
          if (item.value?.length) {
            params = params.set(`filter[${PostsListColumnKeysEnum.PublishedItemsCount}]`, item.value.join());
          }
          break;
        case PostsListColumnKeysEnum.Unique:
          if (item.value?.length) {
            params = params.set(`filter[${PostsListColumnKeysEnum.Unique}]`, item.value.join());
          }
          break;
        case PostsListColumnKeysEnum.Created:
          if (item.value?.length) {
            params = params.set(`filter[${PostsListColumnKeysEnum.Created}]`, item.value.join());
          }
          break;
        case PostsListColumnKeysEnum.Updated:
          if (item.value?.length) {
            params = params.set(`filter[${PostsListColumnKeysEnum.Updated}]`, item.value.join());
          }
          break;
      }
    });


    filters.sort?.forEach(item => {
      switch (item.key as PostsListColumnKeysEnum) {
        case PostsListColumnKeysEnum.Title:
          item.value ? item.value === 'ascend' ? params = params.set(`sort`, PostsListColumnKeysEnum.Title) : params = params.set(`sort`, `-${PostsListColumnKeysEnum.Title}`) : false;
          break;
        case PostsListColumnKeysEnum.Language:
          item.value ? item.value === 'ascend' ? params = params.set(`sort`, PostsListColumnKeysEnum.Language) : params = params.set(`sort`, `-${PostsListColumnKeysEnum.Language}`) : false;
          break;
        case PostsListColumnKeysEnum.Category:
          item.value ? item.value === 'ascend' ? params = params.set(`sort`, PostsListColumnKeysEnum.Category) : params = params.set(`sort`, `-${PostsListColumnKeysEnum.Category}`) : false;
          break;
        case PostsListColumnKeysEnum.Character:
          item.value ? item.value === 'ascend' ? params = params.set(`sort`, PostsListColumnKeysEnum.Character) : params = params.set(`sort`, `-${PostsListColumnKeysEnum.Character}`) : false;
          break;
        case PostsListColumnKeysEnum.PublishedItemsCount:
          item.value ? item.value === 'ascend' ? params = params.set(`sort`, PostsListColumnKeysEnum.PublishedItemsCount) : params = params.set(`sort`, `-${PostsListColumnKeysEnum.PublishedItemsCount}`) : false;
          break;
        case PostsListColumnKeysEnum.Unique:
          item.value ? item.value === 'ascend' ? params = params.set(`sort`, PostsListColumnKeysEnum.Unique) : params = params.set(`sort`, `-${PostsListColumnKeysEnum.Unique}`) : false;
          break;
        case PostsListColumnKeysEnum.Created:
          item.value ? item.value === 'ascend' ? params = params.set(`sort`, PostsListColumnKeysEnum.Created) : params = params.set(`sort`, `-${PostsListColumnKeysEnum.Created}`) : false;
          break;
        case PostsListColumnKeysEnum.Updated:
          item.value ? item.value === 'ascend' ? params = params.set(`sort`, PostsListColumnKeysEnum.Updated) : params = params.set(`sort`, `-${PostsListColumnKeysEnum.Updated}`) : false;
          break;
      }
    });
    return this.httpClient.get<IPostsResponseModel>('posts', {params});
  }

  getOnePost(id: string): Observable<IPostsModel> {
    return this.httpClient.get<IPostsModel>(`posts/${id}`);
  }

  createPost(data): Observable<IPostsModel> {
    return this.httpClient.post<IPostsModel>('posts', data);
  }

  editPost(data, id: string): Observable<IPostsModel> {
    return this.httpClient.patch<IPostsModel>(`posts/${id}`, data);
  }

  deletePost(id: string) {
    return this.httpClient.delete(`posts/${id}`);
  }

  createScheduleTime(id: string, data: IPostScheduleTime): Observable<ISchedulesModel[]> {
    return this.httpClient.post<ISchedulesModel[]>(`posts/${id}/scheduleTimes`, data);
  }
}
