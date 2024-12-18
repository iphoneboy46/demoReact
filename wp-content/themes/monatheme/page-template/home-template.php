<?php
/**
 * Template name: Trang chủ
 * @author : MONA.Media / Website
 */
get_header();
while ( have_posts() ):
    the_post();
    ?>
    <div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
            <div class="container">
                <div class="wrapper">
                    <div class="content">
                        <h1><?php the_title() ?></h1>
                        <p>Some Text Here</p>
                    </div>
                </div>
            </div>
		</main><!-- #main -->
	</div><!-- #primary -->
    <style>
    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 69vh;
        position: relative;
    }

    .content {
        font-family: montserrat;
        text-align: center;
    }

    .content h2 {
        text-transform: uppercase;
        font-size: 80px;
    }

    .content p {
        font-size: 45px;
    }

    .content a {
        text-decoration: none;
        color: #000;
        font-size: 20px;
        padding: 10px 20px;
        border: 2px solid #000;
        transition: 0.5s;
    }
    </style>
    <?php 
endwhile;
get_footer();