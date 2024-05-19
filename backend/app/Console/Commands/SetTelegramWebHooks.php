<?php

namespace App\Console\Commands;

use App\Models\TelegramBot;
use App\Services\Bot;
use Illuminate\Console\Command;
use Telegram\Bot\Exceptions\TelegramSDKException;
use Throwable;

class SetTelegramWebHooks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'webhooks:set';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command sets telegram webhooks for updates';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     * @throws TelegramSDKException
     */
    public function handle(): int
    {
        TelegramBot::query()->get()->each(
            function (TelegramBot $bot) {
                $tg = new Bot($bot->token);
                try {
                    $tg->removeWebhook();
                    $tg->setWebhook(['url' => route('telegram.webhook', ['token' => $bot->token])]);
                } catch (Throwable $exception) {
                    sleep(1);
                    $tg->removeWebhook();
                    $tg->setWebhook(['url' => route('telegram.webhook', ['token' => $bot->token])]);
                }
            }
        );
        return 0;
    }
}
