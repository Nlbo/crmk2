<?php

namespace Tests\Feature;

use App\Models\ContentChain;
use Tests\TestCase;

class ContentChainTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->bot->contentChains()->saveMany(
            ContentChain::factory(5)->make()
        );
    }

    public function testGetContentChains()
    {
        $this->actingAs($this->user)
            ->getJson(
                route(
                    'chains.index',
                    [
                        'bot' => $this->bot->id,
                        'paginated' => true,
                    ]
                )
            )
            ->assertOk()
            ->assertJsonCount(5, 'data');
    }

    public function testGetContentChain()
    {
        $this->actingAs($this->user)
            ->getJson(
                route(
                    'chains.show',
                    [
                        'bot' => $this->bot->id,
                        'chain' => $this->bot->contentChains->first()->id,
                    ]
                )
            )
            ->assertOk()
            ->assertJson(
                [
                    'id' => $this->bot->contentChains->first()->id,
                    'title' => $this->bot->contentChains->first()->title,
                    'is_active' => $this->bot->contentChains->first()->is_active,
                    'time_from' => $this->bot->contentChains->first()->time_from
                        ->setTimezone('Europe/Moscow')
                        ->format('c'),
                    'time_to' => $this->bot->contentChains->first()->time_to
                        ->setTimezone('Europe/Moscow')
                        ->format('c'),
                ]
            );
    }

    public function testCreateContentChain()
    {
        $chain = ContentChain::factory()->make(
            [
                'telegram_bot_id' => $this->bot->id
            ]
        );

        $this->actingAs($this->user)
            ->postJson(
                route(
                    'chains.store',
                    [
                        'bot' => $this->bot->id,
                    ]
                ),
                [
                    'title' => $chain->title,
                    'is_active' => $chain->is_active,
                    'time_from' => $chain->time_from->format('H:i:s'),
                    'time_to' => $chain->time_to->format('H:i:s'),
                    'send_interval' => $chain->send_interval
                        ->locale('en')
                        ->forHumans(['short' => true]),
                ]
            )
            ->assertOk()
            ->assertJson(
                [
                    'title' => $chain->title,
                    'is_active' => $chain->is_active,
                    'time_from' => $chain->time_from
                        ->setTimezone('Europe/Moscow')
                        ->format('c'),
                    'time_to' => $chain->time_to
                        ->setTimezone('Europe/Moscow')
                        ->format('c'),
                    'send_interval' => $chain->send_interval
                        ->locale('en')
                        ->forHumans(['short' => true]),
                ]
            );
    }

    public function testUpdateContentChain()
    {
        $chain = $this->bot->contentChains->first();

        $this->actingAs($this->user)
            ->patchJson(
                route(
                    'chains.update',
                    [
                        'bot' => $this->bot->id,
                        'chain' => $chain->id,
                    ]
                ),
                [
                    'title' => $chain->title . '_updated',
                    'is_active' => !$chain->is_active,
                    'time_from' => $chain->time_from->format('H:i:s'),
                    'time_to' => $chain->time_to->format('H:i:s'),
                    'send_interval' => $chain->send_interval
                        ->locale('en')
                        ->forHumans(['short' => true]),
                ]
            )
            ->assertOk()
            ->assertJson(
                [
                    'title' => $chain->title . '_updated',
                    'is_active' => !$chain->is_active,
                    'time_from' => $chain->time_from
                        ->setTimezone('Europe/Moscow')
                        ->format('c'),
                    'time_to' => $chain->time_to
                        ->setTimezone('Europe/Moscow')
                        ->format('c'),
                    'send_interval' => $chain->send_interval
                        ->locale('en')
                        ->forHumans(['short' => true]),
                ]
            );
    }

    public function testDeleteContentChain()
    {
        $chain = $this->bot->contentChains->first();

        $this->actingAs($this->user)
            ->deleteJson(
                route(
                    'chains.destroy',
                    [
                        'bot' => $this->bot->id,
                        'chain' => $chain->id,
                    ]
                )
            )
            ->assertOk();

        $this->assertDatabaseMissing(
            'content_chains',
            [
                'id' => $chain->id,
            ]
        );
    }
}
