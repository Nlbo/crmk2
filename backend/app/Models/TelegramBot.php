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
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Carbon;

class TelegramBot extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $fillable = ['title', 'token', 'set_webhook'];
    protected $with = ['avatar'];

    public function subscribers(): BelongsToMany
    {
        return $this->belongsToMany(TelegramUser::class);
    }

    public function contentChains(): HasMany
    {
        return $this->hasMany(ContentChain::class);
    }

    public function contentChain(): HasOne|Builder
    {
        return $this->hasOne(ContentChain::class)->where('is_active', true)->whereHas('contents');
    }

    public function avatar(): MorphOne
    {
        return $this->morphOne(TelegramUserAvatar::class, 'avatarable');
    }
}
