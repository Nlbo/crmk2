<?php


namespace App\Services;


use App\Jobs\ImportSticker;
use App\Models\Sticker;
use App\Models\StickerSet;
use App\Models\Update;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Cache;
use Telegram\Bot\Api;
use Telegram\Bot\Exceptions\TelegramSDKException;
use Throwable;

class StickerImport
{
    public const NO_STICKER_ID = '';

    /**
     * @param string $name
     * @param bool $wait
     * @param Update|null $update
     * @param string|null $sticker_id
     * @return StickerSet
     * @throws TelegramSDKException
     * @throws Throwable
     */
    public function import(
        string $name,
        bool $wait = true,
        ?Update $update = null,
        ?string $sticker_id = null
    ): StickerSet {
        $bot = new Bot(Bot::SERVICE_BOT_ID);
        $tgSet = $bot->getStickerSet(['name' => $name]);

        $set = StickerSet::create(
            [
                'name' => $tgSet->name,
                'title' => $tgSet->title,
                'is_animated' => $tgSet->isAnimated,
                'contains_masks' => $tgSet->containsMasks
            ]
        );


/*        $batch = Bus::batch(
            collect($tgSet->stickers)->map(
                fn(array $sticker) => new ImportSticker(new Api($bot->getAccessToken()), $sticker, $set)
            )->toArray()
        )
            ->then(
                fn() => Cache::forget('stickers')
            )->then(
                function () use ($update, $set, $sticker_id) {
                    $sticker = $set->stickers()->where('file_unique_id', $sticker_id)->first();
                    $update->update(['sticker_id' => $sticker->id]);
                }
            )
            ->name('Import stickers')
            ->onQueue('sticker')
            ->dispatch();
            */


        if ($wait) {
            while (!$batch->finished()) {
                sleep(1);
            }
        }

        return $set;
    }
}
