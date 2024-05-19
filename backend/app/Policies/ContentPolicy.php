<?php

namespace App\Policies;

use App\Helpers\PermissionsDictionary;
use App\Models\Content;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param User $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        return $user->can(PermissionsDictionary::VIEW_CONTENTS_LIST);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param Content $content
     * @return mixed
     */
    public function view(User $user, Content $content)
    {
        return $user->can(PermissionsDictionary::VIEW_CONTENT);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can(PermissionsDictionary::CREATE_CONTENT);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User $user
     * @param Content $content
     * @return mixed
     */
    public function update(User $user, Content $content)
    {
        return $user->can(PermissionsDictionary::UPDATE_CONTENT);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User $user
     * @param Content $content
     * @return mixed
     */
    public function delete(User $user, Content $content)
    {
        return $user->can(PermissionsDictionary::DELETE_CONTENT);
    }
}
