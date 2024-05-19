<?php


namespace App\Services\Updates;


use App\Models\Update;

interface UpdateParser
{
    public function parse(iterable $params): ?Update;
}
