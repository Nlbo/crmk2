<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $countries = collect(
            json_decode(
                file_get_contents(
                    resource_path('seeds/countries.json')
                ),
                true
            )
        )->map(
            fn(array $country) => [
                'id' => Str::uuid()->toString(),
                'title' => $country['name'],
                'code' => $country['iso_3166_2']
            ]
        )->toArray();

        Country::insert($countries);
    }
}
