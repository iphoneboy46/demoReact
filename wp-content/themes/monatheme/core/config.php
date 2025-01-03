<?php
// Đặt các header CORS cho phép các yêu cầu từ mọi nguồn
header("Access-Control-Allow-Origin: *");  // Cho phép từ mọi nguồn
header("Access-Control-Allow-Headers: *");  // Cho phép tất cả các header từ client gửi tới server
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");  // Cho phép các phương thức HTTP GET, POST, PUT, DELETE

// Các cấu hình khác trong $GLOBALS['config']
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
    // Kích hoạt GraphQL Debugging
    define( 'GRAPHQL_DEBUG', true )
];
?>
