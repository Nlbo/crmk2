<?php

namespace App\Providers;

use App\Models\Channel;
use App\Models\Content;
use App\Models\ContentChain;
use App\Models\Post;
use App\Models\ScheduleTime;
use App\Models\TelegramBot;
use App\Models\User;
use App\Observers\ChannelObserver;
use App\Observers\ContentChainObserver;
use App\Observers\ContentObserver;
use App\Observers\PostObserver;
use App\Observers\ScheduleTimeObserver;
use App\Observers\TelegramBotObserver;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Torann\GeoIP\Facades\GeoIP;

class AppServiceProvider extends ServiceProvider
{
    public const LOCALES = [
        'RU' => 'ru',
        'MD' => 'ru',
        'BY' => 'ru',
        'UA' => 'ru'
    ];

    /**
     * Bootstrap any application services.
     *
     * @return void
     * @throws Exception
     */
    public function boot()
    {
        $this->setLocale();

        TelegramBot::observe(TelegramBotObserver::class);
        ContentChain::observe(ContentChainObserver::class);
        Content::observe(ContentObserver::class);
        ScheduleTime::observe(ScheduleTimeObserver::class);
        Post::observe(PostObserver::class);
        Channel::observe(ChannelObserver::class);
    }

    /**
     * @throws Exception
     */
    private function setLocale()
    {
        $request = $this->app->get(Request::class);

        /** @var User $user */
        $user = Auth::guard('sanctum')->user();

        if ($user !== null) {
            $lang = $user->language;
        } else {
            $geo = GeoIP::getLocation($request->ip());
            $lang = self::LOCALES[$geo->iso_code] ?? 'en';
        }

        $this->app->setLocale($lang);
    }
}
