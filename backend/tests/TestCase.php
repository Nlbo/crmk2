<?php

namespace Tests;

use App\Models\TelegramBot;
use App\Models\User;
use App\Services\Bot;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\TelegramBotSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    use RefreshDatabase;

    protected User $user;
    protected TelegramBot $bot;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('migrate:fresh');

        $this->seed(
            [
                UserSeeder::class,
                PermissionSeeder::class,
                TelegramBotSeeder::class,
            ]
        );

        $this->user = User::whereEmail('admin@crmk.online')->first();
        $this->bot = TelegramBot::whereToken(Bot::SERVICE_BOT_ID)->first();
    }
}
