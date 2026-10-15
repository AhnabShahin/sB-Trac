<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Services\MediaLibrary;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PageController extends Controller
{
    public function __construct(private readonly MediaLibrary $media) {}

    /** The admin "Pages" menu: the fixed frontend pages and which are editable. */
    public function index(): JsonResponse
    {
        return response()->json(['pages' => config('pages.pages')]);
    }

    /** Current DB content for the editor. Empty `sections` means nothing saved yet. */
    public function show(string $slug): JsonResponse
    {
        $entry = $this->registryEntry($slug);

        $post = Post::where('post_type', 'page')->where('slug', $slug)->with('meta.updater')->first();

        return response()->json([
            'slug' => $slug,
            'title' => $post->title ?? $entry['title'],
            'editable' => $entry['editable'],
            'sectionKeys' => $entry['sections'],
            'sections' => $post ? $post->sections() : (object) [],
            'sectionsMeta' => $post ? $post->sectionsMeta() : (object) [],
        ]);
    }

    /** Upsert: create the page row by slug on first save, update it thereafter. */
    public function update(Request $request, string $slug): JsonResponse
    {
        $entry = $this->registryEntry($slug);
        $this->assertEditable($entry);

        $data = $request->validate([
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'sections' => ['required', 'array'],
        ]);

        // Previous media, so we can delete whatever this save no longer references.
        $previous = Post::where('post_type', 'page')->where('slug', $slug)->with('meta')->first();
        $oldSections = $previous ? $previous->sections() : [];

        // Copy any demo-sourced media (a Load-demo URL, or a hand-typed /assets
        // path) into storage and rewrite it to a managed storage URL, so the DB
        // never persists a read-only demo reference.
        $sections = $this->media->materializeDemo($slug, $data['sections']);

        $post = $this->upsert($slug, $entry, $data['title'] ?? null, $sections, $request->user()->id);

        $this->media->collectGarbage($oldSections, $post->sections());

        return response()->json([
            'slug' => $post->slug,
            'title' => $post->title,
            'sections' => $post->sections(),
            'sectionsMeta' => $post->sectionsMeta(),
        ]);
    }

    /** The demo snapshot for this page, read-only. Feeds the editor's demo preview. */
    public function demo(string $slug): JsonResponse
    {
        $this->registryEntry($slug);

        $demo = $this->readDemo($slug);
        // Point media at the backend's public demo folder so the editor preview
        // never relies on the frontend shipping a copy under /public.
        $demo['sections'] = $this->media->linkDemo($demo['sections'] ?? []);

        return response()->json($demo);
    }

    /** Write the demo snapshot into the DB (seed/reset a page to its demo content). */
    public function applyDemo(Request $request, string $slug): JsonResponse
    {
        $entry = $this->registryEntry($slug);
        $this->assertEditable($entry);

        // Clean slate first (per page): drop this page's DB content and every
        // stored file, so repeated applies never pile up duplicate rows or files.
        Post::where('post_type', 'page')->where('slug', $slug)->delete();
        $this->media->clearPage($slug);

        $demo = $this->readDemo($slug);
        // Copy the demo's media into storage and swap /assets paths for managed
        // storage URLs before persisting, so the live site serves from storage.
        $sections = $this->media->materializeDemo($slug, $demo['sections'] ?? []);
        $post = $this->upsert($slug, $entry, $demo['title'] ?? null, $sections, $request->user()->id);

        return response()->json([
            'slug' => $post->slug,
            'title' => $post->title,
            'sections' => $post->sections(),
            'sectionsMeta' => $post->sectionsMeta(),
        ]);
    }

    /**
     * @param  array<string, mixed>  $sections
     */
    private function upsert(string $slug, array $entry, ?string $title, array $sections, int $updatedBy): Post
    {
        $post = Post::firstOrNew(['post_type' => 'page', 'slug' => $slug]);
        $post->title = $title ?? $post->title ?? $entry['title'];
        $post->status = $post->status ?? 'published';
        $post->save();

        $post->writeSections($sections, $updatedBy);

        return $post->fresh('meta.updater');
    }

    /** @return array{slug:string,title:string,url:string,editable:bool,sections:array} */
    private function registryEntry(string $slug): array
    {
        $entry = collect(config('pages.pages'))->firstWhere('slug', $slug);

        abort_unless($entry, Response::HTTP_NOT_FOUND, 'Unknown page.');

        return $entry;
    }

    private function assertEditable(array $entry): void
    {
        abort_unless($entry['editable'], Response::HTTP_FORBIDDEN, 'This page is not editable yet.');
    }

    /** @return array<string, mixed> */
    private function readDemo(string $slug): array
    {
        $path = base_path("demo-data/{$slug}.json");

        abort_unless(is_file($path), Response::HTTP_NOT_FOUND, 'No demo data for this page.');

        return json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
    }
}
