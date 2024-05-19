<?php

namespace App\Models;

use App\Traits\UsesUUID;
use DateTimeInterface;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class ScheduleTime extends Model
{
    use UsesUUID;
    use HasFactory;

    public const ERROR_CODE = 0;
    public const NO_POST_CODE = 1;
    public const TELEGRAM_ERROR_CODE = 2;
    public const SUCCESS_CODE = 3;

    private static array $statuses = [
        'System error',
        'No post',
        'Telegram error',
        'Success'
    ];

    protected $fillable = ['time', 'post_id', 'category_id', 'channel_id', 'status', 'status_code'];
    protected $dates = ['time'];


    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function setStatus(int $code): self
    {
        $this->update(
            [
                'status_code' => $code,
                'status' => self::$statuses[$code]
            ]
        );

        return $this;
    }

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return Carbon::instance($date)->setTimezone('Europe/Moscow')->format('c');
    }
}
