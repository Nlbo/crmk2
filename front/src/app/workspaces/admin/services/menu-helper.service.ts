import {Injectable} from '@angular/core';
import {MenuItemTypeEnum} from '@enums/menu-item-type.enum';
import {PermissionsEnum} from '@enums/permissions.enum';
import {MenuItemListModel, MenuItemModel} from '@models/menu-item.model';

@Injectable({
  providedIn: 'root'
})
export class MenuHelperService {

  menuItems = [
    new MenuItemModel(
      'messenger',
      MenuItemTypeEnum.Button,
      'messenger',
      'message',
      [],
      [PermissionsEnum.ManageChats]
    ),
    new MenuItemModel(
      'bots',
      MenuItemTypeEnum.Button,
      'bots',
      'robot',
      [],
      [PermissionsEnum.ViewBotsList]
    ),
    new MenuItemModel(
      'channels',
      MenuItemTypeEnum.Button,
      'channels',
      'calendar',
      [],
      [PermissionsEnum.ViewBotsList]
    ),
    new MenuItemModel(
      'posts',
      MenuItemTypeEnum.Button,
      'posts',
      'picture',
      [],
      [PermissionsEnum.ViewPostsList]
    ),
    new MenuItemModel(
      'dictionaries',
      MenuItemTypeEnum.Dropdown,
      'dictionaries',
      'book',
      [
        new MenuItemListModel(
          'languages',
          'languages',
          [PermissionsEnum.ViewLanguagesList]
        ),
        new MenuItemListModel(
          'categories',
          'categories',
          [PermissionsEnum.ViewCategoriesList]
        ),
        new MenuItemListModel(
          'characters',
          'characters',
          [PermissionsEnum.ViewCharactersList]
        ),
        new MenuItemListModel(
          'countries',
          'countries',
          [PermissionsEnum.ViewCountriesList]
        ),
        new MenuItemListModel(
          'subjects',
          'subjects',
          [PermissionsEnum.ViewSubjectsList]
        ),
      ],
      [
        PermissionsEnum.ViewCategoriesList,
        PermissionsEnum.ViewLanguagesList,
        PermissionsEnum.ViewCharactersList,
        PermissionsEnum.ViewCountriesList,
        PermissionsEnum.ViewSubjectsList,
      ]
    ),
    new MenuItemModel(
      'settings',
      MenuItemTypeEnum.Dropdown,
      'settings',
      'setting',
      [
        new MenuItemListModel(
          'permissions',
          'permissions',
          [PermissionsEnum.ManageRolesAndPermissions]
        ),
        new MenuItemListModel(
          'roles',
          'roles',
          [PermissionsEnum.ManageRolesAndPermissions]
        ),
        new MenuItemListModel(
          'users',
          'users',
          [PermissionsEnum.ViewUsers]
        ),
      ],
      [
        PermissionsEnum.ViewUsers,
        PermissionsEnum.ManageRolesAndPermissions
      ]
    )
  ];

  constructor() {
  }
}
