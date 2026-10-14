<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Token auth sends the token in the Authorization header, not a cookie, so
    // credentialed requests are not required. Flip to true (and use a specific
    // origin, never '*') if you move to Sanctum SPA cookie auth later.
    'supports_credentials' => false,

];
