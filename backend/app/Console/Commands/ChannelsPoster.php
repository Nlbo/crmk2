<?php

namespace App\Console\Commands;

use App\Jobs\PostChannelJob;
use App\Models\Post;
use App\Models\ScheduleTime;
use App\Services\Bot;
use Illuminate\Console\Command;

class ChannelsPoster extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'channels:post';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Post to channels by the schedule';

    private array $limit = [];

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $timesCollection = ScheduleTime::query()
            ->where('time', '<=', now())
            ->orderBy('time')
            ->whereRaw('(status_code !=' . ScheduleTime::SUCCESS_CODE . ' or status_code is null)')
            ->with(['channel.characters', 'channel.posters', 'channel.subjects', 'channel.countries', 'post']);

        $timesCollection->each(
            function (ScheduleTime $time) {
                if (!$this->isLimitReached($time->channel_id)) {
                    $post = $this->getPost($time);

                    if ($time->status_code === ScheduleTime::ERROR_CODE || $time->status_code === ScheduleTime::TELEGRAM_ERROR_CODE) {
                        if ($post !== null && $post->updated_at->lessThan($time->updated_at)) {
                            return;
                        }
                    }

                    if ($post !== null) {
                        $poster = $time->channel->posters->first();
                        PostChannelJob::dispatch($poster, $post, $time);
                        $this->add($time->channel_id);
                    } else {
                        $time->setStatus(ScheduleTime::NO_POST_CODE);
                    }
                }
            }
        );

        return 0;
    }

    private function isLimitReached(string $channelId): bool
    {
        return isset($this->limit[$channelId]) && $this->limit[$channelId] >= Bot::MESSAGES_PER_MINUTE;
    }

    private function getPost(ScheduleTime $time): ?Post
    {
        if ($time->post !== null) {
            return $time->post;
        }

        $query = Post::query();

        $subjects = $time->channel->subjects->pluck('id');
        $countries = $time->channel->countries->pluck('id');

        $query->whereCategoryId($time->category->id)
            ->whereLanguageId($time->channel->language_id)
            ->withCount('schedule_times');


        if ($subjects->isEmpty()) {
            $query->whereSubjectId(null);
        } else {
            $query->whereIn('subject_id', $subjects->all());
        }

        if ($countries->isEmpty()) {
            $query->whereCountryId(null);
        } else {
            $query->whereIn('country_id', $countries->all());
        }

        $characters = $time->channel->characters->pluck('id');
        if ($characters->isNotEmpty()) {
            $query->whereIn('character_id', $characters->toArray());
        }

        return $query->orderBy('schedule_times_count')->first();
    }

    private function add(string $channelId): void
    {
        if (isset($this->limit[$channelId])) {
            $this->limit[$channelId] += 1;
        } else {
            $this->limit[$channelId] = 1;
        }
    }
}
