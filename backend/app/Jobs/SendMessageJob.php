<?php

namespace App\Jobs;

use App\Models\Content;
use App\Models\MessageHistory;
use App\Models\TelegramBot;
use App\Models\TelegramUser;
use App\Services\Bot;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Telegram\Bot\Exceptions\TelegramSDKException;
use Throwable;

class SendMessageJob implements ShouldQueue
{
    use Batchable;
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * @var Content
     */
    private Content $content;
    /**
     * @var TelegramBot
     */
    private TelegramBot $bot;
    /**
     * @var TelegramUser
     */
    private TelegramUser $user;
    /**
     * @var MessageHistory
     */
    private MessageHistory $history;


    /**
     * Create a new job instance.
     *
     * @param MessageHistory $history
     */
    public function __construct(MessageHistory $history)
    {
        $history->update(['is_send' => true]);
        $this->content = $history->content->load(['buttons', 'attachments']);
        $this->bot = $history->contentChain->telegramBot;
        $this->user = $history->telegramUser;
        $this->history = $history;
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
        $bot->send($this->content, $this->user->telegram_user_id);
    }

    public function failed(Throwable $throwable)
    {
        $this->history->update(['is_send' => false]);
    }
}
