<?php

namespace App\Services;

use App\Models\Attachment;
use App\Models\Button;
use App\Models\Channel;
use App\Models\Content;
use App\Models\Post;
use App\Models\Sticker;
use App\Models\TelegramBot;
use App\Models\Update;
use GuzzleHttp\Utils;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Telegram\Bot\Api;
use Telegram\Bot\Exceptions\CouldNotUploadInputFile;
use Telegram\Bot\Exceptions\TelegramSDKException;
use Telegram\Bot\FileUpload\InputFile;
use Telegram\Bot\Objects\Message;

class Bot extends Api
{
    public const MAX_TEXT_LENGTH = 4096;
    public const SERVICE_BOT_ID = '1319393317:AAHOF1hf-w3tSN9Md8w5XKmuk5QcCLhvnBY';
    public const DELAY = 3;
    public const MESSAGES_PER_MINUTE = 20;

    private ?TelegramBot $bot;

    public function __construct(string $token, bool $async = false, $httpClientHandler = null)
    {
        parent::__construct($token, $async, $httpClientHandler);
        $this->bot = TelegramBot::whereToken($this->getAccessToken())->first();
    }

    /**
     * @param Model $message
     * @param int|string $to
     * @throws TelegramSDKException
     */
    public function send(Model $message, string|int $to)
    {
        $message->load(['attachments', 'buttons', 'stickers']);

        if ($message instanceof Post) {
            $pm = new PostMacros(
                $message,
                Channel::whereTelegramId($to)->orWhere('channel_id', $to)->with(['managers'])->first()
            );
            $message = $pm->run();
        }

        if ($message->attachments->count() > 0) {
            if ($message->attachments->count() > 1) {
                if ($message->attachments->filter(
                        fn(Attachment $a) => $a->type === 'Photo' || $a->type === 'Video'
                    )->count() > 1) {
                    $this->sendMediaGroup($this->buildMediaGroup($message, $to));
                    $other = $message
                        ->attachments
                        ->filter(
                            fn(Attachment $attachment
                            ) => $attachment->type !== 'Photo' && !$attachment->type === 'Video'
                        )
                        ->pluck('type');
                } else {
                    $other = $message->pluck('type');
                }

                $other->each(fn(string $type) => $this->{"send$type"}($this->buildFile($message, $to, $type)));
            } else {
                $type = $message->attachments->first()->type;
                $this->{"send$type"}($this->buildFile($message, $to, $type));
            }
        } elseif ($message->body !== null) {
            $this->sendMessage($this->buildMessage($message, $to));
        }

        if ($message->stickers !== null) {
            $message->stickers->each(
                fn(Sticker $sticker) => $this->sendSticker(
                    [
                        'chat_id' => $to,
                        'sticker' => $sticker->file_id,
                        'reply_markup' => Utils::jsonEncode(
                            collect(
                                [
                                    'inline_keyboard' =>
                                        [
                                            $message->buttons->map(
                                                fn(Button $button) => \Telegram\Bot\Keyboard\Button::make(
                                                    ['text' => $button->text, 'url' => $button->url]
                                                )
                                            )
                                        ]
                                ]
                            )->toArray()
                        )
                    ]
                )
            );
        }
    }

    /**
     *
     * @param Model|Content|Post $message
     * @param int|string $to
     * @return array
     * @todo: "Waiting for SDK update for fixing this type"
     */
    private function buildMediaGroup(Model $message, $to): array
    {
        $content = collect(
            [
                'chat_id' => $to,
                'parse_mode' => $message->format,
                'media' => $message->attachments
                    ->filter(
                        fn(Attachment $attachment) => $attachment->type === 'Video' || $attachment->type === 'Photo'
                    )
                    ->map(
                        function (Attachment $attachment, int $key) use ($message) {
                            $caption = $attachment->caption ?: $message->body;

                            if ($key > 0 && $attachment->caption === null) {
                                $caption = null;
                            }

                            return [
                                'type' => Str::lower($attachment->type),
                                'media' => $attachment->file_url,
                                'caption' => $caption
                            ];
                        }
                    )->toJson()
            ]
        );

        return $this->withButtons($content, $message)->toArray();
    }

