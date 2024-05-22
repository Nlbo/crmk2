<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        //$this->call(UserSeeder::class);
        $this->call(TelegramBotSeeder::class);
        $this->call(StickerSetSeeder::class);
        $this->call(ContentChainSeeder::class);
        $this->call(CategorySeeder::class);
        $this->call(CharacterSeeder::class);
        $this->call(PostSeeder::class);
        $this->call(ChannelSeeder::class);
        $this->call(ScheduleSeeder::class);
        $this->call(PermissionSeeder::class);
    }
}
