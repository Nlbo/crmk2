<?php


namespace App\Services\Updates;


use App\Events\UpdateReceived;
use App\Models\Attachment;
use App\Models\Chat;
use App\Models\File;
use App\Models\Sticker;
use App\Models\StickerSet;
use App\Models\TelegramBot;
use App\Models\TelegramUser;
use App\Models\Update;
use App\Services\Bot;
use App\Services\StickerImport;
use App\Services\TelegramEntitiesDecoder;
use App\Services\Updates\Message\TelegramMessage;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\ArrayShape;
use Telegram\Bot\Exceptions\TelegramSDKException;
use Telegram\Bot\Objects\Message;
use Telegram\Bot\Objects\MessageEntity;
use Telegram\Bot\Objects\Update as TgUpdate;
use Throwable;

class TelegramUpdateParser implements UpdateParser
{
    private const KICKED_STATUS = 'kicked';


    private Bot $bot;
    private StickerImport $stickerImport;
    private TelegramEntitiesDecoder $entitiesDecoder;


    public function __construct(Bot $bot, StickerImport $stickerImport)
    {
        $this->bot = $bot;
        $this->stickerImport = $stickerImport;
        $this->entitiesDecoder = resolve(TelegramEntitiesDecoder::class);
    }

    /**
     * @param array $params
     * @return ?Update
     * @throws TelegramSDKException
     * @throws Exception
     * @throws Throwable
     */
    public function parse(iterable $params): ?Update
    {
        $update = TgUpdate::make($params);
        if ($update->detectType() === 'message' || $params instanceof Message) {
            $message = $params instanceof Message ? TelegramMessage::make($params->toArray()) : TelegramMessage::make(
                $update->message->toArray()
            );
            $customer = $this->customer($message);
            $chat = $this->chat($customer->id, $this->bot->getModel()->id, $message->chat->id);
            $type = $message->detectType();

            switch ($type) {
                case 'text':
                    $updateModel = $this->createText($message, $update, $customer, $chat);

                    if (!$updateModel->messageFrom->is_bot) {
                        $updateModel->update(['user_id' => optional(auth()->user())->id, 'type' => 'text']);
                    }

                    broadcast(new UpdateReceived($updateModel));
                    return $updateModel->load(['messageFrom', 'messageTo', 'attachments', 'sticker', 'user']);
                case 'sticker':
                    $updateModel = $this->createSticker($message, $update, $customer, $chat);

                    if (!$updateModel->messageFrom->is_bot) {
                        $updateModel->update(['user_id' => optional(auth()->user())->id, 'type' => 'sticker']);
                    }

                    event(new UpdateReceived($updateModel));
                    return $updateModel->load(['messageFrom', 'messageTo', 'attachments', 'sticker', 'user']);
                case 'animation':
                case 'video_note':
                case 'audio':
                case 'document':
                case 'photo':
                case 'video':
                case 'voice':
                    $updateModel = $this->createAttachment($message, $update, $customer, $type, $chat);

                    if (!$updateModel->messageFrom->is_bot) {
                        $updateModel->update(['user_id' => optional(auth()->user())->id, 'type' => 'attachment']);
                    }

                    event(new UpdateReceived($updateModel));
                    return $updateModel->load(['messageFrom', 'messageTo', 'attachments', 'sticker', 'user']);
                default:
                    return null;
            }
        } elseif ($update->detectType() === 'edited_message') {
            $message = TelegramMessage::make($update->editedMessage->toArray());
            $updateModel = Update::whereChatId(
                Chat::whereOriginalChatId($message->chat->id)->first()->id
            )->whereOriginalId($message->messageId)->first();
            $type = $message->detectType();

            switch ($type) {
                case 'text':
                    $text = empty($message->entities) ?
                        $message->text :
                        $this->entitiesDecoder->decode(
                            $message->text,
                            array_map(
                                fn(array $entity) => MessageEntity::make($entity),
                                $message->entities->all()
                            )
                        );

                    $updateModel->update(
                        ['text' => $text, 'edit_date' => Carbon::createFromTimestamp($message->editDate)]
                    );
                    broadcast(new UpdateReceived($updateModel));
                    return $updateModel->load(['messageFrom', 'messageTo', 'attachments', 'sticker', 'user']);
                case 'animation':
                case 'audio':
                case 'document':
                case 'photo':
                case 'video':
                case 'voice':
                    /** @var Attachment $attachment */
                    $attachment = $updateModel->attachments()->first();

                    $caption = $message->captionEntities === null ?
                        $message->caption :
                        $this->entitiesDecoder->decode(
                            $message->caption,
                            array_map(
                                fn(array $entity) => MessageEntity::make($entity),
                                $message->captionEntities->all()
                            )
                        );

                    if ($type === 'photo') {
                        $photo = end($message->toArray()['photo'])['file_id'];

                        $attachment->update(
                            [
                                'file_id' => $this->uploadFile($photo),
                                'caption' => $caption,
                                'type' => 'Photo'
                            ]
                        );
                    } else {
                        $camelType = Str::camel($type);
                        $studlyType = Str::studly($type);

                        $attachment->update(
                            [
                                'file_id' => $this->uploadFile($message->{$camelType}->fileId),
                                'type' => $studlyType,
                                'caption' => $caption
                            ]
                        );
                    }

                    $updateModel->update(['edit_date' => Carbon::createFromTimestamp($message->editDate)]);

                    event(new UpdateReceived($updateModel));
                    return $updateModel->load(['messageFrom', 'messageTo', 'attachments', 'sticker', 'user']);
                default:
                    return null;
            }
        } elseif ($update->isType(
                'my_chat_member'
            ) && $update->my_chat_member->new_chat_member->status === self::KICKED_STATUS) {
            $this->kick($update);
        }

        return null;
    }

