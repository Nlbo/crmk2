<?php

namespace App\Models;

use App\Traits\UsesUUID;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class MessageHistory extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $dates = ['delay'];

    protected $fillable = [
        'id',
        'is_send',
        'content_chain_id',
        'telegram_user_id',
        'content_id',
        'delay'
    ];

    /**
     * @return BelongsTo
     */
    public function telegramUser()
    {
        return $this->belongsTo(TelegramUser::class);
    }

    /**
     * @return BelongsTo
     */
    public function contentChain()
    {
        return $this->belongsTo(ContentChain::class);
    }

    public function content()
    {
        return $this->belongsTo(Content::class);
    }
}
