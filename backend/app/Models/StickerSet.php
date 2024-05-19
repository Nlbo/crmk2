<?php

namespace App\Models;

use App\Traits\UsesUUID;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class StickerSet extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $fillable = [
        'name',
        'title',
        'is_animated',
        'contains_masks'
    ];

    public function stickers()
    {
        return $this->hasMany(Sticker::class);
    }
}
