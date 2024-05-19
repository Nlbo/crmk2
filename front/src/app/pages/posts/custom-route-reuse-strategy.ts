import {RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {

  public static handlers: { [key: string]: DetachedRouteHandle } = {};

  private static delete: string;

  // THIS METHOD IS USED FOR DELETE ROUTE
  public static deleteRouteSnapshot(name: string): void {
    if (CustomRouteReuseStrategy.handlers[name]) {
      delete CustomRouteReuseStrategy.handlers[name];
    } else {
      CustomRouteReuseStrategy.delete = name;
    }
  }

  // THIS METHOD RETURN TRUE WHEN ROUTE REUSE LATER
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return true;
  }

  // THIS METHOD IS USD FOR STORE ROUTE STATE
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (CustomRouteReuseStrategy.delete && CustomRouteReuseStrategy.delete == this.getRouteUrl(route)) {
      CustomRouteReuseStrategy.delete = null;
      return;
    }

    if (this.getRouteUrl(route) === '_posts_list') {
      CustomRouteReuseStrategy.handlers[this.getRouteUrl(route)] = handle;
    } else {
      CustomRouteReuseStrategy.deleteRouteSnapshot(this.getRouteUrl(route));
    }
  }

  // ATTACHED ROUTE IF ALREADY NOT PRESENT
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!CustomRouteReuseStrategy.handlers[this.getRouteUrl(route)];
  }

  // THIS METHOD IS USED FOR RETRIEVING ROUTE STATE
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (!route.routeConfig) {
      return null;
    }
    return CustomRouteReuseStrategy.handlers[this.getRouteUrl(route)];
  }

  // THIS METHOD RUN WHEN USER CHANGE ROUTE EVEY TIME AND CHECK CURRENT ROUTE WANT TO USED CUSTOM STRATEGY OR NOT
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig &&
      JSON.stringify(future.params) === JSON.stringify(curr.params);
  }

  // FIND OUT ACTUAL ROUTE NAME AND ROUTE THE URL
  private getRouteUrl(route: ActivatedRouteSnapshot) {
    return route['_routerState'].url.replace(/\//g, '_');
  }
}
