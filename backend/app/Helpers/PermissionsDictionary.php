<?php


namespace App\Helpers;


class PermissionsDictionary
{
    //Roles list
    public const ADMIN = 'admin';
    public const MANAGER = 'manager';

    //Permissions list

    //permissions
    public const MANAGE_ROLES_AND_PERMISSIONS = 'manage_roles_and_permissions';

    //users
    public const INVITE_USERS = 'invite_users';
    public const VIEW_USERS = 'view_users';
    public const UPDATE_USERS = 'update_users';
    public const DELETE_USERS = 'delete_users';

    //bots
    public const VIEW_BOTS_LIST = 'view_bots_list';
    public const VIEW_BOT = 'view_bot';
    public const CREATE_BOT = 'create_bot';
    public const UPDATE_BOT = 'update_bot';
    public const DELETE_BOT = 'delete_bot';

    //chains
    public const VIEW_CHAINS_LIST = 'view_chains_list';
    public const VIEW_CHAIN = 'view_chain';
    public const CREATE_CHAIN = 'create_chain';
    public const UPDATE_CHAIN = 'update_chain';
    public const DELETE_CHAIN = 'delete_chain';

    //contents
    public const VIEW_CONTENTS_LIST = 'view_contents_list';
    public const VIEW_CONTENT = 'view_content';
    public const CREATE_CONTENT = 'create_content';
    public const UPDATE_CONTENT = 'update_content';
    public const DELETE_CONTENT = 'delete_content';

    //channels
    public const VIEW_CHANNELS_LIST = 'view_channels_list';
    public const VIEW_CHANNEL = 'view_channel';
    public const CREATE_CHANNEL = 'create_channel';
    public const UPDATE_CHANNEL = 'update_channel';
    public const DELETE_CHANNEL = 'delete_channel';

    //posts
    public const VIEW_POSTS_LIST = 'view_posts_list';
    public const VIEW_POST = 'view_post';
    public const CREATE_POST = 'create_post';
    public const UPDATE_POST = 'update_post';
    public const DELETE_POST = 'delete_post';

    //languages
    public const VIEW_LANGUAGES_LIST = 'view_languages_list';
    public const VIEW_LANGUAGE = 'view_language';

    //categories
    public const VIEW_CATEGORIES_LIST = 'view_categories_list';
    public const VIEW_CATEGORY = 'view_category';
    public const CREATE_CATEGORY = 'create_category';
    public const UPDATE_CATEGORY = 'update_category';
    public const DELETE_CATEGORY = 'delete_category';

    //characters
    public const VIEW_CHARACTERS_LIST = 'view_characters_list';
    public const VIEW_CHARACTER = 'view_character';
    public const CREATE_CHARACTER = 'create_character';
    public const UPDATE_CHARACTER = 'update_character';
    public const DELETE_CHARACTER = 'delete_character';

    //countries
    public const VIEW_COUNTRIES_LIST = 'view_countries_list';
    public const VIEW_COUNTRY = 'view_country';

    //subjects
    public const VIEW_SUBJECTS_LIST = 'view_subjects_list';
    public const VIEW_SUBJECT = 'view_subject';
    public const CREATE_SUBJECT = 'create_subject';
    public const UPDATE_SUBJECT = 'update_subject';
    public const DELETE_SUBJECT = 'delete_subject';

    //schedule
    public const VIEW_SCHEDULE = 'view_schedule';
    public const CREATE_SCHEDULE = 'create_schedule';
    public const UPDATE_SCHEDULE = 'update_schedule';
    public const DELETE_SCHEDULE = 'delete_schedule';

    //chats
    public const MANAGE_CHATS = 'manage_chats';
}
