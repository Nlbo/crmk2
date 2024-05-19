<?php

namespace App\Http\Controllers;


use App\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class PermissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $builder = QueryBuilder::for(Permission::class)
            ->allowedFilters(['name'])
            ->allowedSorts('name');


        if ($request->boolean('paginated')) {
            return response()->json($builder->paginate()->appends($request->query()));
        }
        return response()->json($builder->get());
    }
}
