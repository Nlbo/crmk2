<?php

namespace App\Observers;

use App\Models\Channel;
use App\Models\TelegramBot;
use Telegram\Bot\Api;
use Telegram\Bot\Exceptions\TelegramSDKException;
use Throwable;

class ChannelObserver
{
    /**
     * @throws TelegramSDKException
     */
    public function saving(Channel $channel): void
    {
        /** @var TelegramBot $poster */
        $poster = $channel->posters()->first();
        if ($poster !== null) {
            try {
                $bot = new Api($poster->token);
                $chat = $bot->getChat(['chat_id' => $channel->telegram_id]);
                $channel->channel_id = $chat->id;
            }catch (Throwable){}
        }
    }
}
