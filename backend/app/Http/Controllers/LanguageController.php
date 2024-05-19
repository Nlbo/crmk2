<?php

namespace App\Http\Controllers;

use App\Models\Language;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class LanguageController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Language::class, 'language');
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $builder = QueryBuilder::for(Language::class)
            ->orderBy('title')
            ->allowedFilters(['title', 'code'])
            ->allowedSorts('title');


        if ($request->boolean('paginated')) {
            return response()->json($builder->paginate()->appends($request->query()));
        }
        return response()->json($builder->get());
    }

    /**
     * Display the specified resource.
     *
     * @param Language $language
     * @return JsonResponse
     */
    public function show(Language $language): JsonResponse
    {
        return response()->json($language);
    }
}
