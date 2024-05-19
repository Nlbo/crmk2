<?php


namespace App\Filters\PostFilters;


use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class UniqueFilter implements Filter
{

    public function __invoke(Builder $query, $value, string $property)
    {
        if (!is_array($value)) {
            $method = $value ? 'whereHas' : 'whereDoesntHave';

            $query->{$method}(
                'schedule_times',
                fn(Builder $sq) => $sq->whereHas(
                    'channel',
                    fn(Builder $cq) => $cq->where(
                        'only_unique_content',
                        true
                    )
                )
            );
        }
    }
}
