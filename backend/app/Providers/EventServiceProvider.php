<?php

namespace App\Providers;

use App\Events\ShouldReinitializeChain;
use App\Listeners\JobMetricListener;
use App\Listeners\OnMigrationEndedListener;
use App\Listeners\OnShouldReinitializeChain;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Database\Events\MigrationEnded;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Queue\Events\JobProcessed;
use Laravel\Horizon\Events\JobDeleted;
use Laravel\Horizon\Events\JobFailed;
use Laravel\Horizon\Events\JobReleased;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        ShouldReinitializeChain::class => [
            OnShouldReinitializeChain::class
        ],
        MigrationEnded::class => [
            OnMigrationEndedListener::class
        ],
        JobDeleted::class => [
            JobMetricListener::class
        ],
        JobFailed::class => [
            JobMetricListener::class
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
