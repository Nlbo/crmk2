<?php

namespace App\Events;

use App\Models\ContentChain;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ShouldReinitializeChain
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var ContentChain
     */
    private ContentChain $chain;

    /**
     * Create a new event instance.
     *
     * @param ContentChain $chain
     */
    public function __construct(ContentChain $chain)
    {
        $this->chain = $chain;
    }

    public function getChain(): ContentChain
    {
        return $this->chain;
    }
}
