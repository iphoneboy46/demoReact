<?php
function create_token_by_user_login($username = '', $password = '')
{
    if (empty($username) || empty($password)) {
        return false; // Invalid input
    }

    $site_url  = get_option('siteurl');
    $endpoint  = $site_url . '/wp-json/jwt-auth/v1/token';

    $response = wp_remote_post($endpoint, [
        'body'    => json_encode([
            'username' => $username,
            'password' => $password,
        ]),
        'headers' => [
            'Content-Type' => 'application/json',
        ],
    ]);

    // Check if the request succeeded
    if (is_wp_error($response)) {
        return false; // Handle error
    }

    $status_code = wp_remote_retrieve_response_code($response);
    $body        = wp_remote_retrieve_body($response);

    // Parse response
    $decoded_response = json_decode($body);

    // Check for token response
    if ($status_code !== 200 || !isset($decoded_response->token)) {
        return false; // Invalid credentials or other issues
    }

    return $decoded_response;
}
