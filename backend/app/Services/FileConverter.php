<?php

namespace App\Services;

use App\Models\File;
use FFMpeg\Coordinate\Dimension;
use FFMpeg\Format\Video;
use FFMpeg\Format\Audio;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class FileConverter
{
    public function convert(File $file, string $format): void
    {



        $this->{"convert$format"}($file->path);
    }

    private function convertVideoNote(string $filePath): void
    {
        $file = FFMpeg::open($filePath);

        $file->filters()->resize(new Dimension(512, 512))
            ->export()
            ->inFormat(new Video\X264())
            ->save($filePath);
    }
}
