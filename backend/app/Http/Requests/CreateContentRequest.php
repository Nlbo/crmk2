<?php

namespace App\Http\Requests;

use App\Rules\ValidateAttachments;
use App\Rules\ValidHtml;
use App\Services\Bot;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class CreateContentRequest extends FormRequest
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
            "body" => [
                "required_without_all:stickers,attachments",
                "string",
                "min:2",
                "nullable",
                new ValidHtml($this->format),
                function ($attribute, $value, $fail) {
                    if (Str::length(strip_tags($value)) > Bot::MAX_TEXT_LENGTH) {
                        $fail(__('validation.max.string', ['max' => Bot::MAX_TEXT_LENGTH]));
                    }
                }
            ],
            "format" => 'string|in:HTML,MarkdownV2|nullable',
            'stickers' => 'required_without_all:body,attachments|array',
            'stickers.*' => 'required|uuid|exists:stickers,id',
            "buttons" => "array",
            "buttons.*.text" => "required|string|min:2|max:255",
            "buttons.*.url" => "required|string|url",
            "attachments" => ['required_without_all:stickers,body', 'array', new ValidateAttachments($this)],
            "attachments.*.file_id" => "required|uuid",
            "attachments.*.type" => "required|string|in:Voice,Photo,Document,Video,VideoNote,Animation,Audio",
        ];
    }
}
