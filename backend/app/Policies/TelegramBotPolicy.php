<?php

namespace App\Policies;

use App\Helpers\PermissionsDictionary;
use App\Models\TelegramBot;
use App\Models\User;
use App\Services\Bot;
use Illuminate\Auth\Access\HandlesAuthorization;

class TelegramBotPolicy
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
        return $user->can(PermissionsDictionary::VIEW_BOTS_LIST);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param TelegramBot $telegramBot
     * @return mixed
     */
    public function view(User $user, TelegramBot $telegramBot)
    {
        return $user->can(PermissionsDictionary::VIEW_BOT);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can(PermissionsDictionary::CREATE_BOT);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User $user
     * @param TelegramBot $telegramBot
     * @return mixed
     */
    public function update(User $user, TelegramBot $telegramBot)
    {
        return $user->can(PermissionsDictionary::UPDATE_BOT);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User $user
     * @param TelegramBot $telegramBot
     * @return mixed
     */
    public function delete(User $user, TelegramBot $telegramBot)
    {
        return $user->can(PermissionsDictionary::DELETE_BOT) && $telegramBot->token !== Bot::SERVICE_BOT_ID;
    }
}