<?php

namespace App\Providers;

use App\Console\Commands\Telegram\StartCommand;
use App\Models\TelegramBot;
use App\Services\Bot;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\ServiceProvider;

class BotServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->bind(
            Bot::class,
            function () {
                if (request()->is('*api/telegram*webhook')) {
                    if (TelegramBot::whereToken(request()->route('token'))->doesntExist()) {
                        throw new ModelNotFoundException(TelegramBot::class);
                    }

                    $bot = new Bot(request()->route('token'));
                    $bot->addCommand(StartCommand::class);
                    return $bot;
                } elseif (request()->route('chat') !== null) {
                    $chat = request()->route('chat');
                    return new Bot($chat->manager->token);
                } else {
                    return new Bot(Bot::SERVICE_BOT_ID);
                }
            }
        );
    }
}
