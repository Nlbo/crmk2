<?php

namespace App\Rules;

use App\Services\Bot;
use Illuminate\Contracts\Validation\Rule;
use Telegram\Bot\Exceptions\TelegramResponseException;
use Telegram\Bot\Exceptions\TelegramSDKException;

class CheckStickerSetName implements Rule
{
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
        $bot = new Bot(Bot::SERVICE_BOT_ID);
        try {
            $bot->getStickerSet($value);
            return true;
        } catch (TelegramResponseException $exception) {
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
        return __('rules.invalid_set_name');
    }
}
