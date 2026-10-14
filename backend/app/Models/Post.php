<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    protected $fillable = [
        'post_type',
        'slug',
        'title',
        'status',
    ];

    public function meta(): HasMany
    {
        return $this->hasMany(PostMeta::class);
    }

    /**
     * Collapse this post's meta rows into a { section => data } map, the shape
     * the frontend and the editor both consume.
     *
     * @return array<string, mixed>
     */
    public function sections(): array
    {
        return $this->meta
            ->mapWithKeys(fn (PostMeta $m) => [$m->meta_key => $m->meta_value])
            ->all();
    }

    /**
     * Upsert a { section => data } map onto this post's meta. Only the keys
     * passed are touched; omitted sections are left untouched.
     *
     * @param  array<string, mixed>  $sections
     */
    public function writeSections(array $sections): void
    {
        foreach ($sections as $key => $value) {
            $this->meta()->updateOrCreate(
                ['meta_key' => $key],
                ['meta_value' => $value],
            );
        }
    }
}
