<?php
/**
 * The template for displaying index.
 *
 * @package MONA.Media / Website
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// efine acf
if ( get_current_user_id() == 1 ) {
    define( 'ACF_LITE', false );
} else {
    define( 'ACF_LITE', true );
}

define( 'MONA_THEME_PATH', get_template_directory_uri() );
define( 'MONA_SITE_URL', get_option( 'siteurl' ) );
define( 'MONA_SITE_TEMPLATE', MONA_SITE_URL . '/template' );

define( 'APP_PATH', '/app' );
define( 'MODELS_PATH', APP_PATH . '/models' );
define( 'AJAX_PATH', APP_PATH . '/ajax' );
define( 'HELPER_PATH', APP_PATH . '/helpers' );
define( 'MODULE_PATH', APP_PATH . '/modules' );
define( 'API_PATH', APP_PATH . '/api' );

define( 'CORE_PATH', '/core' );
define( 'FILES_PATH', '/partials' );
define( 'ADMIN_PATH', CORE_PATH . '/admin' );
define( 'ADMIN_INCLUDES_PATH', ADMIN_PATH . '/includes' );
define( 'ADMIN_AJAX_PATH', ADMIN_PATH . '/ajax' );

define( 'THEME_VERSION', '4.3.7' );
define( 'MENU_FILTER_ADMIN', 'mona-filter-admin' );
define( 'FILTER_ADMIN_SETTING', 'MonaSetting' );

// define theme page
define( 'MONA_PAGE_HOME', get_option( 'page_on_front', true ) );
define( 'MONA_PAGE_BLOG', get_option( 'page_for_posts', true ) );
define( 'MONA_CUSTOM_LOGO', get_theme_mod('custom_logo') );
define( 'WP_ENCRYPTION_KEY', '1c2c47443b77eb1205cb5f03166b03f46b107ac57698946f776cb6b581d6ac1f' );

// Woocommerce
define( 'MONA_WC_PRODUCTS', get_option( 'woocommerce_shop_page_id' ) );
define( 'MONA_WC_CART', get_option( 'woocommerce_cart_page_id' ) );
define( 'MONA_WC_CHECKOUT', get_option( 'woocommerce_checkout_page_id' ) );
define( 'MONA_WC_MYACCOUNT', get_option( 'woocommerce_myaccount_page_id' ) );
define( 'MONA_WC_THANKYOU', get_option( 'woocommerce_thanks_page_id' ) );

require_once( get_template_directory() . '/__autoload.php' );



add_action('init', function() {
    register_taxonomy( 'product_tag', 'product', [
        'labels'  => [
            'name'              => __( 'Product Tags', 'your-textdomain' ),
            'singular_name'     => __( 'Product Tag', 'your-textdomain' ),
            'menu_name'         => __( 'Product Tags', 'your-textdomain' ),
        ],
        'show_in_graphql' => true,  // Đảm bảo hiển thị trong GraphQL
        'graphql_single_name' => 'productTag',  // Tên duy nhất trong GraphQL
        'graphql_plural_name' => 'productTags', // Tên số nhiều trong GraphQL
        'rewrite' => [
            'slug' => 'product-tags',  // Slug URL nếu cần
            'with_front' => false,
        ],
    ]);
});

add_action('graphql_register_types', function () {
    // Đăng ký mutation addTagsToProduct
    register_graphql_mutation('addTagsToProduct', [
        'inputFields' => [
            'id' => [
                'type' => 'String',
                'description' => 'ID của sản phẩm cần cập nhật',
            ],
            'tagNames' => [
                'type' => ['list_of' => 'String'],
                'description' => 'Danh sách các tên thẻ cần thêm vào sản phẩm',
            ],
        ],
        'outputFields' => [
            'product' => [
                'type' => 'WooCommerceProduct',
                'description' => 'Sản phẩm đã được cập nhật với thẻ mới',
                'resolve' => function ($payload) {
                    return $payload['product'];
                },
            ],
        ],
        'mutateAndGetPayload' => function ($input, $context, $info) {
            // Kiểm tra quyền người dùng
            if (!current_user_can('manage_product_terms')) {
                throw new \GraphQL\Error\UserError('Bạn không có quyền tạo thẻ sản phẩm.');
            }

            $product_id = $input['id'] ?? null;
            $tag_names = $input['tagNames'] ?? null;

            // Kiểm tra đầu vào hợp lệ
            if (empty($product_id) || empty($tag_names) || !is_array($tag_names)) {
                throw new \GraphQL\Error\UserError('Invalid input: id and tagNames are required.');
            }

            $product = wc_get_product($product_id);
            if (!$product || !is_a($product, 'WC_Product')) {
                throw new \GraphQL\Error\UserError('Invalid product ID or product not found.');
            }

            // Lấy các term của sản phẩm hiện tại
            $existing_terms = wp_get_post_terms($product_id, 'product_tag', ['fields' => 'ids']);
            
            // Danh sách ID thẻ để thêm vào sản phẩm
            $tag_ids = [];
            foreach ($tag_names as $tag_name) {
                $tag_name = trim(strtolower($tag_name)); // Chuẩn hóa tên thẻ

                // Kiểm tra thẻ có tồn tại trong product_tag không
                $existing_term = get_term_by('name', $tag_name, 'product_tag');
                if ($existing_term) {
                    // Nếu thẻ đã tồn tại, kiểm tra xem nó đã được gán cho sản phẩm chưa
                    if (!in_array($existing_term->term_id, $existing_terms)) {
                        $tag_ids[] = $existing_term->term_id; // Thêm thẻ vào sản phẩm
                    }
                } else {
                    // Nếu thẻ chưa tồn tại, tạo mới thẻ và thêm vào sản phẩm
                    $term = wp_insert_term($tag_name, 'product_tag');
                    if (is_wp_error($term)) {
                        // Nếu có lỗi, ghi lại thông báo lỗi
                        error_log('Error creating term: ' . $term->get_error_message());
                        continue; // Tiếp tục với các thẻ khác
                    }
                    $tag_ids[] = $term['term_id']; // Thêm ID của thẻ mới vào sản phẩm
                }
            }

            // Gán các thẻ vào sản phẩm, tránh thêm trùng
            if (!empty($tag_ids)) {
                wp_set_object_terms($product_id, array_merge($existing_terms, $tag_ids), 'product_tag', true);
            }

            return [
                'product' => $product,
            ];
        },
    ]);

    // Đăng ký WooCommerceProduct để trả về thông tin sản phẩm
    register_graphql_object_type('WooCommerceProduct', [
        'description' => 'WooCommerce Product object',
        'fields' => [
            'id' => [
                'type' => 'String',
                'resolve' => function ($product) {
                    return method_exists($product, 'get_id') ? $product->get_id() : null;
                },
            ],
            'title' => [
                'type' => 'String',
                'resolve' => function ($product) {
                    return method_exists($product, 'get_title') ? $product->get_title() : null;
                },
            ],
            'terms' => [
                'type' => [
                    'list_of' => 'Term',
                ],
                'args' => [
                    'where' => [
                        'type' => 'TermsWhereInput',
                        'description' => 'Filter terms by taxonomies',
                    ],
                ],
                'resolve' => function ($product, $args, $context, $info) {
                    $taxonomies = $args['where']['taxonomies'] ?? 'product_tag';
                    $terms = wp_get_post_terms($product->get_id(), $taxonomies);

                    return array_map(function ($term) {
                        return [
                            'id' => $term->term_id,
                            'name' => $term->name,
                        ];
                    }, $terms);
                },
            ],
        ],
    ]);

    // Đăng ký đối tượng Term để mô tả thông tin thẻ
    register_graphql_object_type('Term', [
        'description' => 'A term for a taxonomy',
        'fields' => [
            'id' => [
                'type' => 'String',
            ],
            'name' => [
                'type' => 'String',
            ],
        ],
    ]);

    // Đăng ký TermsWhereInput để lọc term theo taxonomy
    register_graphql_input_type('TermsWhereInput', [
        'description' => 'Filter input for terms',
        'fields' => [
            'taxonomies' => [
                'type' => 'String',
                'description' => 'Taxonomy to filter terms',
            ],
        ],
    ]);

    // Đăng ký mutation removeTagsFromProduct
    register_graphql_mutation('removeTagsFromProduct', [
        'inputFields' => [
            'id' => [
                'type' => 'String',
                'description' => 'ID của sản phẩm cần cập nhật',
            ],
            'tagIds' => [
                'type' => ['list_of' => 'String'], // Sửa thành danh sách chuỗi
                'description' => 'Danh sách các ID thẻ cần xóa khỏi sản phẩm',
            ],
        ],
        'outputFields' => [
            'product' => [
                'type' => 'WooCommerceProduct',
                'description' => 'Sản phẩm đã được cập nhật với các thẻ đã xóa',
                'resolve' => function ($payload) {
                    return $payload['product'];
                },
            ],
        ],
        'mutateAndGetPayload' => function ($input, $context, $info) {
            $product_id = $input['id'] ?? null;
            $tag_ids = $input['tagIds'] ?? null;

            // Kiểm tra đầu vào hợp lệ
            if (empty($product_id) || empty($tag_ids) || !is_array($tag_ids)) {
                throw new \GraphQL\Error\UserError('Invalid input: id and tagIds are required.');
            }

            $product = wc_get_product($product_id);
            if (!$product || !is_a($product, 'WC_Product')) {
                throw new \GraphQL\Error\UserError('Invalid product ID or product not found.');
            }

            // Lấy các term của sản phẩm hiện tại
            $existing_terms = wp_get_post_terms($product_id, 'product_tag', ['fields' => 'ids']);

            // Xóa các thẻ khỏi sản phẩm
            $remaining_terms = array_diff($existing_terms, $tag_ids);

            // Gán lại các thẻ cho sản phẩm sau khi xóa
            if (!empty($remaining_terms)) {
                wp_set_object_terms($product_id, $remaining_terms, 'product_tag');
            } else {
                // Gỡ bỏ tất cả thẻ nếu không còn thẻ nào
                wp_set_object_terms($product_id, [], 'product_tag');
            }
            
            return [
                'product' => $product,
            ];
        },
    ]);
});


//////////////////////////////////////////////


// add_action( 'graphql_register_types', function() {
//     register_graphql_field( 'RootQuery', 'productAttributes', [
//         'type'        => [ 'list_of' => 'AttributeTaxonomy' ],
//         'description' => __( 'Retrieve all product attribute taxonomies', 'your-text-domain' ),
//         'resolve'     => function() {
//             // Get all registered product attributes
//             $attribute_taxonomies = wc_get_attribute_taxonomies();

//             $result = [];

//             if ( ! empty( $attribute_taxonomies ) ) {
//                 foreach ( $attribute_taxonomies as $taxonomy ) {
//                     $result[] = [
//                         'name'        => $taxonomy->attribute_name,
//                         'label'       => $taxonomy->attribute_label,
//                         'slug'        => wc_attribute_taxonomy_name( $taxonomy->attribute_name ),
//                         'type'        => $taxonomy->attribute_type,
//                     ];
//                 }
//             }

//             return $result;
//         },
//     ]);

//     register_graphql_object_type( 'AttributeTaxonomy', [
//         'description' => __( 'Product attribute taxonomy', 'your-text-domain' ),
//         'fields'      => [
//             'name' => [
//                 'type'        => 'String',
//                 'description' => __( 'The name of the attribute taxonomy', 'your-text-domain' ),
//             ],
//             'label' => [
//                 'type'        => 'String',
//                 'description' => __( 'The label of the attribute taxonomy', 'your-text-domain' ),
//             ],
//             'slug' => [
//                 'type'        => 'String',
//                 'description' => __( 'The slug of the attribute taxonomy', 'your-text-domain' ),
//             ],
//             'type' => [
//                 'type'        => 'String',
//                 'description' => __( 'The type of the attribute taxonomy', 'your-text-domain' ),
//             ],
//         ],
//     ]);
// });


// add_action( 'graphql_register_types', function() {
//     register_graphql_field( 'RootQuery', 'productAttributes', [
//         'type'        => [ 'list_of' => 'AttributeTaxonomy' ],
//         'description' => __( 'Retrieve all product attribute taxonomies', 'your-text-domain' ),
//         'resolve'     => function() {
//             $attribute_taxonomies = wc_get_attribute_taxonomies(); // Lấy tất cả attribute taxonomies

//             $result = [];

//             if ( ! empty( $attribute_taxonomies ) ) {
//                 foreach ( $attribute_taxonomies as $taxonomy ) {
//                     // Lấy thông tin chi tiết về attribute
//                     $attribute = wc_get_attribute( $taxonomy->attribute_id );

//                     // Lấy options từ terms
//                     $terms = get_terms( [
//                         'taxonomy' => wc_attribute_taxonomy_name( $taxonomy->attribute_name ),
//                         'hide_empty' => false,
//                     ] );

//                     // Chuyển danh sách terms thành array options
//                     $options = [];
//                     if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
//                         foreach ( $terms as $term ) {
//                             $options[] = $term->name; // Lấy name của term làm option
//                         }
//                     }

//                     $result[] = [
//                         'name'     => $taxonomy->attribute_name,
//                         'label'    => $taxonomy->attribute_label,
//                         'slug'     => wc_attribute_taxonomy_name( $taxonomy->attribute_name ),
//                         'type'     => $taxonomy->attribute_type,
//                         'variation'=> (bool) $attribute->is_variation,
//                         'visible'  => (bool) $attribute->is_visible,
//                         'options'  => $options, // Trả về các options đã lấy từ terms
//                     ];
//                 }
//             }

//             return $result;
//         },
//     ]);

//     register_graphql_object_type( 'AttributeTaxonomy', [
//         'description' => __( 'Product attribute taxonomy', 'your-text-domain' ),
//         'fields'      => [
//             'name' => [
//                 'type'        => 'String',
//                 'description' => __( 'The name of the attribute taxonomy', 'your-text-domain' ),
//             ],
//             'label' => [
//                 'type'        => 'String',
//                 'description' => __( 'The label of the attribute taxonomy', 'your-text-domain' ),
//             ],
//             'slug' => [
//                 'type'        => 'String',
//                 'description' => __( 'The slug of the attribute taxonomy', 'your-text-domain' ),
//             ],
//             'type' => [
//                 'type'        => 'String',
//                 'description' => __( 'The type of the attribute taxonomy', 'your-text-domain' ),
//             ],
//             'variation' => [
//                 'type'        => 'Boolean',
//                 'description' => __( 'Is this attribute used for variations?', 'your-text-domain' ),
//             ],
//             'visible' => [
//                 'type'        => 'Boolean',
//                 'description' => __( 'Is this attribute visible on the product page?', 'your-text-domain' ),
//             ],
//             'options' => [
//                 'type'        => [ 'list_of' => 'String' ],
//                 'description' => __( 'Available options for this attribute', 'your-text-domain' ),
//             ],
//         ],
//     ]);
// });

