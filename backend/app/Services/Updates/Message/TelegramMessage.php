<?php


namespace App\Services\Updates\Message;


use Exception;
use Illuminate\Support\Collection;
use Telegram\Bot\Objects\Message;
use Telegram\Bot\Objects\MessageEntity;

/**
 * Class TelegramMessage
 * @package App\Services\Updates\Message
 * @property MessageEntity[]|Collection $entities               (Optional). For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text.
 * @property MessageEntity[]|Collection $captionEntities        (Optional). For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption.
 */
class TelegramMessage extends Message
{

    /**
     * Detect type based on properties.
     *
     * @return string
     * @throws Exception
     */
    public function detectType(): string
    {
        $types = [
            'animation',
            'video_note',
            'text',
            'audio',
            'document',
            'game',
            'photo',
            'sticker',
            'video',
            'voice',
            'contact',
            'location',
            'venue',
            'poll',
            'new_chat_member',
            'left_chat_member',
            'new_chat_title',
            'new_chat_photo',
            'delete_chat_photo',
            'group_chat_created',
            'supergroup_chat_created',
            'channel_chat_created',
            'migrate_to_chat_id',
            'migrate_from_chat_id',
            'pinned_message',
        ];

        $type = $this->keys()
            ->intersect($types)
            ->pop();

        if ($type === null) {
            throw new Exception('Unknown message type');
        }

        return $type;
    }
}
