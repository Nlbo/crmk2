<?php

namespace App\Observers;

use App\Models\ScheduleTime;
use Illuminate\Support\Facades\Cache;

class ScheduleTimeObserver
{
    public function saved(ScheduleTime $time)
    {
        Cache::forget("schedule-{$time->channel_id}-{$time->time->format('m-Y')}");
    }

    public function deleted(ScheduleTime $time)
    {
        Cache::forget("schedule-{$time->channel_id}-{$time->time->format('m-Y')}");
    }
}
