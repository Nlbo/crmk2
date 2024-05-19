<?php

namespace App\Models;

use App\Services\Bot;
use App\Traits\UsesUUID;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Telegram\Bot\Exceptions\TelegramResponseException;
use Telegram\Bot\Objects\PhotoSize;


class TelegramUserAvatar extends Model
{
    use UsesUUID;
    use HasFactory;

    public const SMALL_PHOTO_SIZE = 160;
    protected $appends = ['file_url'];
    protected $fillable = ['file_id'];

    public function avatarable(): MorphTo
    {
        return $this->morphTo();
    }

    public function getFileUrlAttribute(): ?string
    {
        return Cache::remember(
            $this->file_id,
            now()->addDay(),
            function () {
                $token = null;

                if ($this->avatarable instanceof TelegramBot) {
                    $token = $this->avatarable->token;
                } elseif ($this->avatarable instanceof TelegramUser) {
                    $token = $this->avatarable->telegramBot->first()?->token;
                }

                if ($token === null) {
                    return null;
                }

                $bot = new Bot($token);

                try {
                    $file = $bot->getFile(['file_id' => $this->file_id]);
                } catch (TelegramResponseException) {
                    $tgUser = $this->avatarable;
                    if ($tgUser instanceof TelegramUser) {
                        $userId = $tgUser->telegram_user_id;
                    } else {
                        $tgBot = new Bot($tgUser->token);
                        $userId = $tgBot->getMe()->id;
                    }

                    $photos = $bot->getUserProfilePhotos(['user_id' => $userId, 'limit' => 1]);

                    if ($photos->totalCount > 0) {
                        /** @var PhotoSize $photo */
                        $photo = collect(collect($photos->photos)->first())->first(
                            fn(array $photoSize) => $photoSize['width'] === TelegramUserAvatar::SMALL_PHOTO_SIZE
                        );

                        $this->update(
                            [
                                'file_id' => $photo['file_id']
                            ]
                        );
                    } else {
                        $this->delete();
                        return null;
                    }

                    $file = $bot->getFile(['file_id' => $this->refresh()->file_id]);
                }


                return "https://api.telegram.org/file/bot{$bot->getAccessToken()}/$file->filePath";
            }
        );
    }
}
