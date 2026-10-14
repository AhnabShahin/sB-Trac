<?php

// Registry of the fixed frontend pages the admin panel can manage. The frontend
// routes already exist and their designs are locked; this list drives the admin
// "Pages" menu. `editable` gates which pages have a live editor — the rest are
// listed but parked until their content model is built. `sections` is the
// ordered set of section keys an editable page exposes.
return [
    'pages' => [
        [
            'slug' => 'home',
            'title' => 'Home',
            'url' => '/',
            'editable' => true,
            'sections' => ['hero', 'clientMarquee', 'principle', 'isoBand', 'strength', 'timeline', 'projects', 'support', 'partnerCta'],
        ],
        [
            'slug' => 'products-services',
            'title' => 'Products & Services',
            'url' => '/products-services',
            'editable' => false,
            'sections' => [],
        ],
        [
            'slug' => 'projects',
            'title' => 'Projects',
            'url' => '/projects',
            'editable' => false,
            'sections' => [],
        ],
        [
            'slug' => 'partners',
            'title' => 'Partners',
            'url' => '/partners',
            'editable' => false,
            'sections' => [],
        ],
        [
            'slug' => 'clients',
            'title' => 'Clients',
            'url' => '/clients',
            'editable' => false,
            'sections' => [],
        ],
        [
            'slug' => 'contact',
            'title' => 'Contact',
            'url' => '/contact',
            'editable' => false,
            'sections' => [],
        ],
    ],
];
