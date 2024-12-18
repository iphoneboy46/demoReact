<?php
function mona_api_handle_login($request)
{
    $parameters = $request->get_json_params();
    $username = sanitize_text_field($parameters['username'] ?? '');
    $password = sanitize_text_field($parameters['password'] ?? '');

    if (empty($username)) {
        return new WP_REST_Response([
            'success' => false,
            'message' =>  __('Email/ Tên đăng nhập là bắt buộc.', 'monamedia'),
        ]);
    }
    if (empty($password)) {
        return new WP_REST_Response([
            'success' => false,
            'message' =>  __('Mật khẩu là bắt buộc.', 'monamedia'),
        ]);
    }

    $user = wp_authenticate($username, $password);

    if (is_wp_error($user)) {
        return new WP_REST_Response([
            'success' => false,
            'message' =>  __('Sai email hoặc mật khẩu.', 'monamedia'),
        ]);
    }
    $avatar_url = get_avatar_url($user->ID);

    $data  = [
        'user_id' => $user->ID,
        'user_role' => $user->roles,
        'avatar_url' => $avatar_url,

    ];
    // Generate a token for the user
    $token = create_token_by_user_login($username, $password);
    if (!$token) {
        return new WP_REST_Response([
            'success' => false,
            'message' => __('Đăng nhập thất bại.', 'monamedia'),
        ]);
    }
    // Merge token data with user data
    $data = array_merge($data, (array) $token);



    return new WP_REST_Response([
        'success' => true,
        'message' =>  __('Đăng nhập thành công.', 'monamedia'),
        'data' => $data
    ]);
}
