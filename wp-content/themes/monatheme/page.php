<?php
/**
 * The template for displaying page template.
 *
 * @package MONA.Media / Website
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
while ( have_posts() ):
    the_post();
    ?>
    <div id="primary" class="content-area">
        <main id="main" class="site-main" role="main">
            <?php the_content() ?>
        </main><!-- #main -->
    </div><!-- #primary -->
    <?php 
endwhile;
get_footer();
