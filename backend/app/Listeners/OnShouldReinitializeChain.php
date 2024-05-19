<?php

namespace App\Listeners;

use App\Events\ShouldReinitializeChain;
use App\Services\ChainInitializer;
use Exception;

class OnShouldReinitializeChain
{
    /**
     * Handle the event.
     *
     * @param ShouldReinitializeChain $event
     * @return void
     * @throws Exception
     */
    public function handle(ShouldReinitializeChain $event)
    {
        ChainInitializer::run($event->getChain());
    }
}
