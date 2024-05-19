<?php

namespace App\Models;

use App\Traits\UsesUUID;
use Database\Factories\ButtonFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;


class Button extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $fillable = ['text', 'url', 'content_id'];

    public function buttonable()
    {
        return $this->morphTo();
    }
}
