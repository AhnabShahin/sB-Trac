<?php

namespace App\Http\Controllers;

use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

// Serves the demo media bundle (demo-data/media) read-only over HTTP, so the
// editor's "Load demo" can preview straight from the backend instead of relying
// on the frontend shipping a /public/assets copy. Public by design — this is the
// same static demo imagery the site ships with, nothing sensitive.
class DemoMediaController extends Controller
{
    public function show(string $path): BinaryFileResponse
    {
        $root = realpath(base_path('demo-data/media'));
        $full = realpath($root . DIRECTORY_SEPARATOR . $path);

        // Reject anything that escapes the demo-media root (path traversal) or
        // doesn't resolve to a real file.
        abort_unless($root && $full && str_starts_with($full, $root) && is_file($full), Response::HTTP_NOT_FOUND);

        return response()->file($full, ['Cache-Control' => 'public, max-age=3600']);
    }
}
