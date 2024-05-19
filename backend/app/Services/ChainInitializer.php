<?php


namespace App\Services;


use App\Jobs\SendMessageJob;
use App\Models\Content;
use App\Models\ContentChain;
use App\Models\MessageHistory;
use App\Models\TelegramBot;
use App\Models\TelegramUser;
use Carbon\Carbon;
use Carbon\CarbonInterval;
use Exception;
use Illuminate\Support\Collection;

class ChainInitializer
{
    /**
     * @param ContentChain $chain
     * @param TelegramUser|null $user
     * @throws Exception
     */
    public static function run(ContentChain $chain, ?TelegramUser $user = null)
    {
        CarbonInterval::setLocale('en');

        if ($user !== null) {
            self::init($chain, $user);
        } else {
            self::reInit($chain);
        }
    }

    /**
     * @param ContentChain $chain
     * @param TelegramUser $user
     * @throws Exception
     */
    private static function init(ContentChain $chain, TelegramUser $user): void
    {
        if ($chain->contents->count() > 0) {
            $delay = now();

            [$from, $to] = self::getSleepInterval($chain);

            $interval = $chain->send_interval;

            $chain->contents->each(
                function (Content $content, int $key) use ($chain, $user, $delay, $from, $to, $interval) {
                    if ($key === 0) {
                        $history = $content->messageHistory()->create(
                            [
                                'telegram_user_id' => $user->id,
                                'content_chain_id' => $chain->id,
                                'content_id' => $content->id,
                                'is_send' => true,
                                'delay' => $delay
                            ]
                        );
                        SendMessageJob::dispatch($history);
                    } else {
                        self::historyCreate($content, $user->id, $delay, $interval, $from, $to);
                    }
                }
            );
        }
    }

    private static function getSleepInterval(ContentChain $chain): array
    {
        $from = null;
        $to = null;
        if (!is_null($chain->time_from) && !is_null($chain->time_to)) {
            $from = $chain->time_from->toMutable()->setDateFrom(now())->utc();
            $to = $chain->time_to->toMutable()->setDateFrom(now())->utc();
            if ($from->equalTo($to)) {
                $from = null;
                $to = null;
            }
        }

        return [$from, $to];
    }

    /**
     * @throws Exception
     */
    private static function historyCreate(
        Content $content,
        string $userId,
        Carbon $prevDelay,
        CarbonInterval $interval,
        ?Carbon $from,
        ?Carbon $to
    ): void {
        /** @var MessageHistory $history */
        $history = $content->messageHistory()
            ->where('telegram_user_id', $userId)
            ->where('content_chain_id', $content->chain->id)
            ->where('content_id', $content->id)
            ->where('is_send', false)
            ->first();

        $min = self::getMinimalIntervalValue($interval);

        $delay = self::prepareDelay($prevDelay, $interval, $min, $from, $to);

        if (!is_null($history)) {
            $history->update(['delay' => $delay]);
            return;
        }

        if ($content->messageHistory()
            ->where('telegram_user_id', $userId)
            ->where('content_chain_id', $content->chain->id)
            ->where('content_id', $content->id)
            ->where('is_send', true)
            ->doesntExist()
        ) {
            $content->messageHistory()->create(
                [
                    'telegram_user_id' => $userId,
                    'content_chain_id' => $content->chain->id,
                    'content_id' => $content->id,
                    'delay' => $delay
                ]
            );
        }
    }

    /**
     * @throws Exception
     */
    private static function getMinimalIntervalValue(CarbonInterval $interval): string
    {
        $parts = explode(' ', $interval->forHumans());
        return end($parts);
    }

    private static function prepareDelay(
        Carbon $delay,
        CarbonInterval $interval,
        string $min,
        ?Carbon $from,
        ?Carbon $to
    ): Carbon {
        $delay->add($interval)->startOf($min);

        if (!is_null($from) && !is_null($to)) {
            if ($delay->greaterThan($to)) {
                $to->addDay();
                $delay->setDateTimeFrom($from->addDay());
            }
            if ($delay->lessThan($from)) {
                $delay->setDateTimeFrom($from);
            }
        }

        return $delay;
    }

    /**
     * @throws Exception
     */
    public static function reInit(ContentChain $chain): void
    {
        if ($chain->is_active && $chain->contents->count() > 0) {
            $delays = self::initDelays($chain->telegramBot);

            [$from, $to] = self::getSleepInterval($chain);

            $interval = $chain->send_interval;

            $chain->contents()->get()->each(
                function (Content $content) use ($delays, $from, $to, $interval) {
                    $content->chain->telegramBot->subscribers->each(
                        function (TelegramUser $user) use ($content, $delays, $from, $to, $interval) {
                            self::historyCreate($content, $user->id, $delays->get($user->id), $interval, $from, $to);
                        }
                    );
                }
            );
        }
    }

    /**
     * @param TelegramBot $bot
     * @return Collection<string, Carbon>
     */
    private static function initDelays(TelegramBot $bot): Collection
    {
        $delays = collect([]);
        $bot->subscribers()->pluck('telegram_users.id')->each(fn(string $id) => $delays->put($id, now()));
        return $delays;
    }
}
