<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddStickerSet;
use App\Models\StickerSet;
use App\Services\Bot;
use App\Services\StickerImport;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Telegram\Bot\Exceptions\TelegramSDKException;
use Throwable;

class StickerSetController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([]
            //Cache::remember('stickers', now()->addWeek(), fn() => StickerSet::with(['stickers'])->get())
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AddStickerSet $request
     * @param StickerImport $import
     * @return JsonResponse
     * @throws TelegramSDKException
     * @throws Throwable
     */
    public function store(AddStickerSet $request, StickerImport $import): JsonResponse
    {
        $set = StickerSet::whereName($request->input('set_name'))->with(['stickers'])->first();

        if ($set === null) {
            $set = $import->import($request->input('set_name'));
        }

        return response()->json($set);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param StickerSet $stickerSet
     * @return JsonResponse
     * @throws TelegramSDKException
     */
    public function update(StickerSet $stickerSet): JsonResponse
    {
        $bot = new Bot(Bot::SERVICE_BOT_ID);
        $tgSet = $bot->getStickerSet(['name' => $stickerSet->name]);

        $stickerSet->update(
            [
                'name' => $tgSet->name,
                'title' => $tgSet->title,
                'is_animated' => $tgSet->isAnimated,
                'contains_masks' => $tgSet->containsMasks
            ]
        );

        collect($tgSet->stickers)->each(
            fn(array $sticker) => $stickerSet->stickers()->updateOrCreate(
                [
                    'file_unique_id' => $sticker['file_unique_id']
                ],
                [
                    'width' => $sticker['width'],
                    'height' => $sticker['height'],
                    'emoji' => $sticker['emoji'],
                    'set_name' => $sticker['set_name'],
                    'is_animated' => $sticker['is_animated'],
                    'file_id' => $sticker['file_id'],
                    'file_unique_id' => $sticker['file_unique_id'],
                    'file_size' => $sticker['file_size'],
                    'file_path' => $bot->getFile(
                        [
                            'file_id' => $sticker['file_id']
                        ]
                    )['file_path']
                ]
            )
        );
        Cache::forget('stickers');
        return response()->json($stickerSet);
    }
}
