<?php
/** @noinspection PhpMissingFieldTypeInspection */

namespace App\Models;

use App\Traits\UsesUUID;
use ArrayObject;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

class Update extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $casts = [
        'original' => AsArrayObject::class,
        'date' => 'datetime',
        'edit_date' => 'datetime'
    ];

    protected $touches = ['chat'];

    protected $with = ['messageFrom', 'messageTo', 'attachments', 'sticker', 'user'];

    protected $fillable = [
        'from_id',
        'from_type',
        'to_id',
        'to_type',
        'sticker_id',
        'text',
        'date',
        'original_id',
        'original',
        'chat_id',
        'edit_date',
        'user_id',
        'media_group_id',
        'format',
        'type'
    ];

    public function messageFrom(): MorphTo
    {
        return $this->morphTo(null, 'from_type', 'from_id');
    }

    public function messageTo(): MorphTo
    {
        return $this->morphTo(null, 'to_type', 'to_id');
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function sticker(): BelongsTo
    {
        return $this->belongsTo(Sticker::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class);
    }

    public function nl2br(): self
    {
        if ($this->text !== null) {
            $this->text = nl2br($this->text);
        }

        $this->attachments->transform(
            function (Attachment $attachment) {
                if ($attachment->caption !== null) {
                    $attachment->caption = nl2br($attachment->caption);
                }
            }
        );

        return $this;
    }
}
