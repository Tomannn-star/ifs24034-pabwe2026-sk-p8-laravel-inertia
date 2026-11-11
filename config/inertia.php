<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Use Script Element for Initial Page
    |--------------------------------------------------------------------------
    |
    | When enabled, Inertia will render the initial page object inside a
    | <script type="application/json"> element instead of the data-page
    | attribute on the root element. This is required by newer @inertiajs
    | core adapters and prevents attribute size limits.
    |
    */
    'use_script_element_for_initial_page' => true,

    'ssr' => [
        'enabled' => false,
        'url' => 'http://127.0.0.1:13714',
    ],

    'testing' => [
        'ensure_pages_exist' => true,
        'page_paths' => [
            resource_path('js/Pages'),
        ],
    ],
];
