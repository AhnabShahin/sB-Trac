<?php

use App\Http\Controllers\DemoMediaController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

// API-only backend — no Blade UI. The root reports that the API is up and whether
// the database is reachable, so a live deploy can be verified from the browser.
// Everything else lives under routes/api.php.
Route::get('/', function () {
    $database = [
        'connection' => config('database.default'),
        'status' => 'ok',
    ];

    try {
        // Cheap round-trip that forces a real connection without touching any table.
        DB::connection()->getPdo();
        DB::select('select 1');
    } catch (\Throwable $e) {
        $database['status'] = 'error';
        $database['message'] = $e->getMessage();
    }

    // Ensure the public storage symlink exists on THIS host. A symlink committed
    // from another machine points at a dead absolute path, and shared hosting has
    // no `php artisan storage:link`, so (re)create it here with correct server
    // paths. Hitting this route once fixes a 404 on /storage/... image URLs.
    $link = public_path('storage');
    $target = storage_path('app/public');
    $storage = ['link' => $link, 'target' => $target];

    try {
        if (is_dir($link)) {
            $storage['status'] = 'exists';
        } else {
            // Drop a dangling symlink or stray file sitting at the link path.
            if (is_link($link) || file_exists($link)) {
                @unlink($link);
            }

            if (! function_exists('symlink')) {
                $storage['status'] = 'error';
                $storage['message'] = 'symlink() is disabled on this host';
            } elseif (@symlink($target, $link)) {
                $storage['status'] = 'created';
            } else {
                $storage['status'] = 'error';
                $storage['message'] = error_get_last()['message'] ?? 'symlink() failed';
            }
        }

        $storage['linked'] = is_dir($link);
        $storage['target_exists'] = is_dir($target);
        // Spot-check the exact file that 404s, so a missing upload is distinguishable
        // from a missing symlink.
        $probe = 'media/products-services/assets/services-banner/substation.png';
        $storage['probe'] = $probe;
        $storage['probe_exists'] = is_file($target.'/'.$probe);
    } catch (\Throwable $e) {
        $storage['status'] = 'error';
        $storage['message'] = $e->getMessage();
    }

    $ok = $database['status'] === 'ok' && in_array($storage['status'], ['ok', 'exists', 'created'], true);

    return response()->json([
        'service' => 'B-TEL Engineering API',
        'status' => $ok ? 'ok' : 'degraded',
        'database' => $database,
        'storage' => $storage,
    ], $ok ? 200 : 503);
});

// Read-only demo media, served from demo-data/media for the editor's Load demo
// preview. Served at the web root (like /storage) so the URL is a plain image src.
Route::get('/demo-media/{path}', [DemoMediaController::class, 'show'])
    ->where('path', '.*');
