<?php

namespace App\Models;

use App\Traits\UsesUUID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $fillable = [
        'name',
        'path',
    ];

    public function getFileTypeAttribute(): string
    {
        return Storage::mimeType($this->path);
    }

    public function getFileSizeAttribute(): int
    {
        return Storage::size($this->path);
    }

    public function getIsImageAttribute(): bool
    {
        return explode('/', $this->file_type)[0] === 'image';
    }
}
