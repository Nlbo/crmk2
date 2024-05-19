<?php

namespace App\Models;

use App\Traits\UsesUUID;
use Database\Factories\ContentFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;


class Content extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $fillable = ['title', 'body', 'content_chain_id', 'order', 'format'];

    public function chain()
    {
        return $this->belongsTo(ContentChain::class, 'content_chain_id');
    }

    public function buttons()
    {
        return $this->morphMany(Button::class, 'buttonable');
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function messageHistory()
    {
        return $this->hasMany(MessageHistory::class);
    }

    public function stickers()
    {
        return $this->morphToMany(Sticker::class, 'stickerable');
    }
}
