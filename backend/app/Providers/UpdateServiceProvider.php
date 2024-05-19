<?php

namespace App\Providers;

use App\Services\Bot;
use App\Services\StickerImport;
use App\Services\Updates\TelegramUpdateParser;
use App\Services\Updates\UpdateParser;
use Illuminate\Foundation\Application;
use Illuminate\Support\ServiceProvider;

class UpdateServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot()
    {
        $this->app->bind(
            UpdateParser::class,
            function (Application $app) {
                return new TelegramUpdateParser(
                    $app->get(Bot::class),
                    $app->get(StickerImport::class)
                );
            }
        );
    }
}
