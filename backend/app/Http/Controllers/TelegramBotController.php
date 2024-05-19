<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTelegramBotRequest;
use App\Http\Requests\UpdateTelegramBotRequest;
use App\Models\TelegramBot;
use App\Services\Bot;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class TelegramBotController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(TelegramBot::class, 'bot');
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $builder = QueryBuilder::for(TelegramBot::class)
            ->where('token', '!=', Bot::SERVICE_BOT_ID)
            ->allowedFilters(['title'])
            ->allowedSorts('title');


        if ($request->boolean('paginated')) {
            return response()->json($builder->paginate()->appends($request->query()));
        }
        return response()->json($builder->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CreateTelegramBotRequest $request
     * @return JsonResponse
     */
    public function store(CreateTelegramBotRequest $request): JsonResponse
    {
        return response()->json(TelegramBot::create($request->validated()));
    }

    /**
     * Display the specified resource.
     *
     * @param TelegramBot $telegramBot
     * @return JsonResponse
     */
    public function show(TelegramBot $telegramBot): JsonResponse
    {
        return response()->json($telegramBot);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateTelegramBotRequest $request
     * @param TelegramBot $telegramBot
     * @return JsonResponse
     */
    public function update(UpdateTelegramBotRequest $request, TelegramBot $telegramBot): JsonResponse
    {
        $telegramBot->update($request->validated());
        return response()->json($telegramBot);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param TelegramBot $telegramBot
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(TelegramBot $telegramBot): JsonResponse
    {
        $telegramBot->delete();
        return response()->json("ok");
    }
}
