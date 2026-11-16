<?php

use App\Http\Controllers\DemoMediaController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

// Directory junctions (unlike NTFS symbolic links) don't need admin rights or
// Developer Mode on Windows, so this is the fallback the health-check route
// below reaches for when symlink() fails on a local Windows dev box.
function windows_storage_junction(string $target, string $link): bool
{
    exec('cmd /c mklink /J '.escapeshellarg($link).' '.escapeshellarg($target), result_code: $code);

    return $code === 0 && is_dir($link);
}

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
    } catch (Throwable $e) {
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
        // A REAL link, not just any directory at the path: a failed symlink()
        // (e.g. Windows without admin/Developer Mode) can leave a plain folder
        // sitting at $link — is_dir() alone reports that as fine, but a plain
        // folder is a point-in-time copy that silently drifts out of sync with
        // every file written to storage after it was created (newly applied
        // demo media 404s/403s even though it's really on disk).
        $isProperLink = is_link($link) && realpath($link) === realpath($target);

        if ($isProperLink) {
            $storage['status'] = 'exists';
        } else {
            // Drop whatever is sitting at the link path — a dangling symlink,
            // a stray file, or a stale real directory — before relinking.
            if (is_dir($link) && ! is_link($link)) {
                File::deleteDirectory($link);
            } elseif (is_link($link) || file_exists($link)) {
                @unlink($link);
            }

            if (function_exists('symlink') && @symlink($target, $link)) {
                $storage['status'] = 'created';
            } elseif (PHP_OS_FAMILY === 'Windows' && windows_storage_junction($target, $link)) {
                // symlink() needs admin rights or Developer Mode on Windows and
                // commonly fails on a local dev box; a directory junction does the
                // same job (live, always in sync — unlike a one-off file copy)
                // without either.
                $storage['status'] = 'created';
            } else {
                $storage['status'] = 'error';
                $storage['message'] = ! function_exists('symlink')
                    ? 'symlink() is disabled on this host'
                    : (error_get_last()['message'] ?? 'symlink() failed');
            }
        }

        $storage['linked'] = is_dir($link);
        $storage['target_exists'] = is_dir($target);
        // Spot-check the exact file that 404s, so a missing upload is distinguishable
        // from a missing symlink.
        $probe = 'media/products-services/assets/services-banner/substation.png';
        $storage['probe'] = $probe;
        $storage['probe_exists'] = is_file($target.'/'.$probe);
    } catch (Throwable $e) {
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
