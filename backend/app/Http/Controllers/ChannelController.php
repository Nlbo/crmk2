<?php

namespace App\Http\Controllers;

use App\Filters\PostFilters\RelationTitleFilter;
use App\Http\Requests\CreateChannelRequest;
use App\Http\Requests\UpdateChannelRequest;
use App\Models\Channel;
use App\Models\Character;
use App\Models\Country;
use App\Models\Language;
use App\Models\Subject;
use App\Models\TelegramBot;
use App\Sorts\PostSorts\RelationTitleSort;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;
use Telegram\Bot\Api;

class ChannelController extends Controller
{

    public function __construct()
    {
        $this->authorizeResource(Channel::class, 'channel');
    }

    public function index(Request $request): JsonResponse
    {
        $builder = QueryBuilder::for(Channel::class)
            ->allowedFilters(
                [
                    'title',
                    AllowedFilter::custom('language.title', new RelationTitleFilter(), 'language'),
                    AllowedFilter::custom('character.title', new RelationTitleFilter(), 'characters'),
                    AllowedFilter::custom('subject.title', new RelationTitleFilter(), 'subjects'),
                    AllowedFilter::custom('country.title', new RelationTitleFilter(), 'countries'),
                    'created_at',
                    'updated_at',
                ]
            )
            ->allowedSorts(
                [
                    'title',
                    AllowedSort::custom('language.title', new RelationTitleSort(), Language::class),
                    AllowedSort::custom('character.title', new RelationTitleSort(), Character::class),
                    AllowedSort::custom('subject.title', new RelationTitleSort(), Subject::class),
                    AllowedSort::custom('country.title', new RelationTitleSort(), Country::class),
                    'created_at',
                    'updated_at',
                ]
            )
            ->with([
                       'language',
                       'characters',
                       'managers',
                       'posters',
                       'subjects',
                       'countries',
                       'non_schedule_categories'
                   ]);

        if ($request->boolean('paginated')) {
            return response()->json($builder->paginate()->appends($request->query()));
        }
        return response()->json($builder->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CreateChannelRequest $request
     * @return JsonResponse
     * @throws Throwable
     */
    public function store(CreateChannelRequest $request): JsonResponse
    {
        $channelRequest = collect($request->validated());
        $characters = $channelRequest->pull('characters');
        $subjects = $channelRequest->pull('subjects');
        $countries = $channelRequest->pull('countries');
        $posters = $channelRequest->pull('posters');
        $managers = $channelRequest->pull('managers');
        $nonScheduleCategories = $channelRequest->pull('non_schedule_categories');

        /** @var Channel $channel */
        $channel = DB::transaction(
            function () use (
                $channelRequest,
                $posters,
                $managers,
                $characters,
                $nonScheduleCategories,
                $countries,
                $subjects
            ) {
                $channel = Channel::create(
                    array_merge(
                        $channelRequest->toArray(),
                        [
                            'channel_id' => $this->getChannelId(
                                $posters[0],
                                $channelRequest->get('telegram_id')
                            )
                        ]
                    )
                );

                $channel->posters()->attach($posters, ['role' => 'poster']);
                $channel->managers()->attach($managers, ['role' => 'manager']);
                $channel->characters()->sync($characters);
                $channel->subjects()->sync($subjects);
                $channel->countries()->sync($countries);
                $channel->non_schedule_categories()->sync($nonScheduleCategories);

                return $channel;
            }
        );

        return response()->json(
            $channel->load(
                [
                    'language',
                    'characters',
                    'managers',
                    'posters',
                    'subjects',
                    'countries',
                    'non_schedule_categories'
                ]
            )
        );
    }

    public function show(Channel $channel): JsonResponse
    {
        return response()->json(
            $channel->load(
                [
                    'language',
                    'characters',
                    'managers',
                    'posters',
                    'subjects',
                    'countries',
                    'non_schedule_categories'
                ]
            )
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateChannelRequest $request
     * @param Channel $channel
     * @return JsonResponse
     * @throws Throwable
     */
    public function update(UpdateChannelRequest $request, Channel $channel): JsonResponse
    {
        $channelRequest = collect($request->validated());
        $subjects = $channelRequest->pull('subjects');
        $characters = $channelRequest->pull('characters');
        $countries = $channelRequest->pull('countries');
        $posters = $channelRequest->pull('posters');
        $managers = $channelRequest->pull('managers');
        $nonScheduleCategories = $channelRequest->pull('non_schedule_categories');

        /** @var Channel $channel */
        $channel = DB::transaction(
            function () use (
                $channelRequest,
                $posters,
                $managers,
                $channel,
                $characters,
                $nonScheduleCategories,
                $countries,
                $subjects
            ) {
                $channel->update(
                    array_merge(
                        $channelRequest->toArray(),
                        [
                            'channel_id' => $this->getChannelId(
                                $posters[0],
                                $channelRequest->get('telegram_id')
                            )
                        ]
                    )
                );

                $channel->posters()->detach();
                $channel->posters()->attach($posters, ['role' => 'poster']);

                $channel->managers()->detach();
                $channel->managers()->attach($managers, ['role' => 'manager']);

                $channel->characters()->sync($characters);
                $channel->subjects()->sync($subjects);
                $channel->countries()->sync($countries);
                $channel->non_schedule_categories()->sync($nonScheduleCategories);

                return $channel;
            }
        );

        return response()->json(
            $channel->load(
                [
                    'language',
                    'characters',
                    'managers',
                    'posters',
                    'subjects',
                    'countries',
                    'non_schedule_categories'
                ]
            )
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Channel $channel
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Channel $channel): JsonResponse
    {
        $channel->delete();

        return response()->json('OK');
    }

    private function getChannelId(string $botId, string $channelName)
    {
        $bot = new Api(TelegramBot::find($botId)->token);
        $chat = $bot->getChat(['chat_id' => $channelName]);
        return $chat->id;
    }
}
