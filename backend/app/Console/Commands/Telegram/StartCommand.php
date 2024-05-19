<?php

namespace App\Console\Commands\Telegram;

use App\Models\TelegramBot;
use App\Models\TelegramUser;
use App\Models\TelegramUserAvatar;
use App\Services\Bot;
use App\Services\ChainInitializer;
use Telegram\Bot\Commands\Command;
use Telegram\Bot\Objects\PhotoSize;
use Throwable;

/**
 * @method replyWithMediaGroup(array $buildContent)
 */
class StartCommand extends Command
{
    /**
     * @var string Command Name
     */
    protected $name = "start";

    /**
     * @var string Command Description
     */
    protected $description = "Start Command to get you started";

    /**
     * @inheritdoc
     * @throws Throwable
     */
    public function handle()
    {
        $user = TelegramUser::firstOrCreate(
            ['telegram_user_id' => $this->update->message->from->id],
            [
                'telegram_user_id' => $this->update->message->from->id,
                'is_bot' => $this->update->message->from->isBot,
                'first_name' => $this->update->message->from->firstName,
                'last_name' => $this->update->message->from->lastName,
                'language_code' => $this->update->message->from->languageCode,
                'username' => $this->update->message->from->username
            ]
        );

        $token = $this->getTelegram()->getAccessToken();

        if ($user->chats()->exists()) {
            $user->chats()->update(['is_blocked' => false]);
        }

        if ($user->avatar()->doesntExist()) {
            $bot = new Bot($token);

            $photos = $bot->getUserProfilePhotos(['user_id' => $this->update->message->from->id, 'limit' => 1]);

            if ($photos->totalCount > 0) {
                /** @var PhotoSize $photo */
                $photo = collect(collect($photos->photos)->first())->first(
                    fn(array $photoSize) => $photoSize['width'] === TelegramUserAvatar::SMALL_PHOTO_SIZE
                );

                $user->avatar()->create(
                    [
                        'file_id' => $photo['file_id']
                    ]
                );
            }
        }

        if ($user->telegramBot()->where('token', $token)->doesntExist()) {
            $bot = TelegramBot::whereToken($token)->with(['contentChain'])->first();
            $user->telegramBot()->attach($bot->id);

            if (!is_null($bot->contentChain)) {
                ChainInitializer::run($bot->contentChain, $user);
            }
        }
    }
}
