<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCharacterRequest;
use App\Http\Requests\UpdateCharacterRequest;
use App\Models\Character;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class CharacterController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Character::class, 'character');
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $builder = QueryBuilder::for(Character::class)
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
     * @param CreateCharacterRequest $request
     * @return JsonResponse
     */
    public function store(CreateCharacterRequest $request): JsonResponse
    {
        return response()->json(Character::create($request->validated()));
    }

    /**
     * Display the specified resource.
     *
     * @param Character $character
     * @return JsonResponse
     */
    public function show(Character $character): JsonResponse
    {
        return response()->json($character);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateCharacterRequest $request
     * @param Character $character
     * @return JsonResponse
     */
    public function update(UpdateCharacterRequest $request, Character $character): JsonResponse
    {
        $character->update($request->validated());

        return response()->json($character);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Character $character
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Character $character): JsonResponse
    {
        $character->delete();

        return response()->json('OK');
    }
}
