<?php

namespace App\Http\Requests;

use App\Rules\ValidLangCode;
use Illuminate\Foundation\Http\FormRequest;

class CreateLanguageRequest extends FormRequest
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
            'title' => 'required|string|min:2|max:255',
            'code' => ['required', 'string', 'min:2', 'max:2', new ValidLangCode(), 'unique:languages,code']
        ];
    }
}
