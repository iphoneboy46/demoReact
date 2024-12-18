<?php
class ReactWeb
{
    private static $language = 'vi';
    private static $path = 'mona_react/v1';

    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes_react_web']);
    }

    public function register_routes_react_web()
    {
        $argsRegister = [
            'auth/user-login' => [
                'namespace' => $this::$path,
                'route'     => '/user-login',
                'options'   => [
                    'methods'  => 'POST',
                    'callback' => 'mona_api_handle_login',
                    'permission_callback' => '__return_true',
                ],


            ],
            'auth/user-forgot' => [
                'namespace' => $this::$path,
                'route'     => '/user-forgot',
                'options'   => [
                    'methods'  => 'POST',
                    'callback' => 'mona_api_handle_forgot',
                    'permission_callback' => '__return_true',
                ],


            ],
        ];
        if (!empty($argsRegister)) {
            foreach ($argsRegister as $file => $itemReg) {
                $filePath = get_template_directory() . '/app/api/' . $file . '.php';
               
                if (file_exists($filePath)) {

                    require_once($filePath);
                    register_rest_route($itemReg['namespace'], $itemReg['route'], $itemReg['options']);
                }
            }
        }
    }
}
new ReactWeb();
