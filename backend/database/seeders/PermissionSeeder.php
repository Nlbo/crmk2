<?php

namespace Database\Seeders;

use App\Helpers\PermissionsDictionary;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Exceptions\PermissionAlreadyExists;
use Spatie\Permission\Exceptions\RoleAlreadyExists;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        try {
            /** @var Role $admin */
            $admin = Role::create(['name' => PermissionsDictionary::ADMIN]);

            User::whereEmail('admin@crmk.online')->first()->assignRole($admin);
        } catch (RoleAlreadyExists) {
            $admin = Role::query()->where('name', PermissionsDictionary::ADMIN)->first();
        }

        try {
            $admin->givePermissionTo(
                [
                    //permissions
                    Permission::create(['name' => PermissionsDictionary::MANAGE_ROLES_AND_PERMISSIONS]),

                    //users
                    Permission::create(['name' => PermissionsDictionary::INVITE_USERS]),
                    Permission::create(['name' => PermissionsDictionary::VIEW_USERS]),
                    Permission::create(['name' => PermissionsDictionary::DELETE_USERS]),

                    //bots
                    Permission::create(['name' => PermissionsDictionary::VIEW_BOTS_LIST]),
                    Permission::create(['name' => PermissionsDictionary::VIEW_BOT]),
                    Permission::create(['name' => PermissionsDictionary::CREATE_BOT]),
                    Permission::create(['name' => PermissionsDictionary::UPDATE_BOT]),
                    Permission::create(['name' => PermissionsDictionary::DELETE_BOT]),

                    //chains
                    Permission::create(['name' => PermissionsDictionary::VIEW_CHAINS_LIST]),
                    Permission::create(['name' => PermissionsDictionary::VIEW_CHAIN]),
                    Permission::create(['name' => PermissionsDictionary::CREATE_CHAIN]),
                    Permission::create(['name' => PermissionsDictionary::UPDATE_CHAIN]),
                    Permission::create(['name' => PermissionsDictionary::DELETE_CHAIN]),

                    //contents
                    Permission::create(['name' => PermissionsDictionary::VIEW_CONTENTS_LIST]),
                    Permission::create(['name' => PermissionsDictionary::VIEW_CONTENT]),
                    Permission::create(['name' => PermissionsDictionary::CREATE_CONTENT]),
                    Permission::create(['name' => PermissionsDictionary::UPDATE_CONTENT]),
                    Permission::create(['name' => PermissionsDictionary::DELETE_CONTENT]),

                    //channels
                    Permission::create(['name' => PermissionsDictionary::VIEW_CHANNELS_LIST]),
                    Permission::create(['name' => PermissionsDictionary::VIEW_CHANNEL]),
                    Permission::create(['name' => PermissionsDictionary::CREATE_CHANNEL]),
                    Permission::create(['name' => PermissionsDictionary::UPDATE_CHANNEL]),
                    Permission::create(['name' => PermissionsDictionary::DELETE_CHANNEL]),

                    //posts
                    Permission::create(['name' => PermissionsDictionary::VIEW_POSTS_LIST]),
                    Permission::create(['name' => PermissionsDictionary::VIEW_POST]),
                    Permission::create(['name' => PermissionsDictionary::CREATE_POST]),
                    Permission::create(['name' => PermissionsDictionary::UPDATE_POST]),
                    Permission::create(['name' => PermissionsDictionary::DELETE_POST]),

                    //languages
                    Permission::create(['name' => PermissionsDictionary::VIEW_LANGUAGES_LIST]),
                    Permission::create(['name' => PermissionsDictionary::VIEW_LANGUAGE]),

                    //categories
                    Permission::create(['name' => PermissionsDictionary::VIEW_CATEGORIES_LIST]),
                    Permission::create(['name' => PermissionsDictionary::VIEW_CATEGORY]),
                    Permission::create(['name' => PermissionsDictionary::CREATE_CATEGORY]),
                    Permission::create(['name' => PermissionsDictionary::UPDATE_CATEGORY]),
                    Permission::create(['name' => PermissionsDictionary::DELETE_CATEGORY]),

                    //characters
                    Permission::create(['name' => PermissionsDictionary::VIEW_CHARACTERS_LIST]),
                    Permission::create(['name' => PermissionsDictionary::VIEW_CHARACTER]),
                    Permission::create(['name' => PermissionsDictionary::CREATE_CHARACTER]),
                    Permission::create(['name' => PermissionsDictionary::UPDATE_CHARACTER]),
                    Permission::create(['name' => PermissionsDictionary::DELETE_CHARACTER]),

                    //schedule
                    Permission::create(['name' => PermissionsDictionary::VIEW_SCHEDULE]),
                    Permission::create(['name' => PermissionsDictionary::CREATE_SCHEDULE]),
                    Permission::create(['name' => PermissionsDictionary::UPDATE_SCHEDULE]),
                    Permission::create(['name' => PermissionsDictionary::DELETE_SCHEDULE]),

                    //Chats
                    Permission::create(['name' => PermissionsDictionary::MANAGE_CHATS]),
                ]
            );
        } catch (PermissionAlreadyExists) {
        }

        try {
            $admin->givePermissionTo(Permission::create(['name' => PermissionsDictionary::UPDATE_USERS]));
        } catch (PermissionAlreadyExists) {
        }

        try {
            //countries
            $admin->givePermissionTo(Permission::create(['name' => PermissionsDictionary::VIEW_COUNTRIES_LIST]));
            $admin->givePermissionTo(Permission::create(['name' => PermissionsDictionary::VIEW_COUNTRY]));

            //Subjects
            Permission::create(['name' => PermissionsDictionary::VIEW_SUBJECTS_LIST]);
            Permission::create(['name' => PermissionsDictionary::VIEW_SUBJECT]);
            Permission::create(['name' => PermissionsDictionary::CREATE_SUBJECT]);
            Permission::create(['name' => PermissionsDictionary::UPDATE_SUBJECT]);
            Permission::create(['name' => PermissionsDictionary::DELETE_SUBJECT]);
        } catch (PermissionAlreadyExists) {
        }
    }
}
