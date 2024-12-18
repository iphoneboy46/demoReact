<?php
add_action('after_setup_theme', 'add_after_setup_theme');
function add_after_setup_theme()
{
    // regsiter menu
    register_nav_menus(
        [
            'primary-menu' => __('Theme Main Menu', 'monamedia'),
        ]
    );
    // add size image
    // add_image_size( 'banner-desktop-image', 1920, 790, false );
    // add_image_size( 'banner-mobile-image', 400, 675, false );

    add_theme_support('woocommerce');
}

add_action('wp_enqueue_scripts', 'mona_add_styles_scripts');
function mona_add_styles_scripts()
{
    // loading template styles
    do_config_enqueue_scripts('templates');
    // loading themes styles
    do_config_enqueue_scripts('themes');
    // loading localize script
    wp_localize_script(
        'mona-frontend',
        'mona_ajax_url',
        [
            'ajaxURL'   => admin_url('admin-ajax.php'),
            'siteURL'   => get_site_url(),
            'ajaxNonce' => wp_create_nonce('mona-ajax-security'),
        ]
    );
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('bodhi_svgs_frontend_js');
}

add_filter('script_loader_tag', 'mona_add_module_to_my_script', 10, 3);
function mona_add_module_to_my_script($tag, $handle, $src)
{
    if (in_array($handle, array('mona-frontend', 'mona-main'))) {
        $tag = '<script type="module" src="' . esc_url($src) . '"></script>';
    }
    return $tag;
}

//add_action( 'wp_logout', 'mona_redirect_external_after_logout' );
function mona_redirect_external_after_logout()
{
    wp_redirect(get_the_permalink(MONA_PAGE_HOME));
    exit();
}

add_filter('pre_get_posts', 'mona_parse_request_post_type');
function mona_parse_request_post_type($query)
{
    if (! is_admin()) {
        $query->set('ignore_sticky_posts', true);
        $ptype = $query->get('post_type', true);
        $ptype = (array) $ptype;

        // if ( isset( $_GET['s'] ) ) {
        //     $ptype[] = 'post';
        //     $query->set('post_type', $ptype);
        //     $query->set( 'posts_per_page' , 12);
        // }

        // if ( $query->is_main_query() && $query->is_tax( 'category_library' ) ) {
        //     $ptype[] = 'mona_library';
        //     $query->set('post_type', $ptype);
        //     $query->set('posts_per_page', 12);
        // }

    }
    return $query;
}

// add_action( 'widgets_init', 'mona_register_sidebars' );
// function mona_register_sidebars() {
//     register_sidebar( 
//         [
//             'id'            => 'footer_column1',
//             'name'          => __( 'Footer Column 1', 'mona-admin' ),
//             'description'   => __( 'Nội dung widget.', 'mona-admin' ),
//             'before_widget' => '<div id="%1$s" class="widget footer-menu-item footer-menu-item-first %2$s">',
//             'after_widget'  => '</div>',
//             'before_title'  => '<h3 class="head mona-widget-title">',
//             'after_title'   => '</h3>',
//         ]
//     );
// }

add_filter('display_post_states', 'mona_add_post_state', 10, 2);
function mona_add_post_state($post_states, $post)
{
    if ($post->ID == MONA_PAGE_HOME) {
        $post_states[] = __('PAGE - Trang chủ', 'mona-admin');
    }
    if ($post->ID == MONA_PAGE_BLOG) {
        $post_states[] = __('PAGE - Trang Tin tức', 'mona-admin');
    }
    return $post_states;
}

//add_filter( 'get_custom_logo', 'mona_change_logo_class' );
function mona_change_logo_class($html)
{
    $custom_logo_id = get_theme_mod('custom_logo');
    $html           = sprintf(
        '<a href="%1$s" class="header-icon" rel="home" itemprop="url"><div class="icon">%2$s</div></a>',
        esc_url(home_url()),
        wp_get_attachment_image(
            $custom_logo_id,
            'full',
            false,
            [
                'class'  => 'header-logo-image',
            ]
        )
    );
    return $html;
}

add_filter('admin_url', 'mona_filter_admin_url', 999, 3);
function mona_filter_admin_url($url, $path, $blog_id)
{
    if ($path === 'admin-ajax.php' && ! is_admin()) {
        $url .= '?mona-ajax';
    }
    return $url;
}

add_filter('wp_get_attachment_image_attributes', 'mona_image_remove_attributes');
function mona_image_remove_attributes($attr)
{
    unset($attr['sizes']);
    return $attr;
}

