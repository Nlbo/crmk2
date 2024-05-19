<?php

namespace Tests\Feature;

use App\Models\TelegramBot;
use App\Rules\CheckBotId;
use Mockery;
use Tests\TestCase;

class TelegramBotTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        TelegramBot::factory(5)->create();

        $this->instance(
            CheckBotId::class,
            Mockery::mock(CheckBotId::class)
                ->shouldReceive('passes')
                ->andReturn(true)
                ->getMock()
        );
    }

    public function testGetBots(): void
    {
        $this->actingAs($this->user)
            ->get(
                route(
                    'bots.index',
                    ['paginated' => true]
                )
            )
            ->assertOk()
            ->assertJsonStructure(
                [
                    'data',
                    'links',
                    'total',
                ]
            )
            ->assertJsonCount(
                5,
                'data'
            );
    }

    public function testGetBot(): void
    {
        $this->actingAs($this->user)
            ->getJson(
                route(
                    'bots.show',
                    ['bot' => $this->bot->id]
                )
            )
            ->assertOk()
            ->assertJson(
                [
                    'id' => $this->bot->id,
                    'title' => $this->bot->title,
                    'token' => $this->bot->token,
                ]
            );
    }

    public function testCreateBot(): void
    {
        $bot = TelegramBot::factory()->make();

        $this->actingAs($this->user)
            ->postJson(
                route(
                    'bots.store'
                ),
                [
                    'title' => $bot->title,
                    'token' => $bot->token,
                    'set_webhook' => $bot->set_webhook,
                ]
            )
            ->assertOk()
            ->assertJson(
                [
                    'title' => $bot->title,
                    'token' => $bot->token,
                    'set_webhook' => $bot->set_webhook,
                ]
            );
    }

    public function testUpdateBot(): void
    {
        $bot = TelegramBot::first();
        $newTitle = 'New title';
        $newToken = 'new_token';

        $this->actingAs($this->user)
            ->patchJson(
                route(
                    'bots.update',
                    ['bot' => $bot->id]
                ),
                [
                    'title' => $newTitle,
                    'token' => $newToken,
                ]
            )
            ->assertOk()
            ->assertJson(
                [
                    'title' => $newTitle,
                    'token' => $newToken,
                    'set_webhook' => $bot->set_webhook,
                ]
            );
    }

    public function testDeleteBot(): void
    {
        $bot = TelegramBot::factory()->create();

        $this->actingAs($this->user)
            ->deleteJson(
                route(
                    'bots.destroy',
                    ['bot' => $bot->id]
                )
            )
            ->assertOk();

        $this->assertDatabaseMissing('telegram_bots', ['id' => $bot->id]);
    }
}
