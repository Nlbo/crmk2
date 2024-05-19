<?php

namespace App\Http\Requests;

use App\Models\Channel;
use App\Models\TelegramBot;
use App\Services\Bot;
use Illuminate\Foundation\Http\FormRequest;
use Throwable;

class CreateChannelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'telegram_id' => 'required|string|starts_with:@',
            'title' => 'required|string|min:2|max:255',
            'language_id' => 'required|uuid|exists:languages,id',
            'external_link' => 'string|url|nullable',
            'direct_link' => 'string|url|nullable',
            'characters' => 'array',
            'characters.*' => 'uuid|exists:characters,id',
            'subjects' => 'array',
            'subjects.*' => 'uuid|exists:subjects,id',
            'countries' => 'array',
            'countries.*' => 'uuid|exists:countries,id',
            'non_schedule_categories' => 'array',
            'non_schedule_categories.*' => 'uuid|exists:categories,id',
            'managers' => 'required|array',
            'managers.*' => 'required|uuid|exists:telegram_bots,id',
            'posters' => 'required|array',
            'posters.*' => [
                'required',
                'uuid',
                'exists:telegram_bots,id',
                function ($attribute, $value, $fail) {
                    try {
                        $dbBot = TelegramBot::query()->find($value);
                        $bot = new Bot($dbBot->token);

                        $channel_id = $this->input('telegram_id');
                        $channel = Channel::query()->where('telegram_id', $channel_id)->first();
                        $id = $channel?->channel_id ?: $channel_id;

                        $member = $bot->getChatMember(
                            ['user_id' => $bot->getAccessToken(), 'chat_id' => $id]
                        );

                        if ($member->status !== 'administrator') {
                            $fail(__('rules.member'));
                        }
                    } catch (Throwable $exception) {
                        $fail($exception->getMessage());
                    }
                }
            ],
        ];
    }
}
