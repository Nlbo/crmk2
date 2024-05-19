<?php

namespace App\Http\Controllers;

use App\Filters\PostFilters\RelationTitleFilter;
use App\Http\Requests\CreatePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Category;
use App\Models\Character;
use App\Models\Country;
use App\Models\Language;
use App\Models\Post;
use App\Models\Subject;
use App\Sorts\PostSorts\RelationTitleSort;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class PostController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Post::class, 'post');
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $builder = QueryBuilder::for(Post::class)
            ->with(
                [
                    'language',
                    'character',
                    'category',
                    'stickers',
                    'attachments',
                    'buttons',
                    'subject',
                    'country',
                ]
            )
            ->withCount('schedule_times')
            ->allowedFilters(
                [
                    'title',
                    AllowedFilter::custom('language.title', new RelationTitleFilter(), 'language'),
                    AllowedFilter::custom('category.title', new RelationTitleFilter(), 'category'),
                    AllowedFilter::custom('character.title', new RelationTitleFilter(), 'character'),
                    AllowedFilter::custom('subject.title', new RelationTitleFilter(), 'subject'),
                    AllowedFilter::custom('country.title', new RelationTitleFilter(), 'country'),
                    'created_at',
                    'updated_at',
                    'schedule_times_count'
                ]
            )
            ->allowedSorts(
                [
                    'title',
                    AllowedSort::custom('language.title', new RelationTitleSort(), Language::class),
                    AllowedSort::custom('category.title', new RelationTitleSort(), Category::class),
                    AllowedSort::custom('character.title', new RelationTitleSort(), Character::class),
                    AllowedSort::custom('subject.title', new RelationTitleSort(), Subject::class),
                    AllowedSort::custom('country.title', new RelationTitleSort(), Country::class),
                    'created_at',
                    'updated_at',
                    'schedule_times_count'
                ]
            );

        if ($request->boolean('paginated')) {
            return response()->json($builder->paginate()->appends($request->query()));
        }
        return response()->json($builder->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CreatePostRequest $request
     * @return JsonResponse
     * @throws Throwable
     */
    public function store(CreatePostRequest $request): JsonResponse
    {
        $postRequest = collect($request->validated())->except(['buttons', 'attachments', 'stickers'])->toArray();

        $post = DB::transaction(
            function () use ($postRequest, $request) {
                $post = Post::create($postRequest);

                collect($request->input('buttons'))->each(fn(array $button) => $post->buttons()->create($button));
                collect($request->input('attachments'))->each(
                    fn(array $attachment) => $post->attachments()->create($attachment)
                );

                $post->stickers()->sync($request->input('stickers'));

                return $post;
            }
        );

        return response()->json(
            $post->load(
                ['language', 'character', 'category', 'stickers', 'attachments', 'buttons', 'subject', 'country']
            )->loadCount(
                'schedule_times'
            )
        );
    }

    /**
     * Display the specified resource.
     *
     * @param Post $post
     * @return JsonResponse
     */
    public function show(Post $post): JsonResponse
    {
        return response()->json(
            $post->load(
                ['language', 'character', 'category', 'stickers', 'attachments', 'buttons', 'subject', 'country']
            )->loadCount(
                'schedule_times'
            )
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdatePostRequest $request
     * @param Post $post
     * @return JsonResponse
     * @throws Throwable
     */
    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $postRequest = collect($request->validated())->except(['buttons', 'attachments', 'stickers'])->toArray();

        $post = DB::transaction(
            function () use ($postRequest, $request, $post) {
                $post->update($postRequest);

                $post->buttons()->delete();
                collect($request->input('buttons'))->each(fn(array $button) => $post->buttons()->create($button));

                $post->attachments()->delete();
                collect($request->input('attachments'))->each(
                    fn(array $attachment) => $post->attachments()->create($attachment)
                );

                $post->stickers()->sync($request->input('stickers'));

                return $post;
            }
        );

        return response()->json(
            $post->load(
                ['language', 'character', 'category', 'stickers', 'attachments', 'buttons', 'subject', 'country']
            )->loadCount(
                'schedule_times'
            )
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Post $post
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Post $post): JsonResponse
    {
        $post->delete();
        return response()->json('OK');
    }
}
