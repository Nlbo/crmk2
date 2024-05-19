<?php

namespace App\Events;

use App\Helpers\PermissionsDictionary;
use App\Models\Update;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UpdateReceived implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    private Update $update;

    /**
     * Create a new event instance.
     *
     * @param Update $update
     */
    public function __construct(Update $update)
    {
        $this->update = $update;
    }

    public function broadcastWith(): array
    {
        $update = $this->update->toArray();
        unset($update['original']);
        return $update;
    }

    public function broadcastAs(): string
    {
        return 'UpdateReceived';
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return PrivateChannel[]
     */
    public function broadcastOn(): array
    {
        return User::query()
            ->whereHas(
                'roles',
                fn(Builder $q) => $q->whereHas(
                    'permissions',
                    fn(Builder $builder) => $builder->where('name', PermissionsDictionary::MANAGE_CHATS)
                )
            )
            ->orWhereHas(
                'permissions',
                fn(Builder $q) => $q->where('name', PermissionsDictionary::MANAGE_CHATS)
            )->get()
            ->map(
                fn(User $user) => new PrivateChannel("App.Models.User.$user->id")
            )->push(new PrivateChannel("App.Models.Update.{$this->update->chat_id}"))->toArray();
    }
}
