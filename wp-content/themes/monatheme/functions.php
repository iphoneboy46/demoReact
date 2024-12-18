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