<?php

namespace App\Models;

use App\Casts\DateIntervalCast;
use App\Traits\UsesUUID;
use Carbon\CarbonInterval;
use Database\Factories\ContentChainFactory;
use DateTimeInterface;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;


class ContentChain extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $fillable = ['title', 'is_active', 'telegram_bot_id', 'time_to', 'time_from', 'send_interval'];

    protected $casts = [
        'time_from' => 'datetime',
        'time_to' => 'datetime',
        'send_interval' => DateIntervalCast::class
    ];

    protected $dateFormat = 'c';

    public function telegramBot(): BelongsTo
    {
        return $this->belongsTo(TelegramBot::class);
    }

    public function contents(): HasMany
    {
        return $this->hasMany(Content::class)->orderBy('order');
    }

    /**
     * @return HasMany
     */
    public function messageHistory(): HasMany
    {
        return $this->hasMany(MessageHistory::class);
    }

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date): string
    {
        return Carbon::instance($date)->setTimezone('Europe/Moscow')->format('c');
    }
}
