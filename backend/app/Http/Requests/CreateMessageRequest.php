<?php

namespace App\Http\Requests;

use App\Rules\ValidateAttachments;
use App\Rules\ValidHtml;
use App\Services\Bot;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\ArrayShape;
use JetBrains\PhpStorm\Pure;

class CreateMessageRequest extends FormRequest
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
    #[Pure]
    #[ArrayShape([
        "text" => "array",
        'sticker_id' => "string",
        'format' => "string",
        "attachments" => "array",
        "attachments.*.file_id" => "string",
        "attachments.*.type" => "string",
        "attachments.*.caption" => "string"
    ])]
    public function rules(): array
    {
        return [
            "text" => [
                "required_without_all:sticker_id,attachments",
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
            'sticker_id' => 'required_without_all:text,attachments|uuid|exists:stickers,id',
            'format' => 'string|in:HTML,MarkdownV2|nullable',
            "attachments" => ['required_without_all:text,sticker_id', 'array', new ValidateAttachments($this)],
            "attachments.*.file_id" => "required|uuid",
            "attachments.*.type" => "required|string|in:Voice,Photo,Document,Video,VideoNote,Animation,Audio",
            "attachments.*.caption" => "string|min:2|max:1000|nullable",
        ];
    }
}
