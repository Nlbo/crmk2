<?php

namespace Database\Seeders;

use App\Services\Bot;
use App\Services\StickerImport;
use Illuminate\Database\Seeder;
use Telegram\Bot\Exceptions\TelegramSDKException;
use Throwable;

class StickerSetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     * @throws TelegramSDKException
     * @throws Throwable
     * @noinspection DuplicatedCode
     */
    public function run()
    {
        $defaults = ['Animals', 'FreeFromWorries'];
        $bot = new Bot(Bot::SERVICE_BOT_ID);
        foreach ($defaults as $default) {
            $tgStickerSet = $bot->getStickerSet(['name' => $default]);

            (new StickerImport())->import($tgStickerSet->name, false);
        }
    }
}

