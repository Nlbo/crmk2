<?php

namespace App\Rules;

use App\Services\Bot;
use Illuminate\Contracts\Validation\Rule;
use Telegram\Bot\Exceptions\TelegramSDKException;

class CheckBotId implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     * @throws TelegramSDKException
     */
    public function passes($attribute, $value)
    {
        $bot = new Bot($value);
        try {
            $bot->getMe();
            return true;
        } catch (TelegramSDKException $e) {
            return false;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return __('rules.invalid_bot_token');
    }
}
