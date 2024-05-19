<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Trait UsesUuid
 * @package App\Models\Concerns
 * @mixin Model
 */
trait UsesUUID
{
    protected static function bootUsesUuid()
    {
        static::creating(
            function ($model) {
                if (!$model->getKey()) {
                    $model->{$model->getKeyName()} = (string)Str::uuid();
                }
            }
        );
    }

    public function getIncrementing()
    {
        return false;
    }

    public function getKeyType()
    {
        return 'string';
    }
}
