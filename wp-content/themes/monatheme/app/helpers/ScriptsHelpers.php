<?php 
function do_config_enqueue_scripts( $form = '' ) {
    if ( empty ( $form ) ) {
        return;
    }
    
    if ( $form == 'templates' ) {
        $url = MONA_SITE_TEMPLATE;
    } elseif ( $form == 'themes' ) {
        $url = MONA_THEME_PATH;
    }
    
    $incStyles = isset ( $GLOBALS['config'][$form]['includes'] ) ? $GLOBALS['config'][$form]['includes'] : [];
    if ( is_array ( $incStyles ) ) {
        foreach ( $incStyles as $key => $styles ) {
            switch ( $key ) {
                case 'styles':
                    if ( is_array ( $styles ) ) {
                        foreach ( $styles as $path => $value ) {
                            $ver  = isset ( $value['ver'] ) ? $value['ver'] : THEME_VERSION;
                            $deps = isset ( $value['deps'] ) ? $value['deps'] : [];
                            $media = isset ( $value['media'] ) ? $value['media'] : 'all';

                            if ( isset ( $value['exclude']['post_ids'] ) && ! empty ( $value['exclude']['post_ids'] ) ) {
                                if ( scripts_exclude_id( $value['exclude']['post_ids'] ) ) {
                                    continue;
                                }
                            }

                            if ( isset ( $value['exclude']['post_types'] ) && ! empty ( $value['exclude']['post_types'] ) ) {
                                if ( scripts_exclude_type( $value['exclude']['post_types'] ) ) {
                                    
                                    continue;
                                }
                            }

                            if ( is_tax() || is_category() || is_tag() ) {
                                if ( isset ( $value['exclude']['taxonomys'] ) && ! empty ( $value['exclude']['taxonomys'] ) ) {
                                    if ( scripts_exclude_tax( $value['exclude']['taxonomys'] ) ) {
                                        continue;
                                    }
                                }
                            }

                            wp_enqueue_style( 'mona-' . $value['name'], $url . $path, $deps, $ver, $media );
                        }
                    }
                    break;
                case 'scripts':
                    if ( is_array ( $styles ) ) {
                        foreach ( $styles as $path => $value ) {
                            $ver  = isset ( $value['ver'] ) ? $value['ver'] : THEME_VERSION;
                            $deps = isset ( $value['deps'] ) ? $value['deps'] : [];
                            $args = isset ( $value['args'] ) ? $value['args'] : true;

                            if ( isset ( $value['exclude']['post_ids'] ) && ! empty ( $value['exclude']['post_ids'] ) ) {
                                if ( scripts_exclude_id( $value['exclude']['post_ids'] ) ) {
                                    continue;
                                }
                            }

                            if ( isset ( $value['exclude']['post_types'] ) && ! empty ( $value['exclude']['post_types'] ) ) {
                                if ( scripts_exclude_type( $value['exclude']['post_types'] ) ) {
                                    continue;
                                }
                            }

                            if ( is_tax() || is_category() || is_tag() ) {
                                if ( isset ( $value['exclude']['taxonomys'] ) && ! empty ( $value['exclude']['taxonomys'] ) ) {
                                    if ( scripts_exclude_tax( $value['exclude']['taxonomys'] ) ) {
                                        continue;
                                    }
                                }
                            }

                            wp_enqueue_script( 'mona-' . $value['name'], $url . $path, $deps, $ver, $args );
                        }
                    }
                    break;
            }
        }
    }
}

function scripts_exclude_id( $excludes = [], $post_id = '' ) {
    if ( empty ( $excludes ) ) {
        return false;
    }

    if ( empty ( $post_id ) ) {
        $post_id = get_the_ID();
    }

    if ( in_array ( $post_id, $excludes ) ) {
        return true;
    } else {
        return false;
    }
}

function scripts_exclude_type( $excludes = [], $post_id = '' ) {
    if ( empty ( $excludes ) ) {
        return false;
    }

    if ( empty ( $post_id ) ) {
        $post_id = get_the_ID();
    }

    if ( is_home() ) {
        $post_id = MONA_PAGE_HOME;
    }

    $post_type = get_post_type( $post_id );
    if ( empty ( $post_type ) ) {
        return false;
    }

    if ( in_array ( $post_type, $excludes ) ) {
        return true;
    } else {
        return false;
    }
}

function scripts_exclude_tax( $excludes = [], $taxonomy = '' ) {
    if ( empty ( $excludes ) ) {
        return false;
    }

    if ( empty ( $taxonomy ) ) {
        $taxonomy = get_queried_object();
    }

    $tax_name = $taxonomy->taxonomy;
    if ( empty ( $tax_name ) ) {
        return false;
    }

    if ( in_array ( $tax_name, $excludes ) ) {
        return true;
    } else {
        return false;
    }
}
