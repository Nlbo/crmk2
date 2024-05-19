<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Temporal\Client\GRPC\ServiceClient;
use Temporal\Client\WorkflowClient;

class WorkflowServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->singleton(
            WorkflowClient::class,
            fn() => WorkflowClient::create(
                ServiceClient::create(
                    config('temporal.host') . ':' . config('temporal.port')
                )
            )
        );
    }
}
