<?php
function mona_api_handle_forgot($request)
{
    $parameters = $request->get_json_params();
    $email = sanitize_email($parameters['email'] ?? '');

    // Validate email
    if (empty($email)) {
        return new WP_REST_Response([
            'success' => false,
            'message' => __('Email là bắt buộc.', 'monamedia'),
        ], 400);
    }

    if (!is_email($email)) {
        return new WP_REST_Response([
            'success' => false,
            'message' => __('Địa chỉ email không hợp lệ.', 'monamedia'),
        ], 400);
    }

    // Check if the email belongs to a registered user
    $user = get_user_by('email', $email);
    if (!$user) {
        return new WP_REST_Response([
            'success' => false,
            'message' => __('Không tìm thấy người dùng với email này.', 'monamedia'),
        ], 404);
    }

    // Admin email
    $admin_email = get_option('admin_email');
    $subject = __('Yêu cầu cấp lại mật khẩu', 'monamedia');
    $message = sprintf(
        __("Yêu cầu cấp lại mật khẩu được gửi đến từ người dùng với email: %s.", 'monamedia'),
        $email
    );

    // Send email to admin
    $email_sent = wp_mail($admin_email, $subject, $message);

    if (!$email_sent) {
        return new WP_REST_Response([
            'success' => false,
            'message' => __('Không thể gửi email. Vui lòng thử lại sau.', 'monamedia'),
        ], 500);
    }

    return new WP_REST_Response([
        'success' => true,
        'message' => __('Yêu cầu đặt lại mật khẩu đã được gửi đến quản trị viên.', 'monamedia'),
    ], 200);
}
