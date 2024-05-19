<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EditScheduleTimeRequest extends FormRequest
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
            'time' => 'date_format:Y-m-d H:i',
            'category_id' => 'uuid|exists:categories,id'
        ];
    }
}
