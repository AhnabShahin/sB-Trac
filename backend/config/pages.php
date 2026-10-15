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
            'editable' => true,
            'sections' => ['servicesHero', 'serviceList', 'productsShowcase', 'servicesCta'],
        ],
        [
            'slug' => 'substation',
            'title' => 'Substation & Switchgear',
            'url' => '/products-services/substation',
            'editable' => true,
            'group' => 'products',
            'parent' => 'products-services',
            'sections' => ['hero', 'capabilities', 'features', 'slider', 'specs', 'otherServices'],
        ],
        [
            'slug' => 'solar',
            'title' => 'Solar Power',
            'url' => '/products-services/solar',
            'editable' => true,
            'group' => 'products',
            'parent' => 'products-services',
            'sections' => ['hero', 'systemTypes', 'features', 'process', 'slider', 'siteVisitCta', 'siteVisitForm', 'banner', 'otherServices'],
        ],
        [
            'slug' => 'mep',
            'title' => 'MEP / EPC',
            'url' => '/products-services/mep',
            'editable' => true,
            'group' => 'products',
            'parent' => 'products-services',
            'sections' => ['hero', 'pillars', 'services', 'slider', 'brands', 'otherServices'],
        ],
        [
            'slug' => 'water-treatment',
            'title' => 'Water Treatment Chemicals',
            'url' => '/products-services/water-treatment',
            'editable' => true,
            'group' => 'products',
            'parent' => 'products-services',
            'sections' => ['hero', 'features', 'slider', 'otherServices'],
        ],
        [
            'slug' => 'after-sales',
            'title' => 'After Sales Support',
            'url' => '/products-services/after-sales',
            'editable' => true,
            'group' => 'products',
            'parent' => 'products-services',
            'sections' => ['hero', 'stats', 'services', 'process', 'coverage', 'cta'],
        ],
        [
            'slug' => 'projects',
            'title' => 'Projects',
            'url' => '/projects',
            'editable' => true,
            'sections' => ['projectsHero', 'statsBand', 'portfolio', 'trackRecord', 'projectsCta'],
        ],
        [
            'slug' => 'partners',
            'title' => 'Partners',
            'url' => '/partners',
            'editable' => true,
            'sections' => ['partnersHero', 'partnerWall', 'partnersCta'],
        ],
        [
            'slug' => 'clients',
            'title' => 'Clients',
            'url' => '/clients',
            'editable' => true,
            'sections' => ['clientsHero', 'clientsStats', 'clientsBands', 'clientsTestimonials', 'clientsCta'],
        ],
        [
            'slug' => 'contact',
            'title' => 'Contact',
            'url' => '/contact',
            'editable' => true,
            'sections' => ['contactHero', 'contactForm', 'contactDetails', 'contactFaq'],
        ],
        [
            'slug' => 'header',
            'title' => 'Header',
            'url' => 'Site-wide',
            'editable' => true,
            'group' => 'global',
            'sections' => ['header'],
        ],
        [
            'slug' => 'footer',
            'title' => 'Footer',
            'url' => 'Site-wide',
            'editable' => true,
            'group' => 'global',
            'sections' => ['footer'],
        ],
    ],
];
