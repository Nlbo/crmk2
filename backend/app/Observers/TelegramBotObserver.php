<?php

namespace App\Observers;

use App\Models\TelegramBot;
use App\Models\TelegramUserAvatar;
use App\Services\Bot;
use Telegram\Bot\Exceptions\TelegramSDKException;
use Telegram\Bot\Objects\PhotoSize;

class TelegramBotObserver
{
    /**
     * Handle the telegram bot "created" event.
     *
     * @param TelegramBot $telegramBot
     * @return void
     * @throws TelegramSDKException
     */
    public function created(TelegramBot $telegramBot)
    {
        $tg = new Bot($telegramBot->token);

        if ($telegramBot->set_webhook){
            $tg->removeWebhook();
            $tg->setWebhook(['url' => route('telegram.webhook', ['token' => $telegramBot->token])]);
        }
    }

    /**
     * Handle the telegram bot "updated" event.
     *
     * @param TelegramBot $telegramBot
     * @return void
     * @throws TelegramSDKException
     */
    public function updated(TelegramBot $telegramBot)
    {
        $tg = new Bot($telegramBot->token);

        if ($telegramBot->set_webhook){
            $tg->removeWebhook();
            $tg->setWebhook(['url' => route('telegram.webhook', ['token' => $telegramBot->token])]);
        }
    }

    /**
     * @throws TelegramSDKException
     */
    public function saved(TelegramBot $bot)
    {
        if ($bot->avatar()->doesntExist()) {
            $tgBot = new Bot($bot->token);

            $photos = $tgBot->getUserProfilePhotos(['user_id' => $tgBot->getMe()->id, 'limit' => 1]);

            if ($photos->totalCount > 0) {
                /** @var PhotoSize $photo */
                $photo = collect(collect($photos->photos)->first())->first(
                    fn(array $photoSize) => $photoSize['width'] === TelegramUserAvatar::SMALL_PHOTO_SIZE
                );

                $bot->avatar()->create(
                    [
                        'file_id' => $photo['file_id']
                    ]
                );
            }
        }
    }
}
