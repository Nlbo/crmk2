<?php

namespace App\Policies;

use App\Helpers\PermissionsDictionary;
use App\Models\Channel;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ChannelPolicy
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
        return $user->can(PermissionsDictionary::VIEW_CHANNELS_LIST);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param Channel $channel
     * @return mixed
     */
    public function view(User $user, Channel $channel)
    {
        return $user->can(PermissionsDictionary::VIEW_CHANNEL);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can(PermissionsDictionary::CREATE_CHANNEL);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User $user
     * @param Channel $channel
     * @return mixed
     */
    public function update(User $user, Channel $channel)
    {
        return $user->can(PermissionsDictionary::UPDATE_CHANNEL);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User $user
     * @param Channel $channel
     * @return mixed
     */
    public function delete(User $user, Channel $channel)
    {
        return $user->can(PermissionsDictionary::DELETE_CHANNEL);
    }
}
