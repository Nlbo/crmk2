<?php


namespace App\Filters\PostFilters;


use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class RelationTitleFilter implements Filter
{

    public function __invoke(Builder $query, $value, string|array $property)
    {
        $query->whereHas(
            $property,
            function (Builder $q) use ($value) {
                if (is_array($value)) {
                    $values = collect($value);
                    $q->where('title', 'like', "%{$values->pull(0)}%");
                    $values->each(fn(string $v) => $q->orWhere('title', 'like', "%$v%"));
                } else {
                    $q->where('title', 'like', "%$value%");
                }
            }
        );
    }
}
