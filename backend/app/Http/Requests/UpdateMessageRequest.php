<?php

namespace App\Http\Requests;

use App\Rules\ValidHtml;
use App\Services\Bot;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'text' => [
                'required_without_all:file_id,caption',
                'string',
                new ValidHtml($this->format),
                function ($attribute, $value, $fail) {
                    if (Str::length(strip_tags($value)) > Bot::MAX_TEXT_LENGTH) {
                        $fail(__('validation.max.string', ['max' => Bot::MAX_TEXT_LENGTH]));
                    }
                }
            ],
            'format' => 'string|in:HTML,MarkdownV2|nullable',
            'file_id' => 'required_without_all::text,caption|uuid',
            'type' => 'required_with:file_id|in:Voice,Photo,Document,Video,VideoNote,Animation,Audio',
            'caption' => ['required_without_all:text,file_id', 'string', new ValidHtml($this->format)]
        ];
    }
}
