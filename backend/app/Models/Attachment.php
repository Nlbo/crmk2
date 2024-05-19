<?php

namespace App\Models;

use App\Traits\UsesUUID;
use Database\Factories\AttachmentFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;


class Attachment extends Model
{
    use HasFactory;
    use UsesUUID;

    protected $appends = ['file_url'];
    protected $with = ['file'];
    protected $fillable = ['file_id', 'type', 'content_id', 'caption'];

    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
    }

    public function getFileUrlAttribute(): string
    {
        return Storage::url($this->file->path);
    }

    public function getFileTypeAttribute(): string
    {
        return Storage::mimeType($this->file->path);
    }

    public function getIsImageAttribute(): bool
    {
        return explode('/', $this->file_type)[0] === 'image';
    }
}
