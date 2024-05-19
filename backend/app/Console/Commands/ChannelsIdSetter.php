<?php

namespace App\Console\Commands;

use App\Jobs\PostChannelJob;
use App\Models\Channel;
use App\Models\Post;
use App\Models\ScheduleTime;
use App\Services\Bot;
use Illuminate\Console\Command;
use Log;

class ChannelsIdSetter extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'channels:id:set';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set id to channels';

    private array $limit = [];

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $this->getOutput()->progressStart(Channel::whereChannelId(null)->count());

        Channel::whereChannelId(null)->chunk(100, function ($channels) {
            $channels->each(function (Channel $channel) {
                $poster = $channel->posters->first();
                if ($poster !== null) {
                    try {
                        $bot = new Bot($poster->token);
                        $chat = $bot->getChat(['chat_id' => $channel->telegram_id]);
                        $channel->channel_id = $chat->id;
                        $channel->save();
                        $this->getOutput()->progressAdvance();
                    } catch (\Throwable $e) {
                        $this->getOutput()->progressAdvance();
                        $this->error($e->getMessage());
                        Log::error($e->getMessage());
                    }
                }
            });
        });

        $this->getOutput()->progressFinish();

        return 0;
    }
}
