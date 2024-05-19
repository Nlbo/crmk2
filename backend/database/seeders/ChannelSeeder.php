<?php

namespace Database\Seeders;

use App\Models\Channel;
use App\Models\Character;
use App\Models\Language;
use App\Models\TelegramBot;
use Illuminate\Database\Seeder;

class ChannelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $channel = Channel::create(
            [
                'title' => 'CrmkTestChannel',
                'telegram_id' => '@crmkTestChan',
                'language_id' => Language::whereCode('en')->first()->id,
            ]
        );

        $channel->posters()->attach(TelegramBot::whereTitle('CrmkTestBot')->first()->id, ['role' => 'poster']);
        $channel->managers()->attach(TelegramBot::whereTitle('CrmkTest2Bot')->first()->id, ['role' => 'manager']);

        $channel->characters()->sync(Character::query()->pluck('id'));
    }
}
