<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Character;
use App\Models\Language;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Post::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->text(25),
            'body' => $this->faker->text,
            'language_id' => Language::whereCode('en')->first()->id,
            'character_id' => Character::first()->id,
            'category_id' => Category::first()->id
        ];
    }
}
