<?php 
require_once( get_template_directory() . CORE_PATH . '/config.php' );
require_once( get_template_directory() . ADMIN_PATH . '/class-mona-admin.php' );
require_once( get_template_directory() . ADMIN_PATH . '/class-mona-page-login.php' );
require_once( get_template_directory() . CORE_PATH . '/classes/class-mona-setup.php' );
require_once( get_template_directory() . CORE_PATH . '/classes/class-mona-core.php' );

spl_autoload_register(
    function ( $className ) {
        $classPath = get_template_directory() . MODELS_PATH . '/'.$className.'.php';
        if ( is_readable( $classPath ) ) {
            require_once( $classPath );
        }
    }
);

$moduleWidgets = glob( get_template_directory() . MODULE_PATH . '/widgets/*.php' );
foreach ( $moduleWidgets as $filePath ) {
    require_once( $filePath );
}

$ajaxFiles = glob( get_template_directory() . AJAX_PATH . '/*.php' );
foreach ( $ajaxFiles as $filePath ) {
    require_once( $filePath );
}

$ajaxFiles = glob( get_template_directory() . HELPER_PATH . '/*.php' );
foreach ( $ajaxFiles as $filePath ) {
    require_once( $filePath );
}
$ajaxFiles = glob( get_template_directory() . API_PATH . '/*.php' );
foreach ( $ajaxFiles as $filePath ) {
    require_once( $filePath );
}

// core theme
if ( class_exists ( 'MonaCore' ) ) {
    $Core = new MonaCore();
    $Core->load_core();
    CacheFile::init();
}
if ( class_exists ( 'ReactWeb' ) ) {
    $Core = new ReactWeb();
}


// admin setting
if ( class_exists ( 'MonaAdmin' ) ) {

    require_once( get_template_directory() . ADMIN_PATH . '/functions.php' );

    $includeFiles = glob( get_template_directory() . ADMIN_INCLUDES_PATH . '/*.php' );
    foreach ( $includeFiles as $filePath ) {
        require_once( $filePath );
    }

    $ajaxFiles = glob( get_template_directory() . ADMIN_AJAX_PATH . '/*.php' );
    foreach ( $ajaxFiles as $filePath ) {
        require_once( $filePath );
    }

    if ( is_admin() ) {
        $Admin = new MonaAdmin();
        $Admin->__init();
    }
   
}
