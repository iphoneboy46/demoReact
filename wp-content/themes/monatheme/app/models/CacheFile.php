<?php
class CacheFile {

    private static $cache_dir;
    private static $max_cleanup_files = 100;
    private static $encryption_key;

    public static function init() {
        self::$cache_dir = get_template_directory() . '/app/cache/';
        self::$encryption_key = defined('WP_ENCRYPTION_KEY') ? WP_ENCRYPTION_KEY : die('Khóa mã hóa không được xác định.');
        if ( ! file_exists( self::$cache_dir ) ) {
            if (!mkdir( self::$cache_dir, 0755, true )) {
                die('Không tạo được thư mục bộ đệm');
            }
        }
    }

    public static function set( $key, $data, $duration = 3600 ) {
        $file = self::get_cache_file( $key );
        $data_to_store = array(
            'data' => $data,
            'expiry' => time() + $duration
        );

        $encrypted_data = self::encrypt(serialize( $data_to_store ));

        if (!file_exists(dirname($file))) {
            mkdir(dirname($file), 0755, true);
        }

        file_put_contents( $file, $encrypted_data );
    }

    public static function get( $key ) {
        self::cleanup(); 

        $file = self::get_cache_file( $key );

        if ( ! file_exists( $file ) ) {
            return false;
        }

        $encrypted_data = file_get_contents( $file );
        $data = unserialize(self::decrypt($encrypted_data));

        if ( time() > $data['expiry'] ) {
            unlink( $file );
            return false;
        }

        return $data['data'];
    }

    public static function delete( $key ) {
        $file = self::get_cache_file( $key );
        if ( file_exists( $file ) ) {
            unlink( $file );
            $dir = dirname( $file );
            if (is_dir($dir) && count(glob("$dir/*")) === 0) {
                rmdir($dir);
            }
        }
    }

    private static function get_cache_file( $key ) {
        $hash = md5( $key );
        $dir = self::$cache_dir . substr( $hash, 0, 6 ) . '/';
        if ( ! file_exists( $dir ) ) {
            mkdir( $dir, 0755, true );
        }
        return $dir . $hash . '.cache';
    }

    public static function cleanup() {
        $files = glob( self::$cache_dir . '**/*.cache', GLOB_BRACE );
        $now = time();
        $count = 0;

        foreach ( $files as $file ) {
            if ($count >= self::$max_cleanup_files) {
                break;
            }

            $data = unserialize(self::decrypt(file_get_contents( $file )));

            if ( $now > $data['expiry'] ) {
                unlink( $file );
            }
            $count++;
        }
    }

    private static function encrypt($data) {
        $iv_length = openssl_cipher_iv_length('aes-256-cbc');
        $iv = openssl_random_pseudo_bytes($iv_length);
        $encrypted = openssl_encrypt($data, 'aes-256-cbc', self::$encryption_key, 0, $iv);
        return base64_encode($iv . $encrypted);
    }

    private static function decrypt($data) {
        $data = base64_decode($data);
        $iv_length = openssl_cipher_iv_length('aes-256-cbc');
        $iv = substr($data, 0, $iv_length);
        $encrypted = substr($data, $iv_length);
        return openssl_decrypt($encrypted, 'aes-256-cbc', self::$encryption_key, 0, $iv);
    }
}
