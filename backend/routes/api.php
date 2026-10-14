<?php

use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PageController as AdminPageController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// No public registration — the admin is created from the CLI
// (`php artisan admin:create`). Only sign-in is exposed.
Route::post('/login', [AuthController::class, 'login']);

// Public, read-only page content. The frontend renders strictly from this; an
// unseeded page returns 404 and the frontend shows nothing for it.
Route::get('/pages/{slug}', [PageController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin content management for the fixed frontend pages.
    Route::prefix('admin')->group(function () {
        Route::get('/pages', [AdminPageController::class, 'index']);
        Route::get('/pages/{slug}', [AdminPageController::class, 'show']);
        Route::put('/pages/{slug}', [AdminPageController::class, 'update']);
        Route::get('/pages/{slug}/demo', [AdminPageController::class, 'demo']);
        Route::post('/pages/{slug}/apply-demo', [AdminPageController::class, 'applyDemo']);

        // Media uploaded from / removed via the editor.
        Route::post('/media', [MediaController::class, 'store']);
        Route::delete('/media', [MediaController::class, 'destroy']);
    });
});
