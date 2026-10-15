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
    public function writeSections(array $sections, ?int $updatedBy = null): void
    {
        foreach ($sections as $key => $value) {
            $this->meta()->updateOrCreate(
                ['meta_key' => $key],
                ['meta_value' => $value, 'updated_by' => $updatedBy],
            );
        }
    }

    /**
     * Per-section "who last saved this, and when" — for the editor's audit
     * trail. Requires `meta.updater` to be eager-loaded to avoid N+1 queries.
     *
     * @return array<string, array{updated_at: ?string, updated_by: ?array{id: int, name: string}}>
     */
    public function sectionsMeta(): array
    {
        return $this->meta
            ->mapWithKeys(fn (PostMeta $m) => [
                $m->meta_key => [
                    'updated_at' => $m->updated_at?->toIso8601String(),
                    'updated_by' => $m->updater ? ['id' => $m->updater->id, 'name' => $m->updater->name] : null,
                ],
            ])
            ->all();
    }
}
