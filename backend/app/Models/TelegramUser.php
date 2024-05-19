<?php

namespace App\Models;

use App\Traits\UsesUUID;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Carbon;


class TelegramUser extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $fillable = [
        'telegram_user_id',
        'is_bot',
        'first_name',
        'last_name',
        'language_code',
        'username'
    ];

    protected $with = ['avatar'];

    public function telegramBot(): BelongsToMany
    {
        return $this->belongsToMany(TelegramBot::class);
    }

    public function messageHistory(): HasMany
    {
        return $this->hasMany(MessageHistory::class);
    }

    public function chats(): HasMany
    {
        return $this->hasMany(Chat::class, 'customer_id', 'id');
    }

    public function avatar(): MorphOne
    {
        return $this->morphOne(TelegramUserAvatar::class, 'avatarable');
    }
}
