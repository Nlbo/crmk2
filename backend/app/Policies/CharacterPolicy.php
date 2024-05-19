<?php

namespace App\Policies;

use App\Helpers\PermissionsDictionary;
use App\Models\Character;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CharacterPolicy
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
        return $user->can(PermissionsDictionary::VIEW_CHARACTERS_LIST);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param Character $character
     * @return mixed
     */
    public function view(User $user, Character $character)
    {
        return $user->can(PermissionsDictionary::VIEW_CHARACTER);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can(PermissionsDictionary::CREATE_CHARACTER);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User $user
     * @param Character $character
     * @return mixed
     */
    public function update(User $user, Character $character)
    {
        return $user->can(PermissionsDictionary::UPDATE_CHARACTER);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User $user
     * @param Character $character
     * @return mixed
     */
    public function delete(User $user, Character $character)
    {
        return $user->can(PermissionsDictionary::DELETE_CHARACTER);
    }
}
