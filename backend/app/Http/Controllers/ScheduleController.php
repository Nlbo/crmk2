<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddPostScheduleTimeRequest;
use App\Http\Requests\AddScheduleTimeRequest;
use App\Http\Requests\EditScheduleTimeRequest;
use App\Http\Requests\ScheduleFilterRequest;
use App\Models\Channel;
use App\Models\Post;
use App\Models\ScheduleTime;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class ScheduleController extends Controller
{
    public function index(ScheduleFilterRequest $request, Channel $channel): JsonResponse
    {
        $date = Carbon::createFromFormat('m-Y', $request->input('month'));
        return response()->json(
            Cache::remember(
                "schedule-{$channel->id}-{$date->format('m-Y')}",
                now()->addWeek(),
                function () use ($channel, $date) {
                    return $channel
                        ->schedule_times()
                        ->whereMonth('time', $date->month)
                        ->whereYear('time', $date->year)
                        ->orderBy('time')
                        ->with(
                            [
                                'post',
                                'category'
                            ]
                        )
                        ->get();
                }
            )
        );
    }

    public function addScheduleTime(AddScheduleTimeRequest $request, Channel $channel): JsonResponse
    {
        $time = Carbon::createFromFormat('Y-m-d H:i', $request->input('time'), 'Europe/Moscow')->utc();

        $scheduleTime = $channel->schedule_times()->create(
            ['category_id' => $request->input('category_id'), 'time' => $time]
        );

        return response()->json(
            $scheduleTime->load(['post', 'category'])
        );
    }

    public function addPostScheduleTime(AddPostScheduleTimeRequest $request, Post $post): JsonResponse
    {
        $channels = collect($request->input('channels'));

        $time = Carbon::createFromFormat('Y-m-d H:i', $request->input('time'), 'Europe/Moscow')->utc();

        $schedule = $channels->map(fn(string $channelId) => [
            'time' => $time,
            'category_id' => $post->category_id,
            'channel_id' => $channelId
        ]);

        $post->schedule_times()->createMany($schedule);

        return response()->json(
            $post->schedule_times()->with('channel')->get()
        );
    }

    /**
     * @param EditScheduleTimeRequest $request
     * @param Channel $channel
     * @param ScheduleTime $time
     * @return JsonResponse
     * @noinspection PhpUnusedParameterInspection
     */
    public function editScheduleTime(
        EditScheduleTimeRequest $request,
        Channel $channel,
        ScheduleTime $time
    ): JsonResponse {
        $fields = $request->validated();

        if (isset($fields['time'])) {
            $fields['time'] = Carbon::createFromFormat('Y-m-d H:i', $fields['time'], 'Europe/Moscow')->utc();
        }
        $time->update($fields);

        return response()->json(
            $time->load(['post', 'category'])
        );
    }

    /**
     * @param ScheduleTime $scheduleTime
     * @param Channel $channel
     * @return JsonResponse
     * @throws Exception
     * @noinspection PhpUnusedParameterInspection
     */
    public function deleteScheduleTime(Channel $channel, ScheduleTime $scheduleTime): JsonResponse
    {
        if ($scheduleTime->status_code !== ScheduleTime::SUCCESS_CODE) {
            $scheduleTime->delete();
        }
        return response()->json('ok');
    }
}
