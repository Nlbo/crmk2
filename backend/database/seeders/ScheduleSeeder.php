<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Channel;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Channel::first()->schedule_times()->create(
            [
                'time' => now()->startOfHour(),
                'category_id' => Category::whereTitle('default')->first()->id,
            ]
        );
    }
}
