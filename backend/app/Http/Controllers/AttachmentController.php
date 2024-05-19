<?php

namespace App\Http\Controllers;

use App\Models\Attachment;

class AttachmentController extends Controller
{
    public function show(Attachment $attachment)
    {
        return response()->json($attachment->load('file'));
    }
}
