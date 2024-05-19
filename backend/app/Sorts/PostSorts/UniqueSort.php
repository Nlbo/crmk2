<?php


namespace App\Sorts\PostSorts;


use App\Models\Channel;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class UniqueSort implements Sort
{

    public function __invoke(Builder $query, bool $descending, string $property)
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query->leftJoin('schedule_times as st', 'posts.id', '=', 'st.post_id')
            ->orderBy(
                Channel::query()
                    ->select('only_unique_content')
                    ->whereColumn('channels.id', '=', 'st.channel_id'),
                $direction
            );
    }
}
