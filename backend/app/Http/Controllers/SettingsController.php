<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use Illuminate\Http\JsonResponse;

// Public, read-only site settings for the frontend chrome (identity, contact,
// social, SEO defaults). Mirrors the public page-content endpoint.
class SettingsController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(['settings' => AdminSettingsController::read()]);
    }
}
