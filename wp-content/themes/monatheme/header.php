<?php 
/**
 * The template for displaying header.
 *
 * @package MONA.Media / Website
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) & !(IE 8)]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->

<head>
    <!-- Meta ================================================== -->
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, width=device-width">
    <?php wp_site_icon(); ?>
    <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
    <?php 
    wp_head(); ?>
</head>
<?php 
if ( wp_is_mobile() ) {
    $body = 'mobile-detect';
} else {
   $body = 'desktop-detect';
}
?>

<body <?php body_class( $body ); ?>>
   <header>
        <div class="sm-header">
            <p>Header content</p>
        </div>
   </header>
   <style>
    .sm-header {
        background-color: #595757;
        padding: 15px;
        margin: -8px;
    }

    .sm-header p {
        font-size: 24px;
        text-align: center;
        color: white;
        font-weight: bold;
    }
   </style>