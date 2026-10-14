<?php

use App\Http\Controllers\DemoMediaController;
use Illuminate\Support\Facades\Route;

// API-only backend — no Blade UI. The root just reports that the API is up;
// everything else lives under routes/api.php.
Route::get('/', fn () => response()->json([
    'service' => 'B-TEL Engineering API',
    'status' => 'ok',
]));

// Read-only demo media, served from demo-data/media for the editor's Load demo
// preview. Served at the web root (like /storage) so the URL is a plain image src.
Route::get('/demo-media/{path}', [DemoMediaController::class, 'show'])
    ->where('path', '.*');
