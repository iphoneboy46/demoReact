<!doctype html>
<html class="no-js" lang="">
<head>
    <!-- Meta ================================================== -->
    <title><?php wp_title('|', true, 'right'); ?></title>
    <meta name="description" content="<?php echo get_bloginfo('description'); ?>">
    <link rel="canonical" href="<?php the_permalink() ?>" />
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport"
        content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, width=device-width">
    <?php wp_site_icon(); ?>
    <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
    <!-- ========================= CSS here ========================= -->
    <link rel="stylesheet" href="<?php echo MONA_THEME_PATH ?>/public/css/comingsoon/bootstrap-4.5.0.min.css">
    <link rel="stylesheet" href="<?php echo MONA_THEME_PATH ?>/public/css/comingsoon/lineicons.css">
    <link rel="stylesheet" href="<?php echo MONA_THEME_PATH ?>/public/css/comingsoon/animate.css">
    <link rel="stylesheet" href="<?php echo MONA_THEME_PATH ?>/public/css/comingsoon/style.css">
</head>
<body>
    <main class="main-14">
        <div class="main-wrapper demo-14">
            <img src="<?php echo MONA_THEME_PATH ?>/public/images/comingsoon/shape-1.svg" alt="" class="shape shape-1">
            <img src="<?php echo MONA_THEME_PATH ?>/public/images/comingsoon/shape-2.svg" alt="" class="shape shape-2">
            <img src="<?php echo MONA_THEME_PATH ?>/public/images/comingsoon/shape-3.svg" alt="" class="shape shape-3">
            <img src="<?php echo MONA_THEME_PATH ?>/public/images/comingsoon/shape-4.svg" alt="" class="shape shape-4">
            <img src="<?php echo MONA_THEME_PATH ?>/public/images/comingsoon/shape-5.svg" alt="" class="shape shape-5">
            <img src="<?php echo MONA_THEME_PATH ?>/public/images/comingsoon/shape-6.svg" alt="" class="shape shape-6">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-xl-5 col-lg-6 col-md-6">
                        <div class="img-wrapper wow fadeInLeft" data-wow-delay=".2s">
                            <img src="<?php echo MONA_THEME_PATH ?>/public/images/comingsoon/img-1.svg" alt="">
                        </div>
                    </div>
                    <div class="col-xl-7 col-lg-6 col-md-6 odd-col">
                        <div class="content-wrapper">
                            <h1 class="wow fadeInDown" data-wow-delay=".2s"><?php echo (new MonaSettingComingSoon())->__field_value( 'title' ) ?></h1>
                            <p class="wow fadeInUp" data-wow-delay=".4s"><?php echo (new MonaSettingComingSoon())->__field_value( 'description' ) ?></p>
                            <?php 
                            $date_plus_days = strtotime('+5 days');
                            $dealine        = date( 'Y-m-d', $date_plus_days );
                            $dealineValue   = (new MonaSettingComingSoon())->__field_value( 'dealine', '' );
                            if ( ! empty ( $dealineValue ) ) {
                                $date           = new DateTime( $dealineValue );
                                $dealine = $date->format('Y/m/d');
                            }
                            ?>
                            <div class="wow fadeInLeft" data-wow-delay=".2s" data-countdown="<?php echo $dealine ?>"></div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </main>
    <script src="<?php echo MONA_THEME_PATH ?>/public/scripts/comingsoon/vendor/modernizr-3.5.0.min.js"></script>
    <script src="<?php echo MONA_THEME_PATH ?>/public/scripts/comingsoon/vendor/jquery-3.5.1.min.js"></script>
    <script src="<?php echo MONA_THEME_PATH ?>/public/scripts/comingsoon/popper.min.js"></script>
    <script src="<?php echo MONA_THEME_PATH ?>/public/scripts/comingsoon/bootstrap-4.5.0.min.js"></script>
    <script src="<?php echo MONA_THEME_PATH ?>/public/scripts/comingsoon/countdown.js"></script>
    <script src="<?php echo MONA_THEME_PATH ?>/public/scripts/comingsoon/wow.min.js"></script>
    <script src="<?php echo MONA_THEME_PATH ?>/public/scripts/comingsoon/main.js"></script>
</body>
</html>