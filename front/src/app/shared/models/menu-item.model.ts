import {MenuItemTypeEnum} from '@enums/menu-item-type.enum';
import {PermissionsEnum} from '@enums/permissions.enum';

export class MenuItemModel {
  title: string;
  type: MenuItemTypeEnum;
  url: string;
  icon: string;
  items: MenuItemListModel[];
  permissions: PermissionsEnum[];

  constructor(
    title: string,
    type: MenuItemTypeEnum,
    url: string,
    icon: string,
    items: MenuItemListModel[] = [],
    permissions: PermissionsEnum[] = [],
) {
    this.title = title;
    this.type = type;
    this.url = url;
    this.icon = icon;
    this.items = items;
    this.permissions = permissions;
  }
}

export class MenuItemListModel {
  title: string;
  url: string;
  permissions: PermissionsEnum[];

  constructor(
    title: string,
    url: string,
    permissions: PermissionsEnum[] = [],
  ) {
    this.title = title;
    this.url = url;
    this.permissions = permissions;
  }
}
