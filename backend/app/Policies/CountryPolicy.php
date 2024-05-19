<?php

namespace App\Policies;

use App\Helpers\PermissionsDictionary;
use App\Models\Country;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CountryPolicy
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
        return $user->can(PermissionsDictionary::VIEW_COUNTRIES_LIST);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param Country $country
     * @return bool
     */
    public function view(User $user, Country $country): bool
    {
        return $user->can(PermissionsDictionary::VIEW_COUNTRY);
    }
}
