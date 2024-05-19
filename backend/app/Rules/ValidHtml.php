<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ValidHtml implements Rule
{
    public const ALLOWED_TAGS = ['b', 'i', 'strong', 'em', 'u', 'ins', 's', 'strike', 'del', 'a', 'code', 'pre'];
    private ?string $format;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(?string $format)
    {
        $this->format = $format;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        if ($this->format === 'HTML') {
            return $value === strip_tags($value, self::ALLOWED_TAGS);
        }
        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return __('rules.invalid_html');
    }
}
