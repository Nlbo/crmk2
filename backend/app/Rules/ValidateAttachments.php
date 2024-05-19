<?php

namespace App\Rules;

use App\Models\File;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Concerns\ValidatesAttributes;

class ValidateAttachments implements Rule
{
    use ValidatesAttributes;

    public const DOCUMENT_MAX_SIZE = 52428800;

    /**
     * @var FormRequest
     */
    private FormRequest $request;

    private string $message = 'Attachments is invalid';

    /**
     * Create a new rule instance.
     *
     * @param FormRequest $request
     */
    public function __construct(FormRequest $request)
    {
        $this->request = $request;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param array $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        foreach ($value as $attachment) {
            if (!isset($attachment['file_id'])) {
                return false;
            }
            switch ($attachment['type']) {
                case 'Photo':
                    $this->message = (string)__('rules.image');

                    $file = File::find($attachment['file_id']);
                    return $file->is_image;
                case 'Video':
                case 'VideoNote':
                    $this->message = (string)__('rules.video');

                    $file = File::find($attachment['file_id']);
                    return in_array(
                        $file->file_type,
                        ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/x-m4v']
                    );
                case 'Voice':
                    $this->message = (string)__('rules.audio');

                    $file = File::find($attachment['file_id']);
                    return in_array($file->file_type, ['audio/ogg', 'audio/webm', 'audio/wav']);
                case 'Animation':
                    $this->message = (string)__('rules.animation');

                    $file = File::find($attachment['file_id']);
                    return in_array($file->file_type, ['image/gif', 'image/webp']);
                case 'Audio':
                    $this->message = (string)__('rules.audio');

                    $file = File::find($attachment['file_id']);
                    return in_array(
                        $file->file_type,
                        [
                            'audio/mpeg',
                            'audio/mp4',
                            'audio/x-aiff',
                            'audio/x-aiff',
                            'audio/ogg',
                            'audio/webm',
                            'audio/wav'
                        ]
                    );
                case 'Document':
                    $this->message = (string)__('rules.size', ['size' => 50]);

                    $file = File::find($attachment['file_id']);
                    return $file->file_size < self::DOCUMENT_MAX_SIZE;
                default:
                    $this->message = (string)__('rules.unknown');
                    return false;
            }
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
        return $this->message;
    }
}
