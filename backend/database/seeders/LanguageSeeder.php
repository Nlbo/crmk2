<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $languages = collect(
            json_decode(
                file_get_contents(
                    resource_path('seeds/languages.json')
                ),
                true
            )
        )->map(
            fn(array $lang) => [
                'id' => Str::uuid()->toString(),
                'title' => "{$lang['name']} ({$lang['native']})",
                'code' => $lang['code']
            ]
        )->toArray();

        Language::insert($languages);
    }
}
