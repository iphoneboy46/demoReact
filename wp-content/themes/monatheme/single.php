<?php
/**
 * The template for displaying single.
 *
 * @package MONA.Media / Website
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
while ( have_posts() ):
    the_post();
    mona_set_post_view();
    ?>
    <div id="primary" class="content-area">
        <main id="main" class="site-main" role="main">
            <?php the_content() ?>
            <?php comments_template() ?>
        </main><!-- #main -->
    </div><!-- #primary -->
    <?php
endwhile;
get_footer();