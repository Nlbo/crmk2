<?php

namespace App\Models;

use App\Traits\UsesUUID;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Chat extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $fillable = [
        'original_chat_id',
        'customer_id',
        'manager_id'
    ];

    protected $touches = ['customer'];

    protected $with = ['manager.avatar', 'customer.avatar'];

    public function manager(): BelongsTo
    {
        return $this->belongsTo(TelegramBot::class, 'manager_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(TelegramUser::class, 'customer_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Update::class)->orderBy('date', 'desc');
    }
}