add_action('wp_footer', 'mona_filter_front_footer');
function mona_filter_front_footer()
{
    echo '<div id="mona-toast"></div>';
    (new MonaSettingButtons())->__front_template();
}

add_filter('post_thumbnail_html', 'mona_set_post_thumbnail_default', 20, 5);
function mona_set_post_thumbnail_default($html, $post_id, $post_thumbnail_id, $size, $attr)
{
    if (empty($html)) {
        return wp_get_attachment_image(MONA_CUSTOM_LOGO, 'full', "", ['class' => 'cg-image-default']);
    }
    return $html;
}
add_action('admin_init', function () {
    // Redirect any user trying to access comments page
    global $pagenow;

    if ($pagenow === 'edit-comments.php') {
        wp_safe_redirect(admin_url());
        exit;
    }

    // Remove comments metabox from dashboard
    remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');

    // Disable support for comments and trackbacks in post types
    foreach (get_post_types() as $post_type) {
        if (post_type_supports($post_type, 'comments')) {
            remove_post_type_support($post_type, 'comments');
            remove_post_type_support($post_type, 'trackbacks');
        }
    }
});

// Close comments on the front-end
add_filter('comments_open', '__return_false', 20, 2);
add_filter('pings_open', '__return_false', 20, 2);

// Hide existing comments
add_filter('comments_array', '__return_empty_array', 10, 2);

// Remove comments page in menu
add_action('admin_menu', function () {
    remove_menu_page('edit-comments.php');
});

// Remove comments links from admin bar
add_action('init', function () {
    if (is_admin_bar_showing()) {
        remove_action('admin_bar_menu', 'wp_admin_bar_comments_menu', 60);
    }
});

/**
 * Add offset pagination to products.
 */
// function theme_prefix_add_offset_pagination_to_products() {
// 	register_graphql_field(
// 		'RootQueryToProductConnectionWhereArgs',
// 		'offsetPagination',
// 		array(
// 			'type'        => 'OffsetPagination',
// 			'description' => 'Paginate content nodes with offsets',
// 		)
// 	);
// }
// add_action( 'graphql_register_types', 'theme_prefix_add_offset_pagination_to_products' );
/**
 * Add offset pagination to products.
 */
function theme_prefix_add_offset_pagination_to_products()
{
    register_graphql_field(
        'RootQueryToProductUnionConnectionWhereArgs',
        'offsetPagination',
        array(
            'type'        => 'OffsetPagination',
            'description' => 'Paginate content nodes with offsets',
        )
    );
}
add_action('graphql_register_types', 'theme_prefix_add_offset_pagination_to_products');
/**
 * Add offset pagination to products.
 *
 * @param array $query_args query args.
 * @param array $where_args where query args.
 */
function theme_prefix_filter_map_offset_to_wp_query_args(
    array $query_args,
    array $where_args
) {
    if (isset($where_args['offsetPagination']['offset'])) {
        $query_args['offset'] = $where_args['offsetPagination']['offset'];
    }
    if (isset($where_args['offsetPagination']['size'])) {
        $query_args['posts_per_page'] =
            intval($where_args['offsetPagination']['size']) + 1;
    }
    return $query_args;
}
add_filter('graphql_map_input_fields_to_product_query', 'theme_prefix_filter_map_offset_to_wp_query_args', 10, 2);
// function theme_prefix_add_status_filter_to_products()
// {
//     register_graphql_field(
//         'RootQueryToProductUnionConnectionWhereArgs',
//         'statuses', // Adding 'statuses' filter
//         [
//             'type'        => ['list_of' => 'String'], // Accepts an array of statuses
//             'description' => __('Filter products by post statuses', 'monamedia'),
//         ]
//     );
// }
// add_action('graphql_register_types', 'theme_prefix_add_status_filter_to_products');

// /**
//  * Add statuses filter to product queries.
//  *
//  * @param array $query_args WP_Query args.
//  * @param array $where_args GraphQL where args.
//  * @return array Modified query args.
//  */
// function theme_prefix_filter_map_statuses_to_wp_query_args(
//     array $query_args,
//     array $where_args
// ) {
//     // Add statuses filter if provided
//     if (isset($where_args['statuses']) && is_array($where_args['statuses'])) {
//         $query_args['post_status'] = $where_args['statuses']; // Filter by specified statuses
//     }
//     echo '<pre>';
//     print_r($query_args);
//     echo '</pre>';
//     return $query_args;
// }
// add_filter(
//     'graphql_map_input_fields_to_product_query',
//     'theme_prefix_filter_map_statuses_to_wp_query_args',
//     10,
//     2
// );
