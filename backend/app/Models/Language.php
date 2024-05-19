<?php

namespace App\Models;

use App\Traits\UsesUUID;
use Database\Factories\LanguageFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Language extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $fillable = ['title', 'code'];
}
