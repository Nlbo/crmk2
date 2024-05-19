<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateContentChainRequest;
use App\Http\Requests\UpdateContentChainRequest;
use App\Models\ContentChain;
use App\Models\TelegramBot;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Spatie\QueryBuilder\QueryBuilder;

class ContentChainController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(ContentChain::class, 'chain');
    }

    /**
     * Display a listing of the resource.
     *
     * @param TelegramBot $bot
     * @param Request $request
     * @return JsonResponse
     */
    public function index(TelegramBot $bot, Request $request): JsonResponse
    {
        $builder = QueryBuilder::for(ContentChain::class)
            ->where('telegram_bot_id', $bot->id)
            ->allowedFilters(['title']);

        if ($request->boolean('paginated')) {
            return response()->json($builder->paginate()->appends($request->query()));
        }
        return response()->json($builder->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CreateContentChainRequest $request
     * @param TelegramBot $bot
     * @return JsonResponse
     */
    public function store(CreateContentChainRequest $request, TelegramBot $bot): JsonResponse
    {
        $fields = array_merge(
            $request->validated(),
            [
                'time_from' => $request->input('time_from') !== null ? Carbon::createFromFormat(
                    'H:i:s',
                    $request->input(
                        'time_from'
                    ),
                    'Europe/Moscow'
                )->utc() : null,
                'time_to' => $request->input('time_to') !== null ? Carbon::createFromFormat(
                    'H:i:s',
                    $request->input('time_to'),
                    'Europe/Moscow'
                )->utc() : null
            ]
        );
        return response()->json($bot->contentChains()->create($fields));
    }

    /**
     * Display the specified resource.
     *
     * @param TelegramBot $bot
     * @param ContentChain $contentChain
     * @return JsonResponse
     * @noinspection PhpUnusedParameterInspection
     */
    public function show(TelegramBot $bot, ContentChain $contentChain): JsonResponse
    {
        return response()->json($contentChain);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateContentChainRequest $request
     * @param TelegramBot $bot
     * @param ContentChain $contentChain
     * @return JsonResponse
     * @noinspection PhpUnusedParameterInspection
     */
    public function update(
        UpdateContentChainRequest $request,
        TelegramBot $bot,
        ContentChain $contentChain
    ): JsonResponse {
        $fields = $request->validated();
        if ($request->input('time_from') !== null) {
            $fields = array_merge(
                $fields,
                [
                    'time_from' => $request->input('time_from') !== null ? Carbon::createFromFormat(
                        'H:i:s',
                        $request->input(
                            'time_from'
                        ),
                        'Europe/Moscow'
                    )->utc() : null,
                    'time_to' => $request->input('time_to') !== null ? Carbon::createFromFormat(
                        'H:i:s',
                        $request->input('time_to'),
                        'Europe/Moscow'
                    )->utc() : null
                ]
            );
        }
        $contentChain->update($fields);
        return response()->json($contentChain);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param TelegramBot $bot
     * @param ContentChain $contentChain
     * @return JsonResponse
     * @throws Exception
     * @noinspection PhpUnusedParameterInspection
     */
    public function destroy(TelegramBot $bot, ContentChain $contentChain): JsonResponse
    {
        $contentChain->delete();
        return response()->json("ok");
    }
}
