<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\MediaLibrary;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function __construct(private readonly MediaLibrary $media) {}

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            // 2 MB matches the default PHP upload_max_filesize. Raise both
            // (php.ini) and this rule together for larger video uploads.
            'file' => ['required', 'file', 'mimetypes:image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm', 'max:2048'],
            'slug' => ['required', 'string', 'max:64'],
        ]);

        $url = $this->media->store($data['file'], $data['slug']);

        return response()->json(['url' => $url]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $data = $request->validate([
            'url' => ['required', 'string'],
        ]);

        $deleted = $this->media->delete($data['url']);

        return response()->json(['deleted' => $deleted]);
    }
}
