<?php

namespace Database\Seeders;

use App\Models\Button;
use App\Models\Category;
use App\Models\Character;
use App\Models\Language;
use App\Models\Post;
use App\Models\Sticker;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $message = Post::create(
            [
                'title' => 'Test message',
                'body' => 'Test Message {bot}',
                'language_id' => Language::whereCode('en')->first()->id,
                'character_id' => Character::first()->id,
                'category_id' => Category::first()->id
            ]
        );
        $message->buttons()->save(Button::factory()->make());

        $voice = Post::create(
            [
                'title' => 'Test voice',
                'body' => 'Test voice {bot}',
                'language_id' => Language::whereCode('en')->first()->id,
                'character_id' => Character::first()->id,
                'category_id' => Category::first()->id
            ]
        );
        $voice->buttons()->save(Button::factory()->make());
        $voice->attachments()->create(['file_id' => 'f8d950bf-f49c-42a3-bf76-9ded3abb1108', 'type' => 'Voice']);

        $photo = Post::create(
            [
                'title' => 'Test photo',
                'body' => 'Test photo {bot}',
                'language_id' => Language::whereCode('en')->first()->id,
                'character_id' => Character::first()->id,
                'category_id' => Category::first()->id
            ]
        );
        $photo->buttons()->save(Button::factory()->make());
        $photo->attachments()->create(['file_id' => '07981a3c-77df-4e06-8544-bfa49e3eb99a', 'type' => 'Photo',]);

        $document = Post::create(
            [
                'title' => 'Test Document',
                'body' => 'Test Document {bot}',
                'language_id' => Language::whereCode('en')->first()->id,
                'character_id' => Character::first()->id,
                'category_id' => Category::first()->id
            ]
        );
        $document->buttons()->save(Button::factory()->make());
        $document->attachments()->create(['file_id' => 'da562ac3-e475-4958-b0a6-9d36b14311c5', 'type' => 'Document']);

        $video = Post::create(
            [
                'title' => 'Test Video',
                'body' => 'Test Video {bot}',
                'language_id' => Language::whereCode('en')->first()->id,
                'character_id' => Character::first()->id,
                'category_id' => Category::first()->id
            ]
        );
        $video->buttons()->save(Button::factory()->make());
        $video->attachments()->create(['file_id' => 'a4aebb1a-abdf-42c1-acc9-c0597fec11da', 'type' => 'Video']);

        $videoNote = Post::create(
            [
                'title' => 'Test VideoNote',
                'body' => 'Test VideoNote {bot}',
                'language_id' => Language::whereCode('en')->first()->id,
                'character_id' => Character::first()->id,
                'category_id' => Category::first()->id
            ]
        );
        $videoNote->buttons()->save(Button::factory()->make());
        $videoNote->attachments()->create(['file_id' => '3ba03e5c-3a1a-4d99-be45-9a1878a2786e', 'type' => 'VideoNote']);

        $animation = Post::create(
            [
                'title' => 'Test Animation',
                'body' => 'Test Animation {bot}',
                'language_id' => Language::whereCode('en')->first()->id,
                'character_id' => Character::first()->id,
                'category_id' => Category::first()->id
            ]
        );
        $animation->buttons()->save(Button::factory()->make());
        $animation->attachments()->create(['file_id' => '871de967-4581-44ee-b0f7-bea8a772bd6c', 'type' => 'Animation']);

        $sticker = Post::create(
            [
                'title' => 'Test Sticker',
                'body' => 'Test Sticker {bot}',
                'language_id' => Language::whereCode('en')->first()->id,
                'character_id' => Character::first()->id,
                'category_id' => Category::first()->id
            ]
        );
        $sticker->stickers()->sync(Sticker::query()->limit(5)->pluck('id'));

        $audio = Post::create(
            [
                'title' => 'Test Audio',
                'body' => 'Test Audio {bot}',
                'language_id' => Language::whereCode('en')->first()->id,
                'character_id' => Character::first()->id,
                'category_id' => Category::first()->id
            ]
        );
        $audio->buttons()->save(Button::factory()->make());
        $audio->attachments()->create(['file_id' => 'c9e78d14-33d4-42b8-a857-150854eaaef7', 'type' => 'Audio']);

        $mediaGroup = Post::create(
            [
                'title' => 'Test MediaGroup',
                'body' => 'Test MediaGroup {bot}',
                'language_id' => Language::whereCode('en')->first()->id,
                'character_id' => Character::first()->id,
                'category_id' => Category::first()->id
            ]
        );
        $mediaGroup->buttons()->save(Button::factory()->make());
        $mediaGroup->attachments()->create(['file_id' => 'a4aebb1a-abdf-42c1-acc9-c0597fec11da', 'type' => 'Video']);
        $mediaGroup->attachments()->create(['file_id' => '07981a3c-77df-4e06-8544-bfa49e3eb99a', 'type' => 'Photo']);
        $mediaGroup->attachments()->create(['file_id' => '3ba03e5c-3a1a-4d99-be45-9a1878a2786e', 'type' => 'Video']);
    }
}
