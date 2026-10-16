<?php

// Browser origins allowed to call the API. Prod sets CORS_ALLOWED_ORIGINS (comma
// list) in .env; if unset we fall back to FRONTEND_URL plus the local dev origin,
// so a fresh checkout works without config. env() is read here (not in a
// component) so `php artisan config:cache` bakes the final list on the server.
$origins = array_values(array_filter(array_map(
    'trim',
    explode(',', (string) env('CORS_ALLOWED_ORIGINS', ''))
)));

if (empty($origins)) {
    $frontend = env('FRONTEND_URL');
    $origins = $frontend
        ? [$frontend, 'http://localhost:3000']
        : ['http://localhost:3000'];
}

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => $origins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Token auth sends the token in the Authorization header, not a cookie, so
    // credentialed requests are not required. Flip to true (and use a specific
    // origin, never '*') if you move to Sanctum SPA cookie auth later.
    'supports_credentials' => false,

];
