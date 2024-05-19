<?php

namespace App\Http\Requests;

use App\Rules\CheckBotId;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTelegramBotRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "title" => "string|min:2|max:255",
            "token" => ['string', new CheckBotId()],
            'set_webhook' => 'boolean'
        ];
    }
}
