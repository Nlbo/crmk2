<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::query()->create(
            [
                'name' => 'Admin',
                'email' => 'admin@crmk.online',
                'password' => Hash::make('secretcrmk')
            ]
        );
    }
}
