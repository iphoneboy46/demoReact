<?php 
$GLOBALS['config'] = [
    'templates' => [
        'includes' => [
            'styles' => [
                // '/css/style.css' => [
                //     'name' => 'style',
                //     'exclude' => [
                //         //'post_ids'   => [ 00 ],
                //         //'post_types' => [ 'postex' ],
                //         //'taxonomys'  => [ 'categoryex' ],
                //     ]
                // ],
            ],
            'scripts' => [
                // '/js/library/jquery/jquery.js' => [
                //     'name' => 'jquery',
                //     'exclude' => [
                //         //'post_ids'   => [ 00 ],
                //         //'post_types' => [ 'postex' ],
                //         //'taxonomys'  => [ 'categoryex' ],
                //     ],
                // ],
            ]
        ]
    ],
    'themes' => [
        'includes' => [
            'styles' => [
                '/public/css/mona-custom.css' => [
                    'name'  => 'mona-custom',
                    'media' => 'all'
                ],
            ],
            'scripts' => [
                '/public/scripts/mona-frontend.js' => [
                    'name' => 'frontend',
                ],
            ]
        ]
    ],
];