<?php

namespace App\Http\Requests;

use App\Rules\CheckBotId;
use Illuminate\Foundation\Http\FormRequest;

class CreateTelegramBotRequest extends FormRequest
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
            "title" => "required|string|min:2|max:255",
            "token" => ['required', 'string', new CheckBotId()],
            'set_webhook' => 'required|boolean'
        ];
    }
}
