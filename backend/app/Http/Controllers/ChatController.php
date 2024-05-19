<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use App\Models\Attachment;
use App\Models\Chat;
use App\Models\Sticker;
use App\Models\TelegramUser;
use App\Models\Update;
use App\Services\Bot;
use App\Services\Updates\UpdateParser;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\QueryBuilder;
use Telegram\Bot\Exceptions\TelegramSDKException;
use Telegram\Bot\Objects\Message;

class ChatController extends Controller
{
    public function getCustomers(Request $request): JsonResponse
    {
        $builder = QueryBuilder::for(TelegramUser::class)
            ->whereHas('chats')
            ->orderByDesc('updated_at')
            ->with('avatar')
            ->allowedFilters(['first_name', 'last_name', 'username'])
            ->allowedSorts('first_name', 'last_name', 'username');

        if ($request->boolean('paginated')) {
            return response()->json($builder->paginate()->appends($request->query()));
        }
        return response()->json($builder->get());
    }

    public function getCustomer(TelegramUser $telegramUser): JsonResponse
    {
        return response()->json($telegramUser->load('avatar'));
    }

    public function getChats(TelegramUser $user): JsonResponse
    {
        return response()->json(
            $user->chats()
                ->orderByDesc('updated_at')
                ->with(
                    'messages',
                    fn(HasMany $q) => $q->with(
                        [
                            'attachments',
                            'messageTo',
                            'messageFrom',
                            'sticker',
                            'user'
                        ]
                    )->limit(1)
                )->paginate()
        );
    }

    public function getMessages(Chat $chat): JsonResponse
    {
        /** @var LengthAwarePaginator $paginator */
        $paginator = $chat->messages()
            ->with(['attachments', 'messageTo', 'messageFrom', 'sticker', 'user'])
            ->paginate(30);

        return response()->json(
            $paginator->through(fn(Update $update) => $update->nl2br())
        );
    }

    /**
     * @param Chat $chat
     * @param Update $update
     * @param UpdateMessageRequest $request
     * @return JsonResponse
     * @throws TelegramSDKException
     * @throws ValidationException
     */
    public function updateMessage(Chat $chat, Update $update, UpdateMessageRequest $request): JsonResponse
    {
        if ($chat->is_blocked) {
            throw ValidationException::withMessages(
                [
                    'chat' => __('rules.chat_is_blocked')
                ]
            );
        }

        $bot = new Bot($chat->manager->token);

        return response()->json(
            $bot->update($update, $request->validated())->nl2br()
        );
    }

    /**
     * @param Chat $chat
     * @param CreateMessageRequest $request
     * @param UpdateParser $parser
     * @return JsonResponse
     * @throws TelegramSDKException
     * @throws ValidationException
     */
    public function createMessage(Chat $chat, CreateMessageRequest $request, UpdateParser $parser): JsonResponse
    {
        if ($chat->is_blocked) {
            throw ValidationException::withMessages(
                [
                    'chat' => __('rules.chat_is_blocked')
                ]
            );
        }

        $bot = new Bot($chat->manager->token);
        $update = new Update(['text' => $request->input('text'), 'format' => $request->input('format')]);
        if ($request->input('sticker_id') !== null) {
            $sticker = Sticker::query()->find($request->input('sticker_id'));
            $update->setRelation('sticker', $sticker);
        }
        if ($request->input('attachments') !== null) {
            foreach ($request->input('attachments') as $attachment) {
                $update->setRelation(
                    'attachments',

                    $update->attachments->push(
                        new Attachment(
                            [
                                'file_id' => $attachment['file_id'],
                                'caption' => $attachment['caption'] ?? '',
                                'type' => $attachment['type']
                            ]
                        )
                    )
                );
            }
        }

        $message = $bot->sendUpdate($update, $chat->original_chat_id);

        if ($request->input('attachments') !== null && count($request->input('attachments')) > 1) {
            $updates = collect($message)->map(fn(Message $message) => $parser->parse($message)->nl2br());
        } else {
            $updates = collect([$parser->parse($message)->nl2br()]);
        }

        return response()->json($updates);
    }
}
