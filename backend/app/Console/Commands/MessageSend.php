<?php

namespace App\Console\Commands;

use App\Jobs\SendMessageJob;
use App\Models\MessageHistory;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;

class MessageSend extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'messages:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatch delayed messages to queue';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        MessageHistory::whereIsSend(false)->whereHas(
            'contentChain',
            function (Builder $q) {
                $q->where('is_active', true);
            }
        )->where('delay', '<=', now()->format('Y-m-d H:i:s'))->cursor()->each(
            fn(MessageHistory $messageHistory) => SendMessageJob::dispatch($messageHistory)
        );

        return 0;
    }
}
