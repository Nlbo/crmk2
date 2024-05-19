<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFileRequest;
use App\Models\File;
use FFMpeg\Coordinate\Dimension;
use FFMpeg\FFMpeg;
use FFMpeg\Filters\Video\ResizeFilter;
use Illuminate\Http\JsonResponse;

class FileController extends Controller
{
    /**
     * Store a newly created file in storage.
     *
     * @param StoreFileRequest $request
     * @return JsonResponse
     */
    public function store(StoreFileRequest $request): JsonResponse
    {
        $filePath = $request->file('file')->store('files');

        if ($request->type === 'VideoNote') {
            $file = \ProtoneMedia\LaravelFFMpeg\Support\FFMpeg::open($filePath);

            $file->resize(512, 512)
                ->export()
                ->inFormat(new \FFMpeg\Format\Video\X264())
                ->save($filePath);
        }

        return response()->json(
            [
                'data' => File::create(
                    [
                        'name' => $request->file('file')->getClientOriginalName(),
                        'path' => $filePath,
                    ]
                ),
            ]
        );
    }
}
