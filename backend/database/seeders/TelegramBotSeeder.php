<?php

namespace Database\Seeders;

use App\Models\TelegramBot;
use Illuminate\Database\Seeder;

class TelegramBotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TelegramBot::create(
            [
                'title' => 'CrmkServiceBot',
                'token' => '1319393317:AAHOF1hf-w3tSN9Md8w5XKmuk5QcCLhvnBY'
            ]
        );
    }
}
