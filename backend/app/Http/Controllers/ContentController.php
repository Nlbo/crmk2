<?php

namespace App\Http\Controllers;

use App\Events\ShouldReinitializeChain;
use App\Http\Requests\CreateContentRequest;
use App\Http\Requests\ReorderRequest;
use App\Http\Requests\UpdateContentRequest;
use App\Models\Content;
use App\Models\ContentChain;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class ContentController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Content::class, 'content');
    }

    /**
     * Display a listing of the resource.
     *
     * @param ContentChain $chain
     * @return JsonResponse
     */
    public function index(ContentChain $chain): JsonResponse
    {
        return response()->json($chain->contents()->with(['buttons', 'attachments', 'stickers'])->paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CreateContentRequest $request
     * @param ContentChain $chain
     * @return JsonResponse
     * @throws Throwable
     */
    public function store(CreateContentRequest $request, ContentChain $chain): JsonResponse
    {
        $order = $chain->contents()->max('order') + 1;
        $contentRequest = collect($request->validated())->except(['buttons', 'attachments', 'stickers'])->put(
            'order',
            $order
        )->toArray();

        /** @var Content $content */
        $content = DB::transaction(
            function () use ($request, $contentRequest, $chain) {
                /** @var Content $content */
                $content = $chain->contents()->create($contentRequest);

                collect($request->input('buttons'))->each(fn(array $button) => $content->buttons()->create($button));
                collect($request->input('attachments'))->each(
                    fn(array $attachment) => $content->attachments()->create($attachment)
                );

                $content->stickers()->sync($request->input('stickers'));

                return $content;
            }
        );

        return response()->json($content->load(['buttons', 'attachments', 'stickers']));
    }

    /**
     * Display the specified resource.
     *
     * @param ContentChain $chain
     * @param Content $content
     * @return JsonResponse
     * @noinspection PhpUnusedParameterInspection
     */
    public function show(ContentChain $chain, Content $content): JsonResponse
    {
        return response()->json($content->load(['buttons', 'attachments', 'stickers']));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateContentRequest $request
     * @param ContentChain $chain
     * @param Content $content
     * @return JsonResponse
     * @noinspection PhpUnusedParameterInspection
     * @throws Throwable
     */
    public function update(UpdateContentRequest $request, ContentChain $chain, Content $content): JsonResponse
    {
        $contentRequest = collect($request->validated())->except(['buttons', 'attachments', 'stickers'])->toArray();

        $content->update($contentRequest);

        DB::transaction(
            function () use ($request, $content) {
                $content->buttons()->delete();
                collect($request->input('buttons'))->each(fn(array $button) => $content->buttons()->create($button));

                $content->attachments()->delete();
                collect($request->input('attachments'))->each(
                    fn(array $attachment) => $content->attachments()->create($attachment)
                );

                $content->stickers()->sync($request->input('stickers'));
            }
        );

        return response()->json($content->load(['buttons', 'attachments', 'stickers']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ContentChain $chain
     * @param Content $content
     * @return JsonResponse
     * @throws Exception
     * @noinspection PhpUnusedParameterInspection
     */
    public function destroy(ContentChain $chain, Content $content): JsonResponse
    {
        $content->delete();
        return response()->json("ok");
    }

    public function reorder(ContentChain $chain, ReorderRequest $request): JsonResponse
    {
        collect($request->input('reordered'))->each(
            fn(array $reordered) => Content::whereId($reordered['id'])->update(['order' => $reordered['order']])
        );

        event(new ShouldReinitializeChain($chain));
        return response()->json($chain->contents()->paginate());
    }
}
