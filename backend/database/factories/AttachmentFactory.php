<?php

namespace Database\Factories;

use App\Models\Attachment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AttachmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Attachment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $a = Attachment::first();
        if (!is_null($a)) {
            $fileName = $a->file_path;
        } else {
            $fileName = 'attachments/' . Str::random() . '.jpg';
            Storage::put(
                $fileName,
                file_get_contents('https://cdn.eso.org/images/screen/eso1907a.jpg'),
                ['visibility' => 'public']
            );
        }
        return [
            'file_path' => $fileName
        ];
    }
}
