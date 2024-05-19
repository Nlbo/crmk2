<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class CountryController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Country::class, 'country');
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $builder = QueryBuilder::for(Country::class)
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
     * @param Country $country
     * @return JsonResponse
     */
    public function show(Country $country): JsonResponse
    {
        return response()->json($country);
    }
}
