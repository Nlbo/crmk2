<?php

namespace App\Http\Requests;

use Carbon\CarbonInterval;
use Illuminate\Foundation\Http\FormRequest;
use JetBrains\PhpStorm\ArrayShape;
use Throwable;

class UpdateContentChainRequest extends FormRequest
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
    #[ArrayShape([
        "title" => "string",
        "is_active" => "string",
        "telegram_bot_id" => "string",
        "send_interval" => "array",
        "time_from" => "array",
        "time_to" => "array"
    ])]
    public function rules(): array
    {
        return [
            "title" => "string|min:2|max:255",
            "is_active" => "boolean",
            "telegram_bot_id" => "uuid|exists:telegram_bots,id",
            "send_interval" => [
                "string",
                function ($attribute, $value, $fail) {
                    try {
                        $i = CarbonInterval::fromString($value);

                        if ($i->seconds > 0) {
                            $fail($attribute . ' is invalid.');
                        }
                    } catch (Throwable) {
                        $fail($attribute . ' is invalid.');
                    }
                }
            ],

            "time_from" => [
                "required_with:time_to",
                "date_format:H:i:s",
                "nullable",
                function ($attribute, $value, $fail) {
                    if ($value >= $this->input('time_to') && $this->input('time_to') !== '00:00:00') {
                        $fail($attribute . ' is invalid.');
                    }
                }
            ],
            "time_to" => [
                "required_with:time_from",
                "date_format:H:i:s",
                "nullable",
                function ($attribute, $value, $fail) {
                    if ($value <= $this->input('time_from') && $value !== '00:00:00') {
                        $fail($attribute . ' is invalid.');
                    }
                }
            ]
        ];
    }
}
