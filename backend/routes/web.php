<?php

use Illuminate\Support\Facades\Route;

// API-only backend — no Blade UI. The root just reports that the API is up;
// everything else lives under routes/api.php.
Route::get('/', fn () => response()->json([
    'service' => 'B-TEL Engineering API',
    'status' => 'ok',
]));
