<?php

namespace Database\Seeders;

use App\Models\Button;
use App\Models\Content;
use App\Models\ContentChain;
use App\Models\Sticker;
use App\Models\TelegramBot;
use Illuminate\Database\Seeder;

class ContentChainSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TelegramBot::all()->each(
            function (TelegramBot $bot) {
                /** @var ContentChain $chain */
                $chain = $bot->contentChain()->save(ContentChain::factory()->make());
                foreach ([0] as $offset) {
                    $this->generatePosts($chain, $offset);
                }
            }
        );
    }

    private function generatePosts(ContentChain $chain, int $offset): void
    {
        $message = Content::create(
            [
                'title' => 'Test message',
                'body' => 'Test Message',
                'order' => 1 + $offset,
                'content_chain_id' => $chain->id
            ]
        );
        $message->buttons()->save(Button::factory()->make());

        $voice = Content::create(
            [
                'title' => 'Test voice',
                'body' => 'Test voice',
                'order' => 2 + $offset,
                'content_chain_id' => $chain->id
            ]
        );
        $voice->buttons()->save(Button::factory()->make());
        $voice->attachments()->create(['file_id' => 'f8d950bf-f49c-42a3-bf76-9ded3abb1108', 'type' => 'Voice']);

        $photo = Content::create(
            [
                'title' => 'Test photo',
                'body' => 'Test photo',
                'order' => 3 + $offset,
                'content_chain_id' => $chain->id,
            ]
        );
        $photo->buttons()->save(Button::factory()->make());
        $photo->attachments()->create(['file_id' => '07981a3c-77df-4e06-8544-bfa49e3eb99a', 'type' => 'Photo',]);

        $document = Content::create(
            [
                'title' => 'Test Document',
                'body' => 'Test Document',
                'order' => 4 + $offset,
                'content_chain_id' => $chain->id
            ]
        );
        $document->buttons()->save(Button::factory()->make());
        $document->attachments()->create(['file_id' => 'da562ac3-e475-4958-b0a6-9d36b14311c5', 'type' => 'Document']);

        $video = Content::create(
            [
                'title' => 'Test Video',
                'body' => 'Test Video',
                'order' => 5 + $offset,
                'content_chain_id' => $chain->id
            ]
        );
        $video->buttons()->save(Button::factory()->make());
        $video->attachments()->create(['file_id' => 'a4aebb1a-abdf-42c1-acc9-c0597fec11da', 'type' => 'Video']);

        $videoNote = Content::create(
            [
                'title' => 'Test VideoNote',
                'body' => 'Test VideoNote',
                'order' => 6 + $offset,
                'content_chain_id' => $chain->id,
            ]
        );
        $videoNote->buttons()->save(Button::factory()->make());
        $videoNote->attachments()->create(['file_id' => '3ba03e5c-3a1a-4d99-be45-9a1878a2786e', 'type' => 'VideoNote']);

        $animation = Content::create(
            [
                'title' => 'Test Animation',
                'body' => 'Test Animation',
                'order' => 7 + $offset,
                'content_chain_id' => $chain->id
            ]
        );
        $animation->buttons()->save(Button::factory()->make());
        $animation->attachments()->create(['file_id' => '871de967-4581-44ee-b0f7-bea8a772bd6c', 'type' => 'Animation']);

        $sticker = Content::create(
            [
                'title' => 'Test Sticker',
                'body' => 'Test Sticker',
                'order' => 8 + $offset,
                'content_chain_id' => $chain->id,
            ]
        );
        $sticker->stickers()->sync(Sticker::query()->limit(5)->pluck('id'));

        $audio = Content::create(
            [
                'title' => 'Test Audio',
                'body' => 'Test Audio',
                'order' => 9 + $offset,
                'content_chain_id' => $chain->id
            ]
        );
        $audio->buttons()->save(Button::factory()->make());
        $audio->attachments()->create(['file_id' => 'c9e78d14-33d4-42b8-a857-150854eaaef7', 'type' => 'Audio']);

        $mediaGroup = Content::create(
            [
                'title' => 'Test MediaGroup',
                'body' => 'Test MediaGroup',
                'order' => 10 + $offset,
                'content_chain_id' => $chain->id
            ]
        );
        $mediaGroup->buttons()->save(Button::factory()->make());
        $mediaGroup->attachments()->create(['file_id' => 'a4aebb1a-abdf-42c1-acc9-c0597fec11da', 'type' => 'Video']);
        $mediaGroup->attachments()->create(['file_id' => '07981a3c-77df-4e06-8544-bfa49e3eb99a', 'type' => 'Photo']);
        $mediaGroup->attachments()->create(['file_id' => '3ba03e5c-3a1a-4d99-be45-9a1878a2786e', 'type' => 'Video']);
    }
}