    private function customer(TelegramMessage $message): TelegramUser
    {
        if ($message->from->isBot) {
            return TelegramUser::whereUsername($message->chat->username)->first();
        } else {
            return TelegramUser::firstOrCreate(
                ['telegram_user_id' => $message->from->id],
                [
                    'telegram_user_id' => $message->from->id,
                    'is_bot' => $message->from->isBot,
                    'first_name' => $message->from->firstName,
                    'last_name' => $message->from->lastName,
                    'language_code' => $message->from->languageCode,
                    'username' => $message->from->username,
                ]
            );
        }
    }

    private function chat(string $customer_id, string $manager_id, int $chat_id): Chat
    {
        $chat = Chat::whereManagerId($manager_id)->whereCustomerId($customer_id)->first();

        if ($chat === null) {
            $chat = Chat::create(
                [
                    'manager_id' => $manager_id,
                    'customer_id' => $customer_id,
                    'original_chat_id' => $chat_id,
                ]
            );
        }

        return $chat;
    }

    /**
     * @param TelegramMessage $message
     * @param TgUpdate $update
     * @param TelegramUser $customer
     * @param Chat $chat
     * @return Update|Model
     */
    private function createText(
        TelegramMessage $message,
        TgUpdate $update,
        TelegramUser $customer,
        Chat $chat
    ): Update|Model {
        $text = $message->entities === null ?
            $message->text :
            $this->entitiesDecoder->decode(
                $message->text,
                array_map(
                    fn(array $entity) => MessageEntity::make($entity),
                    $message->entities->all()
                )
            );
        return $chat->messages()->create(
            array_merge(
                [
                    "original_id" => $message->messageId,
                    "text" => $text,
                    "original" => $update->toArray(),
                    "date" => Carbon::createFromTimestamp($message->date)
                ],
                $this->resolveRoles($message, $customer, $this->bot->getModel())
            )
        );
    }

    #[ArrayShape(["from_id" => "string", "from_type" => "string", "to_id" => "string", "to_type" => "string"])]
    private function resolveRoles(
        TelegramMessage $message,
        TelegramUser $user,
        TelegramBot $bot
    ): array {
        if (!$message->from->isBot) {
            $from = $bot;
            $to = $user;
        } else {
            $from = $user;
            $to = $bot;
        }

        return [
            "from_id" => $from->id,
            "from_type" => get_class($from),
            "to_id" => $to->id,
            "to_type" => get_class($to),
        ];
    }

