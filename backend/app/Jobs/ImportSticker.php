<?php

namespace App\Jobs;

use App\Models\StickerSet;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Telegram\Bot\Api;
use Telegram\Bot\Exceptions\TelegramSDKException;

class ImportSticker implements ShouldQueue
{
    use Batchable;
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    private array $sticker;
    private Api $bot;
    private StickerSet $set;

    public function __construct(
        Api $bot,
        array $sticker,
        StickerSet $set
    ) {
        $this->set = $set;
        $this->bot = $bot;
        $this->sticker = $sticker;
    }

    /**
     * Execute the job.
     *
     * @return void
     * @throws TelegramSDKException
     */
    public function handle(): void
    {
        $this->set->stickers()->create(
            [
                'width' => $this->sticker['width'],
                'height' => $this->sticker['height'],
                'emoji' => $this->sticker['emoji'],
                'set_name' => $this->sticker['set_name'],
                'is_animated' => $this->sticker['is_animated'],
                'file_id' => $this->sticker['file_id'],
                'file_unique_id' => $this->sticker['file_unique_id'],
                'file_size' => $this->sticker['file_size'],
                'file_path' => $this->bot->getFile(
                    [
                        'file_id' => $this->sticker['file_id']
                    ]
                )['file_path']
            ]
        );
    }
}
