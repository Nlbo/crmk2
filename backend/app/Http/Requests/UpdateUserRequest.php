<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'name' => 'string',
            'language' => 'string|in:en,ru',
            'roles' => 'array',
            'roles.*' => 'numeric|exists:roles,id',
            'permissions' => 'array',
            'permissions.*' => 'numeric|exists:permissions,id',
            'password' => 'string|min:8'
        ];
    }
}
