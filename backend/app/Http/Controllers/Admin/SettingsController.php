<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// Site-wide settings (identity, contact, social, SEO). Stored WordPress-style
// in the same posts/postmeta tables as pages: one post (post_type 'settings',
// slug 'site'), one meta_key per settings group. The public frontend reads the
// merged map through the public SettingsController; the editor reads/writes
// here.
class SettingsController extends Controller
{
    public const SLUG = 'site';

    /** Default shape, so the editor always has every field to bind to. */
    public const DEFAULTS = [
        'identity' => [
            'siteName' => '',
            'tagline' => '',
            'copyright' => '',
        ],
        'contact' => [
            'email' => '',
            'phone' => '',
            'address' => '',
        ],
        'social' => [
            'facebook' => '',
            'linkedin' => '',
            'youtube' => '',
            'whatsapp' => '',
        ],
        'seo' => [
            'metaTitle' => '',
            'metaDescription' => '',
            'ogImage' => '',
        ],
    ];

    public function show(): JsonResponse
    {
        return response()->json(['settings' => self::read()]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'settings' => ['required', 'array'],
            'settings.identity' => ['sometimes', 'array'],
            'settings.identity.siteName' => ['sometimes', 'nullable', 'string', 'max:120'],
            'settings.identity.tagline' => ['sometimes', 'nullable', 'string', 'max:200'],
            'settings.identity.copyright' => ['sometimes', 'nullable', 'string', 'max:200'],
            'settings.contact' => ['sometimes', 'array'],
            'settings.contact.email' => ['sometimes', 'nullable', 'string', 'max:160'],
            'settings.contact.phone' => ['sometimes', 'nullable', 'string', 'max:60'],
            'settings.contact.address' => ['sometimes', 'nullable', 'string', 'max:300'],
            'settings.social' => ['sometimes', 'array'],
            'settings.social.facebook' => ['sometimes', 'nullable', 'string', 'max:300'],
            'settings.social.linkedin' => ['sometimes', 'nullable', 'string', 'max:300'],
            'settings.social.youtube' => ['sometimes', 'nullable', 'string', 'max:300'],
            'settings.social.whatsapp' => ['sometimes', 'nullable', 'string', 'max:300'],
            'settings.seo' => ['sometimes', 'array'],
            'settings.seo.metaTitle' => ['sometimes', 'nullable', 'string', 'max:160'],
            'settings.seo.metaDescription' => ['sometimes', 'nullable', 'string', 'max:300'],
            'settings.seo.ogImage' => ['sometimes', 'nullable', 'string', 'max:300'],
        ]);

        $post = Post::firstOrNew(['post_type' => 'settings', 'slug' => self::SLUG]);
        $post->title = 'Site Settings';
        $post->status = 'published';
        $post->save();

        // Only the groups present in the payload are touched.
        $groups = array_intersect_key($data['settings'], self::DEFAULTS);
        $post->writeSections($groups, $request->user()->id);

        return response()->json(['settings' => self::read()]);
    }

    /** Merged { group => data } map, defaults filled in for any missing field. */
    public static function read(): array
    {
        $post = Post::where('post_type', 'settings')->where('slug', self::SLUG)->with('meta')->first();
        $stored = $post ? $post->sections() : [];

        $merged = self::DEFAULTS;
        foreach (self::DEFAULTS as $group => $fields) {
            if (is_array($stored[$group] ?? null)) {
                $merged[$group] = array_merge($fields, $stored[$group]);
            }
        }

        return $merged;
    }
}
