import {Injectable} from '@angular/core';
import {ActivatedRoute, GuardsCheckStart, NavigationEnd, Router} from '@angular/router';
import {LIST_LIMIT} from '@constants/pagination-defaults.enum';
import {AppHelper} from '@services/app-helper.service';

@Injectable({providedIn: 'root'})
export class PaginationService {
  static paginationInfo: PaginationService;

  limit = LIST_LIMIT;
  pageIndex = 1;
  offset = 0;
  totalItemCount = 0;
  params: URLSearchParams;
  isQueryChanged: boolean;
  isQueryChanging: boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof GuardsCheckStart && !this.isQueryChanging) {
        this.params = new URLSearchParams(window.location.search);
        this.getPaginationInfoFromQuery();
      } else if (event instanceof NavigationEnd) {
        this.isQueryChanging = false;
        this.resetAfterNavigatingFromPage();
      }
    });
  }

  get nextOffset() {
    return this.pageIndex * this.limit - this.limit;
  }

  setQuery() {
    this.isQueryChanging = true;
    const queryParams = {
      limit: this.limit,
      pageIndex: this.pageIndex,
      offset: this.offset
    };
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge',
      });
  }

  getPaginationInfoFromQuery() {
    const queryPageIndex = this.params?.get('pageIndex') !== null ? +this.params?.get('pageIndex') : null;
    const queryLimit = this.params?.get('limit') !== null ? +this.params?.get('limit') : null;
    const queryOffset = this.params?.get('offset') !== null ? +this.params?.get('offset') : null;

    if (AppHelper.isNumber(queryPageIndex)
      && AppHelper.isNumber(queryLimit) && AppHelper.isNumber(queryOffset)) {
      this.pageIndex = +this.params.get('pageIndex') || 1;
      this.limit = +this.params.get('limit') || LIST_LIMIT;
      this.offset = +this.params.get('offset');
      setTimeout(() => this.isQueryChanged = true, 500);
    } else {
      this.isQueryChanged = false;
      this.reset();
    }
  }

  resetAfterNavigatingFromPage = () => {
    const params = new URLSearchParams(window.location.search);
    if (!params?.get('pageIndex')
      && !params?.get('limit') && !params?.get('offset')) {
      this.limit = LIST_LIMIT;
      this.pageIndex = 1;
      this.offset = 0;
      this.isQueryChanged = false;
    }
  }

  reset() {
    this.limit = LIST_LIMIT;
    this.pageIndex = 1;
    this.offset = 0;
    this.totalItemCount = 0;
  }

  resetAfterFilter() {
    this.getPaginationInfoFromQuery();
  }
}
