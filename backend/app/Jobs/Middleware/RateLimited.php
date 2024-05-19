<?php

namespace App\Jobs\Middleware;

use App\Jobs\PostChannelJob;
use App\Services\Bot;
use Illuminate\Contracts\Redis\LimiterTimeoutException;
use Illuminate\Support\Facades\Redis;

class RateLimited
{
    /**
     * Process the queued job.
     *
     * @param PostChannelJob $job
     * @param callable $next
     * @return void
     * @throws LimiterTimeoutException
     */
    public function handle(PostChannelJob $job, callable $next)
    {
        Redis::throttle($job->getChannelId())
            ->block(0)->allow(1)->every(Bot::DELAY)
            ->then(function () use ($job, $next) {
                $next($job);
            }, function () use ($job) {
                $job->release(Bot::DELAY);
            });
    }
}
