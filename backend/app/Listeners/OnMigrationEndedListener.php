<?php

namespace App\Listeners;

use AddMorphFieldsToTelegramUserAvatarsTable;
use CreateCountriesTable;
use CreateLanguagesTable;
use CreatePermissionTables;
use CreateUsersTable;
use Database\Seeders\CountrySeeder;
use Database\Seeders\LanguageSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\TelegramBotSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Database\Events\MigrationEnded;

class OnMigrationEndedListener
{
    /**
     * Handle the event.
     *
     * @param MigrationEnded $event
     * @return void
     */
    public function handle(MigrationEnded $event)
    {
        if ($event->migration instanceof CreateLanguagesTable && $event->method === 'up') {
            (new LanguageSeeder())->run();
        }

        if ($event->migration instanceof CreateUsersTable && $event->method === 'up') {
            (new UserSeeder())->run();
        }

        if ($event->migration instanceof CreatePermissionTables && $event->method === 'up') {
            (new PermissionSeeder())->run();
        }

        if ($event->migration instanceof AddMorphFieldsToTelegramUserAvatarsTable && $event->method === 'up') {
            (new TelegramBotSeeder())->run();
        }

        if ($event->migration instanceof CreateCountriesTable && $event->method === 'up') {
            (new CountrySeeder())->run();
        }
    }
}