    /**
     * @param Collection $content
     * @param Model|Content|Post $message
     * @return Collection
     */
    private function withButtons(Collection $content, Model $message): Collection
    {
        if ($message->buttons !== null && $message->buttons->count() > 0) {
            $content->put(
                'reply_markup',
                Utils::jsonEncode(
                    collect(
                        [
                            'inline_keyboard' =>
                                [
                                    $message->buttons->map(
                                        fn(Button $button) => \Telegram\Bot\Keyboard\Button::make(
                                            ['text' => $button->text, 'url' => $button->url]
                                        )
                                    )
                                ]
                        ]
                    )->toArray()
                )
            );
        }

        return $content;
    }

    /**
     * @param Model|Content|Post $message
     * @param int|string $to
     * @param string $type
     * @return array
     */
    private function buildFile(Model $message, int|string $to, string $type): array
    {
        $attachment = $message->attachments->first(fn(Attachment $a) => $a->type === $type);
        if ($type === 'Document') {
            $file = $attachment->file_url;
        } else {
            $file = InputFile::create(
                $attachment->file_url
            );
        }

        $content = collect(
            [
                'chat_id' => $to,
                'parse_mode' => $message->format,
                'caption' => $attachment->caption ?: $message->body,
                Str::snake($type) => $file
            ]
        );

        return $this->withButtons($content, $message)->toArray();
    }

    /**
     * @param Content|Post|Update $message
     * @param int|string $to
     * @return array
     */
    private function buildMessage(Content|Post|Update $message, int|string $to): array
    {
        $content = collect(
            [
                'chat_id' => $to,
                'parse_mode' => $message->format,
                'text' => $message->body ?: $message->text
            ]
        );

        return $this->withButtons($content, $message)->toArray();
    }

    /**
     * @param Update $update
     * @param int $to
     * @return Message
     * @throws TelegramSDKException
     */
    public function sendUpdate(Update $update, int $to): Message
    {
        if ($update->attachments->isNotEmpty()) {
            if ($update->attachments->count() > 1) {
                return $this->sendMediaGroup($this->buildMediaGroup($update, $to));
            }

            $type = $update->attachments->first()->type;
            return $this->{"send$type"}($this->buildFile($update, $to, $type));
        }

        if ($update->sticker !== null) {
            return $this->sendSticker(
                [
                    'chat_id' => $to,
                    'sticker' => $update->sticker->file_id
                ]
            );
        }

        return $this->sendMessage($this->buildMessage($update, $to));
    }

    /**
     * @param Update $update
     * @param array $fields
     * @return Update
     * @throws TelegramSDKException
     */
    public function update(Update $update, array $fields): Update
    {
        if (isset($fields['text'])) {
            $message = $this->editMessageText(['message_id' => $update->original_id, 'text' => $fields['text']]);
            $update->update(
                ['text' => $fields['text'], 'edit_date' => Carbon::createFromTimestamp($message->editDate)]
            );
        }
        if (isset($fields['file_id']) || isset($fields['caption'])) {
            /** @var Attachment $attachment */
            $attachment = $update->attachments()->first();
            $attachment->update(
                ['file_id' => $fields['file_id'], 'caption' => $fields['caption'] ?? $attachment->caption]
            );

            if (isset($fields['file_id'])) {
                $message = $this->editMessageMedia(
                    [
                        'message_id' => $update->original_id,
                        'media' => [
                            'type' => Str::snake($fields['type']),
                            'media' => InputFile::create(
                                $attachment->file_url
                            ),
                            'caption' => $fields['caption'] ?? $attachment->caption
                        ]
                    ]
                );
            } else {
                $message = $this->editMessageCaption(
                    [
                        'message_id' => $update->original_id,
                        'caption' => $fields['caption'] ?? $attachment->caption
                    ]
                );
            }

            $update->update(
                ['edit_date' => Carbon::createFromTimestamp($message->editDate), 'user_id' => auth()->user()->id]
            );
        }

        return $update;
    }

    public function getModel(): TelegramBot
    {
        return $this->bot;
    }

    /**
     * @param array $params
     * @param $inputFileField
     *
     * @throws CouldNotUploadInputFile
     */
    protected function validateInputFileField(array $params, $inputFileField): void
    {
        if (!isset($params[$inputFileField])) {
            throw CouldNotUploadInputFile::missingParam($inputFileField);
        }

        // All file-paths, urls, or file resources should be provided by using the InputFile object
        if ((!$params[$inputFileField] instanceof InputFile) && (!is_string(
                    $params[$inputFileField]
                ) && !$this->is_json($params[$inputFileField]))) {
            throw CouldNotUploadInputFile::inputFileParameterShouldBeInputFileEntity($inputFileField);
        }
    }
}
