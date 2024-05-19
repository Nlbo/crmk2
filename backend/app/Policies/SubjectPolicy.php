<?php

namespace App\Policies;

use App\Helpers\PermissionsDictionary;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SubjectPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionsDictionary::VIEW_SUBJECTS_LIST);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param Subject $subject
     * @return bool
     */
    public function view(User $user, Subject $subject): bool
    {
        return $user->can(PermissionsDictionary::VIEW_SUBJECT);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->can(PermissionsDictionary::CREATE_SUBJECT);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User $user
     * @param Subject $subject
     * @return bool
     */
    public function update(User $user, Subject $subject): bool
    {
        return $user->can(PermissionsDictionary::UPDATE_SUBJECT);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User $user
     * @param Subject $subject
     * @return bool
     */
    public function delete(User $user, Subject $subject): bool
    {
        return $user->can(PermissionsDictionary::DELETE_SUBJECT);
    }
}
