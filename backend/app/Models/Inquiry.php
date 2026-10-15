<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $fillable = [
        'full_name',
        'company',
        'email',
        'phone',
        'service',
        'location',
        'budget',
        'message',
        'newsletter',
        'status',
        'ip_address',
    ];

    protected $casts = [
        'newsletter' => 'boolean',
    ];

    public const STATUSES = ['new', 'read', 'archived'];
}
