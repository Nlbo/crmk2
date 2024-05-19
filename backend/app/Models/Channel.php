<?php

namespace App\Models;

use App\Traits\UsesUUID;
use Database\Factories\ChannelFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Channel extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $fillable = [
        'telegram_id',
        'title',
        'language_id',
        'character_id',
        'external_link',
        'direct_link'
    ];

    public function schedule_times(): HasMany
    {
        return $this->hasMany(ScheduleTime::class);
    }

    public function characters(): BelongsToMany
    {
        return $this->belongsToMany(Character::class);
    }

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class);
    }

    public function posters(): BelongsToMany
    {
        return $this
            ->belongsToMany(TelegramBot::class)
            ->using(ChannelTelegramBot::class)
            ->wherePivot('role', 'poster')
            ->withPivot(['role']);
    }

    public function managers(): BelongsToMany
    {
        return $this
            ->belongsToMany(TelegramBot::class)
            ->using(ChannelTelegramBot::class)
            ->wherePivot('role', 'manager')
            ->withPivot(['role']);
    }

    public function non_schedule_categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'subject_channel');
    }

    public function countries(): BelongsToMany
    {
        return $this->belongsToMany(Country::class, 'country_channel');
    }
}
