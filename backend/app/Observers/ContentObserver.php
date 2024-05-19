<?php

namespace App\Observers;

use App\Events\ShouldReinitializeChain;
use App\Models\Content;

class ContentObserver
{
    /**
     * Handle the content "created" event.
     *
     * @param Content $content
     * @return void
     */
    public function created(Content $content)
    {
        event(new ShouldReinitializeChain($content->chain));
    }
}
