<?php

namespace App\Casts;

use Carbon\CarbonInterval;
use Exception;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Contracts\Database\Eloquent\SerializesCastableAttributes;
use Illuminate\Database\Eloquent\Model;

class DateIntervalCast implements CastsAttributes, SerializesCastableAttributes
{
    /**
     * Cast the given value.
     *
     * @param Model $model
     * @param string $key
     * @param mixed $value
     * @param array $attributes
     * @return CarbonInterval
     */
    public function get($model, $key, $value, $attributes): CarbonInterval
    {
        return CarbonInterval::fromString($value)->locale('en');
    }

    /**
     * Prepare the given value for storage.
     *
     * @param Model $model
     * @param string $key
     * @param mixed $value
     * @param array $attributes
     * @return string
     */
    public function set($model, $key, $value, $attributes): string
    {
        return $value;
    }

    /**
     * @param Model $model
     * @param string $key
     * @param CarbonInterval $value
     * @param array $attributes
     * @return string
     * @throws Exception
     */
    public function serialize($model, string $key, $value, array $attributes): string
    {
        return $value->locale('en')->forHumans(['short' => true]);
    }
}
