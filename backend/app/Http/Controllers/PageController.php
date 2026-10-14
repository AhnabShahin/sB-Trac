<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;

// Public, read-only. The frontend renders strictly from what lives here — there
// is no demo/fallback on the frontend, so an unseeded page is a genuine 404 and
// the frontend simply renders nothing for it.
class PageController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $post = Post::where('post_type', 'page')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with('meta')
            ->first();

        if (! $post) {
            return response()->json(['message' => 'Page not found.'], 404);
        }

        return response()->json([
            'slug' => $post->slug,
            'title' => $post->title,
            'sections' => $post->sections(),
        ]);
    }
}
