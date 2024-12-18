<?php 
add_action( 'cache_file_cleanup_cron', array( 'CacheFile', 'cleanup' ) );
if ( ! wp_next_scheduled( 'cache_file_cleanup_cron' ) ) {
    wp_schedule_event( time(), 'hourly', 'cache_file_cleanup_cron' );
}

add_action('switch_theme', function() {
    $timestamp = wp_next_scheduled( 'cache_file_cleanup_cron' );
    wp_unschedule_event( $timestamp, 'cache_file_cleanup_cron' );
});
