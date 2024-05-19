<?php

namespace App\Jobs;

use App\Jobs\Middleware\RateLimited;
use App\Models\Post;
use App\Models\ScheduleTime;
use App\Models\TelegramBot;
use App\Services\Bot;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use JetBrains\PhpStorm\Pure;
use Telegram\Bot\Exceptions\TelegramSDKException;
use Throwable;

class PostChannelJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * @var TelegramBot
     */
    private TelegramBot $bot;
    /**
     * @var Post
     */
    private Post $post;
    /**
     * @var ScheduleTime
     */
    private ScheduleTime $time;

    /**
     * Create a new job instance.
     *
     * @param TelegramBot $bot
     * @param Post $post
     * @param ScheduleTime $time
     */
    public function __construct(TelegramBot $bot, Post $post, ScheduleTime $time)
    {
        $this->bot = $bot;
        $this->post = $post;
        $this->time = $time;

        if ($time->post_id === null) {
            $this->time->update(['post_id' => $this->post->id]);
        }
        $this->time->setStatus(ScheduleTime::SUCCESS_CODE);
    }

    /**
     * Execute the job.
     *
     * @return void
     * @throws TelegramSDKException
     */
    public function handle()
    {
        $bot = new Bot($this->bot->token);
        $bot->send($this->post, $this->time->channel->channel_id ?: $this->time->channel->telegram_id);
    }

    public function failed(Throwable $exception)
    {
        if ($exception instanceof TelegramSDKException) {
            $this->time->setStatus(ScheduleTime::TELEGRAM_ERROR_CODE);
        } else {
            $this->time->setStatus(ScheduleTime::ERROR_CODE);
        }
    }

    public function getChannelId(): string
    {
        return $this->time->channel_id;
    }

    /**
     * Get the middleware the job should pass through.
     *
     * @return array
     */
    #[Pure]
    public function middleware(): array
    {
        return [new RateLimited()];
    }
}
