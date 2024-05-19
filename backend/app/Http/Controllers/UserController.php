<?php

namespace App\Http\Controllers;


use App\Helpers\PermissionsDictionary;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();

        $builder = QueryBuilder::for(User::class)
            ->with(['roles.permissions', 'permissions'])
            ->allowedFilters(['name', 'email'])
            ->allowedSorts('name', 'email');

        if ($actor->cannot(PermissionsDictionary::VIEW_USERS)) {
            $builder->where('id', $actor->id);
        }

        if ($request->boolean('paginated')) {
            return response()->json($builder->paginate()->appends($request->query()));
        }
        return response()->json($builder->get());
    }

    /**
     * @param User $user
     * @param Request $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function show(User $user, Request $request): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();

        if ($actor->id === $user->id || $actor->can(PermissionsDictionary::VIEW_USERS)) {
            return response()->json($user->load(['roles.permissions', 'permissions']));
        }

        throw new AuthorizationException();
    }

    public function me(): JsonResponse
    {
        return response()->json(auth()->user()->load(['roles.permissions', 'permissions']));
    }

    /**
     * @param User $user
     * @return JsonResponse
     * @throws Exception
     */
    public function delete(User $user): JsonResponse
    {
        $user->delete();

        return response()->json('ok');
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create(
            array_merge(
                collect($request->validated())->except(['roles', 'permissions'])->toArray(),
                ['password' => Hash::make($request->input('password'))]
            )
        );

        $user->syncRoles($request->input('roles'));
        $user->syncPermissions($request->input('permissions'));

        return response()->json(
            [
                'token' => $user->createToken('default')->plainTextToken,
                'user' => $user
            ]
        );
    }

    /**
     * @param User $user
     * @param UpdateUserRequest $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function update(User $user, UpdateUserRequest $request): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        if ($actor->id === $user->id || $actor->can(PermissionsDictionary::UPDATE_USERS)) {
            return response()->json($this->updateUser($user, $request));
        }

        throw new AuthorizationException();
    }

    /**
     * @param User $user
     * @param UpdateUserRequest $request
     * @return User
     * @throws AuthorizationException
     */
    private function updateUser(User $user, UpdateUserRequest $request): User
    {
        if ($request->hasAny(['roles', 'permissions'])) {
            Gate::authorize(PermissionsDictionary::MANAGE_ROLES_AND_PERMISSIONS);
        }

        $update = collect($request->validated())->except(['roles', 'permissions', 'password'])->toArray();

        if ($request->input('password') !== null) {
            $update['password'] = Hash::make($request->input('password'));
        }

        $user->update($update);

        if ($request->has('roles')) {
            $user->syncRoles($request->input('roles'));
        }

        if ($request->has('permissions')) {
            $user->syncPermissions($request->input('permissions'));
        }

        return $user;
    }
}
