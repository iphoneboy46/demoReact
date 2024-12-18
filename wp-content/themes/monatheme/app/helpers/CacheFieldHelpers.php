<?php 
function get_cached_acf_field( $fieldName = '', $post_id = false, $formatValue = true ) {

    if ( empty ( $fieldName ) ) {
        return;
    }

    if ( empty ( $post_id ) ) {
        $post_id = get_the_ID();
    }

    $cached     = CachedField::getInstance();
    $cacheValue = $cached->get( $fieldName );

    if ( $cacheValue === false ) {
        $cacheValue = get_field( $fieldName, $post_id, $formatValue );
        $cached->set( $fieldName, $cacheValue, 300 );
    }

    return apply_filters( "change_cached_field_{$fieldName}", $cacheValue, $post_id );
}

function get_cached_meta_field( $fieldName = '', $post_id = false ) {

    if ( empty ( $fieldName ) ) {
        return;
    }

    if ( empty ( $post_id ) ) {
        $post_id = get_the_ID();
    }

    $cached     = CachedField::getInstance();
    $cacheValue = $cached->get( $fieldName );

    if ( $cacheValue === false ) {
        $cacheValue = get_post_meta( $post_id, $fieldName, true );
        $cached->set( $fieldName, $cacheValue, 300 );
    }

    return apply_filters( "change_cached_field_{$fieldName}", $cacheValue, $post_id );
}

add_action( 'save_post', 'cached_delete_to_update_post' );
function cached_delete_to_update_post( $post_id ) {

    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }

	if ( ! current_user_can( 'manage_options' ) ) {
		return $post_id;
	}

    // quăng field muốn update lại cache vào đây
    // $cached = CachedField::getInstance();
    // $cached->delete();

}
