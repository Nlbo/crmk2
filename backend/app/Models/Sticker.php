<?php

namespace App\Models;

use App\Services\Bot;
use App\Traits\UsesUUID;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Sticker extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $fillable = [
        'width',
        'height',
        'emoji',
        'set_name',
        'sticker_set_id',
        'is_animated',
        'file_unique_id',
        'file_id',
        'file_path',
        'file_size'
    ];
    protected $appends = ['file_url', 'converted_url'];

    public function sticker_set(): BelongsTo
    {
        return $this->belongsTo(StickerSet::class);
    }

    /**
     * @return string
     */
    public function getFileUrlAttribute(): string
    {
        $token = Bot::SERVICE_BOT_ID;
        return "https://api.telegram.org/file/bot$token/$this->file_path";
    }
}
