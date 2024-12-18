<?php 
class CachedField {

    private static $instance;

    private $cachedFields = [];

    private function __construct()
    {
    }

    private function __clone()
    {
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new CachedField();
        }
        return self::$instance;
    }

    public function get( $cacheName = '' )
    {

        if ( empty ( $cacheName ) ) {
            return;
        }

        $cacheKey    = md5( $cacheName );
        $cache_group = 'cached_field';
        $cache_found = false;
        $cacheValue  = wp_cache_get( $cacheKey, $cache_group, false, $cache_found );

        if ( $cache_found && $cacheValue ) {
            return $cacheValue;
        }

        return false;
    }

    public function set( $cacheName = '', $cacheValue = '', $expire = false )
    {

        if ( empty ( $cacheName ) ) {
            return false;
        }

        $cacheKey    = md5( $cacheName );
        $cache_group = 'cached_field';
        
        if ( ! empty ( $cacheValue ) ) {
            wp_cache_set( $cacheKey, $cacheValue, $cache_group, $expire );
        }

        return true;
    }

    public function delete( $cacheName = '' )
    {
        if ( empty ( $cacheName ) ) {
            return false;
        }

        $cacheKey    = md5( $cacheName );
        $cache_group = 'cached_field';
        wp_cache_delete( $cacheKey, $cache_group );

        return true;
    }

}