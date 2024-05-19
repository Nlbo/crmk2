<?php

namespace Database\Factories;

use App\Models\ContentChain;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ContentChainFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ContentChain::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->title,
            'is_active' => true,
            'time_from' => Carbon::createFromFormat('H:i:s', '10:00:00', 'Europe/Moscow'),
            'time_to' => Carbon::createFromFormat('H:i:s', '18:00:00', 'Europe/Moscow'),
        ];
    }
}
