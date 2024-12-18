<?php 
if ( class_exists ( 'MonaAdmin' ) ) {
    class MonaSettingComingSoon extends MonaAdmin {

        protected $page = 'comingsoon';
    
        public function __resgsiter_scripts() 
        {
            // loading css
            wp_enqueue_style( 'mona-style-'.esc_attr( $this->page ).'-template', get_template_directory_uri() . '/core/admin/assets/css/admin-'.esc_attr( $this->page ).'.css', array(), $this->version, 'all' );
            // loading js
            wp_enqueue_script( 'mona-script-'.esc_attr( $this->page ).'-template', get_template_directory_uri() . '/core/admin/assets/js/admin-'.esc_attr( $this->page ).'.js', array(), $this->version, true );
            wp_localize_script( 'mona-script-'.esc_attr( $this->page ).'-template', 'mona_admin_ajax', 
                [
                    'ajaxURL'  => admin_url('admin-ajax.php'),
                    'adminURL' => get_admin_url(),
                    'siteURL'  => get_site_url(),
                ]
            );
        }

        public function __resgsiter_settings() 
        {
            $resgsiter_options = $this->__resgsiter_options();
            if ( ! empty ( $resgsiter_options ) ) {
                foreach ( $resgsiter_options as $key => $option ) {
                    register_setting( $this->__option_page(), $this->__option_name( $key ), $option ); 
                }
            }
        }

        public function __resgsiter_options()
        {
            return [
                'active' => [
                    'type'              => 'boolean', 
                    'sanitize_callback' => null,
                    'default'           => false,
                ],
                'title' => [
                    'type'              => 'string', 
                    'sanitize_callback' => 'sanitize_text_field',
                    'default'           => '',
                ],
                'description' => [
                    'type'              => 'string', 
                    'sanitize_callback' => 'sanitize_text_field',
                    'default'           => '',
                ],
                'dealine' => [
                    'type'              => 'string', 
                    'sanitize_callback' => 'sanitize_text_field',
                    'default'           => '',
                ],
                'disabledisadmin' => [
                    'type'              => 'boolean', 
                    'sanitize_callback' => null,
                    'default'           => true,
                ],
            ];
        }

        public function __title() 
        {
            return __( 'Coming Soon', 'mona-admin' );
        }

        public function __icon() 
        {
            return '<span class="dashicons dashicons-admin-tools"></span>';
        }

        public function __link() 
        {
            return esc_url( $this->admin_url ) . '&tab=' . $this->page;
        }

        public function __classes() 
        {
            // default class
            $classes = 'toolbar-menu-item';
            // check current page
            if ( $this->currentPage === $this->page ) {
                $classes .= ' current-page';
            }
            // result string class html
            return esc_attr( $classes );
        }

        public function __action()
        {
            return esc_url( $this->admin_url ) . '&tab=' . $this->page;
        }

        public function __field_name( $name = '' ) 
        {
            if ( empty ( $name ) ) {
                return;
            }
            // ressult string
            return $this->page . '['.esc_attr( $this->__get_key( $name ) ).']';
        }

        public function __field_value( $name = '', $default = false ) 
        {
            $cache_key   = $this->__option_name( $name );
            $cache_value = wp_cache_get( $cache_key, $this->__option_page() );
            if ( false === $cache_value ) { 
                $cache_value = get_option( $cache_key, $default );
                wp_cache_set( $cache_key, $cache_value, $this->__option_page(), HOUR_IN_SECONDS );
            }
            // ressult string
            return $cache_value;
        }

        public function __option_name( $name = '' ) 
        {
            if ( empty ( $name ) ) {
                return '';
            }
            return 'mona' . '_' . $this->page . '_' . $name;
        }

        public function __option_page() 
        {
            return 'mona' . '_' . $this->page;
        }

        public function __get_submit_value( $name = '' ) 
        {
            if ( empty ( $name ) ) {
                return false;
            }
            // get request
            return isset ( $_POST[$this->page][$this->__get_key( $name )] ) ? $_POST[$this->page][$this->__get_key( $name )] : '';
        }

        public function __get_reuqest_value( $name = '', $formdata = [] ) 
        {
            if ( empty ( $name ) ) {
                return false;
            }
            // get request
            return isset ( $formdata[$this->page][$this->__get_key( $name )] ) ? $formdata[$this->page][$this->__get_key( $name )] : '';
        }

        public function __get_key( $name = '' ) 
        {
            if ( empty ( $name ) ) {
                return '';
            }
            return esc_attr( $name );
        }

        public function __nonce_key() 
        {
            return $this->__option_page() . '-options';
        }
        
        public function __template() 
        {
            $active          = $this->__field_value( 'active', false );
            $title           = $this->__field_value( 'title', __( 'Coming Soon', 'mona-admin' ) );
            $description     = $this->__field_value( 'description', '' );
            $dealine         = $this->__field_value( 'dealine', '' );
            $disabledisadmin = $this->__field_value( 'disabledisadmin', true );
            ?>
            <div class="mona-row setN wrap-sticky">
                <div class="mona-col-xl full mona--adminComingSoon">
                    <div class="mona-card">
                        <div class="card-header">
                            <div class="card-title"><?php echo __( 'Cài đặt chung', 'mona-admin' ) ?></div>
                        </div>
                        <div class="card-body">
                            <div class="mona-row mona--subCard">
                                <div class="mona-col-xl">
                                    <div class="form-field">
                                        <?php 
                                        mona_render_field_settings(
                                            [
                                                'type'   => 'truefalse',
                                                'name'   => $this->__field_name( 'active' ),
                                                'id'     => $this->__field_name( 'active' ),
                                                'value'  => $active,
                                                'title'  => __( 'Kích hoạt', 'mona-admin' ),
                                                'docs'   => false,
                                            ]
                                        );
                                        mona_render_field_settings(
                                            [
                                                'type'   => 'text',
                                                'name'   => $this->__field_name( 'title' ),
                                                'id'     => $this->__field_name( 'title' ),
                                                'value'  => $title,
                                                'title'  => __( 'Tiêu đề', 'mona-admin' ),
                                                'docs'   => false,
                                            ]
                                        );
                                        mona_render_field_settings(
                                            [
                                                'type'   => 'textarea',
                                                'name'   => $this->__field_name( 'description' ),
                                                'id'     => $this->__field_name( 'description' ),
                                                'value'  => $description,
                                                'title'  => __( 'Mô tả ngắn', 'mona-admin' ),
                                                'docs'   => false,
                                            ]
                                        );
                                        ?>
                                        <div class="mona-widget-items render-field box-field-date">
                                            <div class="box-field-title">
                                                <label for="comingsoon[dealine]" class="txt-label field-date-label"><?php echo __( 'Dealine', 'mona-admin' ) ?></label>
                                            </div>
                                            <div class="box-field-content">
                                                <input type="date" class="mona-custom-widget ref-field-date" id="comingsoon[dealine]" name="comingsoon[dealine]" value="<?php echo $dealine ?>">
                                            </div>
                                        </div>
                                        <?php 
                                        mona_render_field_settings(
                                            [
                                                'type'   => 'truefalse',
                                                'name'   => $this->__field_name( 'disabledisadmin' ),
                                                'id'     => $this->__field_name( 'disabledisadmin' ),
                                                'value'  => $disabledisadmin,
                                                'title'  => __( 'Không hiển thị với vai trò Admin', 'mona-admin' ),
                                                'docs'   => false,
                                            ]
                                        );
                                        ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php 
        }
    }
}