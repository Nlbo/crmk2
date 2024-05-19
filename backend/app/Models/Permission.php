<?php


namespace App\Models;


use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Spatie\Permission\Models\Role;

class Permission extends \Spatie\Permission\Models\Permission
{
    private const PERMISSION_LANG = 'permissions';
    private const PERMISSION_DESC_LANG = 'permissions_desc';

    protected $appends = ['title', 'description'];

    public function getTitleAttribute(): string
    {
        return __(self::PERMISSION_LANG . '.' . $this->name);
    }

    public function getDescriptionAttribute(): string
    {
        return __(self::PERMISSION_DESC_LANG . '.' . $this->name);
    }
}
