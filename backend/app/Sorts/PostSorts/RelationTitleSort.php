<?php


namespace App\Sorts\PostSorts;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use ReflectionClass;
use Spatie\QueryBuilder\Sorts\Sort;

class RelationTitleSort implements Sort
{

    public function __invoke(Builder $query, bool $descending, string $property)
    {
        $direction = $descending ? 'DESC' : 'ASC';

        /** @var Model $sortModel */
        $sortModel = new $property();
        $col = Str::snake((new ReflectionClass($sortModel))->getShortName());

        $query->orderBy(
            $sortModel->newModelQuery()->select('title')
                ->whereColumn('id', "posts.{$col}_id"),
            $direction
        );
    }
}
