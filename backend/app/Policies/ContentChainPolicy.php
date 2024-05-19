<?php

namespace App\Policies;

use App\Helpers\PermissionsDictionary;
use App\Models\ContentChain;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContentChainPolicy
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
        return $user->can(PermissionsDictionary::VIEW_CHAINS_LIST);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param ContentChain $contentChain
     * @return mixed
     */
    public function view(User $user, ContentChain $contentChain)
    {
        return $user->can(PermissionsDictionary::VIEW_CHAIN);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can(PermissionsDictionary::CREATE_CHAIN);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User $user
     * @param ContentChain $contentChain
     * @return mixed
     */
    public function update(User $user, ContentChain $contentChain)
    {
        return $user->can(PermissionsDictionary::UPDATE_CHAIN);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User $user
     * @param ContentChain $contentChain
     * @return mixed
     */
    public function delete(User $user, ContentChain $contentChain)
    {
        return $user->can(PermissionsDictionary::DELETE_CHAIN);
    }
}
