<?php

namespace App\Observers;

use App\Jobs\PostChannelJob;
use App\Models\Channel;
use App\Models\Post;
use App\Models\ScheduleTime;
use Illuminate\Database\Eloquent\Builder;

class PostObserver
{
    /**
     * Handle the Post "created" event.
     *
     * @param Post $post
     * @return void
     */
    public function created(Post $post)
    {
        $builder = Channel::whereHas(
            'non_schedule_categories',
            fn(Builder $q) => $q->where('category_id', '=', $post->category_id)
        )
            ->with(['characters', 'posters']);

        if ($post->country_id !== null) {
            $builder->whereHas('countries', fn(Builder $q) => $q->where('countries.id', $post->country_id));
        }

        if ($post->subject_id !== null) {
            $builder->whereHas('subjects', fn(Builder $q) => $q->where('subjects.id', $post->subject_id));
        }

        $channels = $builder->get();

        $channels->each(function (Channel $channel) use ($post) {
            if (
                $channel->characters->isEmpty() ||
                $channel->characters->contains('id', '=', $post->character_id)
            ) {
                PostChannelJob::dispatch(
                    $channel->posters->first(),
                    $post,
                    ScheduleTime::create(
                        [
                            'time' => now(),
                            'category_id' => $post->category_id,
                            'channel_id' => $channel->id
                        ]
                    )
                );
            }
        });
    }
}
