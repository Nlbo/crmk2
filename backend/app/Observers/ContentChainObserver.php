<?php

namespace App\Observers;

use App\Events\ShouldReinitializeChain;
use App\Models\ContentChain;

class ContentChainObserver
{
    /**
     * Handle the content chain "created" event.
     *
     * @param ContentChain $contentChain
     * @return void
     */
    public function creating(ContentChain $contentChain)
    {
        if ($contentChain->is_active) {
            ContentChain::whereTelegramBotId($contentChain->telegram_bot_id)->where('is_active', true)->update(
                ['is_active' => false]
            );
        }
    }

    /**
     * Handle the content chain "updated" event.
     *
     * @param ContentChain $contentChain
     * @return void
     */
    public function updating(ContentChain $contentChain)
    {
        if (!$contentChain->getOriginal('is_active') && $contentChain->is_active) {
            ContentChain::whereTelegramBotId($contentChain->telegram_bot_id)->where('is_active', true)->update(
                ['is_active' => false]
            );
        }
    }

    public function saved(ContentChain $chain)
    {
        event(new ShouldReinitializeChain($chain));
    }
}