    /**
     * @param TelegramMessage $message
     * @param TgUpdate $update
     * @param TelegramUser $customer
     * @param Chat $chat
     * @return Update
     * @throws TelegramSDKException
     * @throws Throwable
     */
    private function createSticker(
        TelegramMessage $message,
        TgUpdate $update,
        TelegramUser $customer,
        Chat $chat
    ): Update {
        $tgSticker = $message->sticker;
        $set = StickerSet::query()
            ->whereName($tgSticker->setName)
            ->orWhereHas(
                'stickers',
                fn(Builder $q) => $q->where('file_unique_id', $tgSticker->fileUniqueId)
            )
            ->first();

        /** @var Update $update */
        $update = $chat->messages()->firstOrCreate(
            array_merge(
                [
                    "original_id" => $message->messageId,
                    "date" => Carbon::createFromTimestamp($message->date),
                ],
                $this->resolveRoles($message, $customer, $this->bot->getModel())
            ),
            [
                "original" => $update->toArray(),
            ]
        );


        if ($set === null) {
            $this->stickerImport->import($tgSticker->setName, false, $update, $tgSticker->fileUniqueId);
        } else {
            /** @var Sticker $sticker */
            $sticker = $set->stickers()->where('file_unique_id', $tgSticker->fileUniqueId)->first();
            $update->update(['sticker_id' => $sticker->id]);
        }

        return $update;
    }

    /**
     * @param TelegramMessage $message
     * @param TgUpdate $update
     * @param TelegramUser $customer
     * @param string $type
     * @param Chat $chat
     * @return Update
     * @throws TelegramSDKException
     */
    private function createAttachment(
        TelegramMessage $message,
        TgUpdate $update,
        TelegramUser $customer,
        string $type,
        Chat $chat
    ): Update {
        /** @var Update $updateModel */
        $updateModel = $chat->messages()->create(
            array_merge(
                [
                    "original_id" => $message->messageId,
                    "original" => $update->toArray(),
                    "date" => Carbon::createFromTimestamp($message->date),
                    'media_group_id' => $message->mediaGroupId
                ],
                $this->resolveRoles($message, $customer, $this->bot->getModel())
            )
        );

        $caption = empty($message->captionEntities) ?
            $message->caption :
            $this->entitiesDecoder->decode(
                $message->caption,
                array_map(
                    fn(array $entity) => MessageEntity::make($entity),
                    $message->captionEntities->all()
                )
            );

        if ($type === 'photo') {
            $photo = end($message->toArray()['photo'])['file_id'];
            $updateModel->attachments()->create(
                [
                    'file_id' => $this->uploadFile($photo),
                    'type' => 'Photo',
                    'caption' => $caption
                ]
            );
        } else {
            $camelType = Str::camel($type);
            $studlyType = Str::studly($type);

            $updateModel->attachments()->create(
                [
                    'file_id' => $this->uploadFile($message->{$camelType}->fileId),
                    'type' => $studlyType,
                    'caption' => $caption
                ]
            );
        }

        return $updateModel;
    }

    /**
     * @param string $file_id
     * @return string
     * @throws TelegramSDKException
     */
    private function uploadFile(string $file_id): string
    {
        $tFile = $this->bot->getFile(['file_id' => $file_id]);

        $path = Storage::putFile(
            'attachments',
            "https://api.telegram.org/file/bot{$this->bot->getAccessToken()}/$tFile->filePath"
        );

        $file = File::create([
            'name' => $tFile->fileId,
            'path' => $path,
        ]);

        return $file->id;
    }

    private function kick(TgUpdate $update)
    {
        $user = TelegramUser::whereUsername($update->my_chat_member->chat->username)->first();
        $user->chats()->where('manager_id', $this->bot->getModel()->id)->update(['is_blocked' => true]);
        $user->messageHistory()->whereHas(
            'contentChain.telegramBot',
            fn(Builder $q) => $q->where('id', $this->bot->getModel()->id)
        )->delete();
    }
}
