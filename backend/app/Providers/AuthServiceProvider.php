<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Channel;
use App\Models\Character;
use App\Models\Content;
use App\Models\ContentChain;
use App\Models\Country;
use App\Models\Language;
use App\Models\Post;
use App\Models\Subject;
use App\Models\TelegramBot;
use App\Policies\CategoryPolicy;
use App\Policies\ChannelPolicy;
use App\Policies\CharacterPolicy;
use App\Policies\ContentChainPolicy;
use App\Policies\ContentPolicy;
use App\Policies\CountryPolicy;
use App\Policies\LanguagePolicy;
use App\Policies\PostPolicy;
use App\Policies\SubjectPolicy;
use App\Policies\TelegramBotPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Category::class => CategoryPolicy::class,
        Channel::class => ChannelPolicy::class,
        Character::class => CharacterPolicy::class,
        ContentChain::class => ContentChainPolicy::class,
        Content::class => ContentPolicy::class,
        Language::class => LanguagePolicy::class,
        Post::class => PostPolicy::class,
        TelegramBot::class => TelegramBotPolicy::class,
        Country::class => CountryPolicy::class,
        Subject::class => SubjectPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        //
    }
}
