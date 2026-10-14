<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

// Owns everything media: where files live on the public disk, how a stored path
// becomes an absolute URL the frontend can load, uploads from the editor, demo
// materialization (copying demo-data/media into storage on "apply demo"), and
// safe deletion. Nothing else should touch Storage for media directly.
class MediaLibrary
{
    private const ROOT = 'media';

    private function disk()
    {
        return Storage::disk('public');
    }

    /** Absolute URL for a public-disk path, e.g. media/home/x.jpg -> http://host/storage/media/home/x.jpg */
    public function url(string $path): string
    {
        $url = $this->disk()->url($path);

        // The public disk's url() is absolute when its `url` config is set
        // (default: APP_URL.'/storage'); guard against a relative value too.
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            return $url;
        }

        return rtrim((string) config('app.url'), '/') . '/' . ltrim($url, '/');
    }

    /** Is this value one of our managed storage URLs (vs. a /assets demo path or external URL)? */
    public function isManagedUrl(string $value): bool
    {
        return str_contains($value, '/storage/' . self::ROOT . '/');
    }

    /**
     * Public, read-only URL for a demo asset, served straight from demo-data/media
     * (see the /demo-media route). The editor's "Load demo" uses these so it never
     * depends on the frontend shipping a /public/assets copy.
     */
    public function demoUrl(string $assetPath): string
    {
        return rtrim((string) config('app.url'), '/') . '/demo-media/' . ltrim($assetPath, '/');
    }

    /** Map a managed storage URL back to its public-disk path, or null if it isn't one. */
    public function pathFromUrl(string $value): ?string
    {
        if (! $this->isManagedUrl($value)) {
            return null;
        }
        $marker = '/storage/';
        $pos = strpos($value, $marker);
        $path = substr($value, $pos + strlen($marker));

        return str_starts_with($path, self::ROOT . '/') ? $path : null;
    }

    public function store(UploadedFile $file, string $slug): string
    {
        $dir = self::ROOT . '/' . $this->safe($slug) . '/uploads';
        $name = Str::random(24) . '.' . strtolower($file->getClientOriginalExtension() ?: $file->extension());
        $path = $file->storeAs($dir, $name, 'public');

        return $this->url($path);
    }

    /** Delete a managed file. No-op for non-managed values (demo paths, external URLs). */
    public function delete(string $value): bool
    {
        $path = $this->pathFromUrl($value);
        if (! $path) {
            return false;
        }

        return $this->disk()->delete($path);
    }

    /**
     * Remove every stored file for a page. Used before re-applying demo so files
     * never accumulate across repeated applies. Deletes file-by-file and ignores
     * individual failures (e.g. a Windows lock on a file the browser is streaming)
     * so one stuck file can't abort the whole reset.
     */
    public function clearPage(string $slug): void
    {
        $dir = self::ROOT . '/' . $this->safe($slug);

        foreach ($this->disk()->allFiles($dir) as $file) {
            try {
                $this->disk()->delete($file);
            } catch (\Throwable) {
                // leave it; a same-size demo file will simply not be re-copied
            }
        }

        try {
            $this->disk()->deleteDirectory($dir);
        } catch (\Throwable) {
            // non-fatal
        }
    }

    /**
     * Deep-copy every demo media reference in a sections tree into storage and
     * rewrite it to a managed URL. A value is a media reference when it is a
     * string starting with "/assets/" that exists under demo-data/media. This
     * is schema-agnostic: it finds media anywhere in any section's JSON.
     *
     * @param  array<string,mixed>  $sections
     * @return array<string,mixed>
     */
    public function materializeDemo(string $slug, array $sections): array
    {
        return $this->walk($sections, $slug);
    }

    private function walk(mixed $node, string $slug): mixed
    {
        if (is_array($node)) {
            return array_map(fn ($v) => $this->walk($v, $slug), $node);
        }

        if (is_string($node)) {
            $asset = $this->demoAssetPath($node);
            if ($asset !== null) {
                $source = base_path('demo-data/media' . $asset);
                if (is_file($source)) {
                    $dest = self::ROOT . '/' . $this->safe($slug) . '/' . ltrim($asset, '/');

                    // Skip the copy when an identical file is already there. Demo
                    // media is static, so re-applying would only risk overwriting a
                    // file the browser is currently streaming (on Windows that lock
                    // corrupts the write and the asset vanishes).
                    if (! $this->disk()->exists($dest) || $this->disk()->size($dest) !== filesize($source)) {
                        $this->disk()->put($dest, file_get_contents($source));
                    }

                    return $this->url($dest);
                }
            }
        }

        return $node;
    }

    /**
     * If a value points at a demo asset — either a raw "/assets/..." path (from
     * demo-data/home.json, used by Apply demo) or a "/demo-media/assets/..." URL
     * (what the editor's Load demo puts in the form, materialized on Save) —
     * return the "/assets/..." tail that locates the file under demo-data/media.
     * Otherwise null. Managed storage URLs (which also contain "assets/") are left
     * alone because they neither start with "/assets/" nor carry "/demo-media/".
     */
    private function demoAssetPath(string $value): ?string
    {
        if (str_starts_with($value, '/assets/')) {
            return $value;
        }

        $marker = '/demo-media/assets/';
        $pos = strpos($value, $marker);
        if ($pos !== false) {
            return '/assets/' . substr($value, $pos + strlen($marker));
        }

        return null;
    }

    /**
     * Rewrite every "/assets/..." demo reference to its public demo URL, so the
     * editor's Load demo previews from the backend's demo folder. No files are
     * copied; the materialization to storage happens later, on Save.
     *
     * @param  array<string,mixed>  $sections
     * @return array<string,mixed>
     */
    public function linkDemo(array $sections): array
    {
        return $this->walkLink($sections);
    }

    private function walkLink(mixed $node): mixed
    {
        if (is_array($node)) {
            return array_map(fn ($v) => $this->walkLink($v), $node);
        }

        if (is_string($node) && str_starts_with($node, '/assets/') && is_file(base_path('demo-data/media' . $node))) {
            return $this->demoUrl($node);
        }

        return $node;
    }

    /**
     * Delete stored files the previous content referenced but the new content no
     * longer does, so replacing or reloading media never leaves orphans in storage.
     *
     * @param  array<string,mixed>  $oldSections
     * @param  array<string,mixed>  $newSections
     */
    public function collectGarbage(array $oldSections, array $newSections): void
    {
        $old = $this->managedUrls($oldSections);
        $new = array_flip($this->managedUrls($newSections));

        foreach ($old as $url) {
            if (isset($new[$url])) {
                continue;
            }
            try {
                $this->delete($url);
            } catch (\Throwable) {
                // a locked or already-gone file must never fail the save
            }
        }
    }

    /**
     * Every managed storage URL anywhere in a sections tree.
     *
     * @return list<string>
     */
    private function managedUrls(mixed $node): array
    {
        if (is_array($node)) {
            $out = [];
            foreach ($node as $v) {
                foreach ($this->managedUrls($v) as $u) {
                    $out[] = $u;
                }
            }

            return $out;
        }

        if (is_string($node) && $this->isManagedUrl($node)) {
            return [$node];
        }

        return [];
    }

    private function safe(string $slug): string
    {
        return Str::slug($slug) ?: 'page';
    }
}
