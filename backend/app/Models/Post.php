<?php

namespace App\Models;

use App\Traits\UsesUUID;
use Database\Factories\PostFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Carbon;

class Post extends Model
{
    public const BOT_ID_MACROS = '{bot_id}';

    public const BOT_NAME_MACROS = '{bot_name}';

    public const LINK_MACROS = '{external_link}';

    public const DIRECT_MACROS = '{direct_link}';

    use HasFactory;
    use UsesUUID;

    protected $fillable = [
        'title',
        'body',
        'language_id',
        'category_id',
        'character_id',
        'subject_id',
        'country_id',
        'format'
    ];

    protected $withCount = ['schedule_times'];

    public function buttons(): MorphMany
    {
        return $this->morphMany(Button::class, 'buttonable');
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class);
    }

    public function character(): BelongsTo
    {
        return $this->belongsTo(Character::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function stickers(): MorphToMany
    {
        return $this->morphToMany(Sticker::class, 'stickerable');
    }

    public function schedule_times(): HasMany
    {
        return $this->hasMany(ScheduleTime::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
