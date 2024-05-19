<?php

namespace App\Policies;

use App\Helpers\PermissionsDictionary;
use App\Models\Language;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LanguagePolicy
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
        return $user->can(PermissionsDictionary::VIEW_LANGUAGES_LIST);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param Language $language
     * @return bool
     */
    public function view(User $user, Language $language): bool
    {
        return $user->can(PermissionsDictionary::VIEW_LANGUAGE);
    }
}
