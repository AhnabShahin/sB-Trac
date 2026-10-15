<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostMeta extends Model
{
    protected $table = 'postmeta';

    protected $fillable = [
        'post_id',
        'meta_key',
        'meta_value',
        'updated_by',
    ];

    // Section payloads are stored as JSON text and handed back as arrays.
    protected $casts = [
        'meta_value' => 'array',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
