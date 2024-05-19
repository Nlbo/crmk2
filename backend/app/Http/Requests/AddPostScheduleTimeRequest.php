<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use JetBrains\PhpStorm\ArrayShape;

class AddPostScheduleTimeRequest extends FormRequest
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
    #[ArrayShape(['time' => "string", 'channels' => "string", 'channels.*' => "string[]"])]
    public function rules(): array
    {
        return [
            'time' => 'required|date_format:Y-m-d H:i',
            'channels' => 'required|array',
            'channels.*' => 'required|uuid|exists:channels,id'
        ];
    }
}
