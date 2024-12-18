<?php 
class MonaAdmin {

    public $version = THEME_VERSION;
    public $currentPage;
    public $admin_url;
    protected $menu    = MENU_FILTER_ADMIN;
    protected $setting = FILTER_ADMIN_SETTING;
    protected $pagehook;
    protected $callClass;

    public function __construct() 
    {
        // get current page
        $this->currentPage = isset ( $_GET['tab'] ) ? esc_attr( $_GET['tab'] ) : 'overview';
        // check empty method
        if ( $this->currentPage == '' ) {
            $this->currentPage = 'overview';
        }
        // set admin url
        $this->admin_url = get_admin_url() . 'themes.php?page=' . $this->menu;
        // class callback
        $this->callClass = $this->setting . ucfirst( $this->currentPage );
    }

	public function __init() 
    {
        // hook admin
        add_action( 'admin_menu', [ $this, 'register_submenu' ], 999 );
        add_action( 'admin_enqueue_scripts', [ $this, 'resgsiter_scripts' ] );
        add_action( 'admin_init', [ $this, 'register_settings' ] );
        add_action( 'init', [ $this, 'register_dashboard_widgets_seetings' ] );
	}

    public function register_admin_pages() 
    {
        return apply_filters( 'mona_theme_register_admin_pages',
            [
                'overview'    => $this->setting . 'Overview',
                'notfound'    => $this->setting . 'NotFound',
                'buttons'     => $this->setting . 'Buttons',
                'comingsoon'  => $this->setting . 'ComingSoon',
            ]
        );
    }

	public function register_submenu() 
    {
        global $current_user;
        if ( $current_user->user_login == 'monamedia' ) {
            add_submenu_page( 
                'themes.php', 
                __( 'Cài đặt', 'mona-admin' ), 
                __( 'Cài đặt', 'mona-admin' ), 
                'manage_options', $this->menu,  [ $this, 'resgsiter_template' ]
            );
        } else {
            remove_menu_page( 'tools.php' ); 
            remove_submenu_page( 'options-general.php', 'options-privacy.php' );  
            remove_submenu_page( 'index.php', 'update-core.php' );
            remove_all_actions( 'admin_notices' );
            add_filter('acf/settings/show_admin', '__return_false');
            remove_menu_page( 'plugins.php' ); 
            remove_submenu_page('options-general.php', 'kirki_settings');
            remove_submenu_page('options-general.php', 'svg-support');
        }
	}

    public function resgsiter_scripts() 
    {
        wp_enqueue_style( 'mona-style-global-template', get_template_directory_uri() . '/core/admin/assets/css/admin-global.css', array(), $this->version, 'all' );
        wp_enqueue_style( 'mona-style-toolbar-template', get_template_directory_uri() . '/core/admin/assets/css/admin-toolbar.css', array(), $this->version, 'all' );
        wp_enqueue_style( 'mona-style-styling-template', get_template_directory_uri() . '/core/admin/assets/css/admin-styling.css', array(), $this->version, 'all' );
        wp_enqueue_script( 'mona-script-global-template', get_template_directory_uri() . '/core/admin/assets/js/admin-global.js', array(), $this->version, true );
        // get enqueue scripts
        if ( class_exists ( $this->callClass ) ) {
            (new $this->callClass())->__resgsiter_scripts();
        }
        if ( get_current_screen()->id == 'appearance_page_mona-filter-admin' ) {
            $settings = wp_enqueue_code_editor( array( 'type' => 'text/x-php' ) );
            if ( $settings ) {
                wp_add_inline_script(
                    'code-editor',
                    sprintf(
                        'jQuery( function() { wp.codeEditor.initialize( "header_script", %s ); } );',
                        wp_json_encode( $settings )
                    )
                );
            }
        }
    }

    public function register_settings() 
    {
        if ( ! empty ( $admin_pages = $this->register_admin_pages() ) ) {
            foreach ( $admin_pages as $key => $className ) {
                if ( class_exists ( $className ) ) {
                    $callBack = (new $className());
                    if ( method_exists( (new $callBack()), '__resgsiter_settings' ) ) {
                        if ( class_exists( 'ACF' ) ) {
                            acf_form_head();
                        }
                        (new $callBack())->__resgsiter_settings();
                    }
                }
            }
        }
    }

	public function resgsiter_template() 
    {
        ?>
        <div id="mona-body-content">
            <?php
            // get header
            require_once( get_template_directory() . '/core/admin/partials/admin-header.php' );
            // get main content
            if ( class_exists ( $this->callClass ) ) {
                $callBack = (new $this->callClass());
                ?>
                <div class="mona-admin-headerbar">
                    <h1><?php echo $callBack->__title() ?></h1>
                </div>
                <div class="mona-admin-main">
                    <div class="wrap">
                        <form id="mona-form-settings" method="POST" action="<?php echo $callBack->__action() ?>">
                            <?php 
                            if ( method_exists( $callBack, '__option_page' ) ) {
                                $option_page = $callBack->__option_page();
                                // get input hidden
                                settings_fields( $option_page );
                                do_settings_sections( $option_page );
                                // call update / submit POST
                                $this->update_options();
                            }
                            ?>
                            <div id="mona-main-template">
                                <?php $callBack->__template() ?>
                            </div>
                            <?php 
                            // get footer
                            require_once( get_template_directory() . '/core/admin/partials/admin-footer.php' );
                            ?>
                        </form>
                    </div>
                </div>
                <?php 
            }
            ?>
        </div>
        <?php 
	}

    protected function update_options()
    {
        if ( isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] === 'POST' ) {
            if ( class_exists ( $this->callClass ) ) {
                $callBack = (new $this->callClass());
                $optionss = $callBack->__resgsiter_options();
                if ( is_array ( $optionss ) ) {
                    foreach ( $optionss as $key => $option ) {
                        update_option( $callBack->__option_name( $key ), $callBack->__get_submit_value( $key ) );
                    }
                }
            }
        }
    }

    public function register_dashboard_widgets_seetings()
    {
        add_action( 'wp_dashboard_setup', [ $this, 'get_dashboard_widgets_responses' ] );
    }

    public function get_dashboard_widgets_responses() {
        $curl = curl_init();
        curl_setopt_array( $curl, 
            [
                CURLOPT_URL            => 'https://mona-docs.monamedia.net/wp-json/dashboard-widgets/v1/regsiters',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING       => '',
                CURLOPT_MAXREDIRS      => 10,
                CURLOPT_TIMEOUT        => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST  => 'GET',
            ]
        );

        $response = curl_exec($curl);

        curl_close($curl);
        
        $regsiters = json_decode( $response );
        if ( ! empty ( $regsiters ) ) {
            foreach ( $regsiters->responses as $key => $widget ) {

                $callbackWidget = function() use ( $key, $widget ) {
                    ?>
                    <div class="customer-newfeeds-wrap">
                        <div class="community-events-header">
                            <div id="newfeeds-description" class="community-events"></div>
                        </div>
                        <div class="community-events-main">
                            <div class="wordpress-news">
                                <div class="rss-widget">
                                    <div id="newfeeds-posts" class="list-newfeeds"></div>
                                    <div id="newfeeds-paginations"></div>
                                </div>
                            </div>
                        </div>
                        <div class="community-events-footer">
                            <div id="newfeeds-tags"></div>
                        </div>
                    </div>
                    <script>
                    jQuery(document).ready(function($) {
                        const $dashboardContainer = $('#dashboard_widgets_column_<?php echo $key ?>');
                        if ( $dashboardContainer.length ) {
                            const pageIndex    = 1;
                            const categorySlug = 'CategoryId=<?php echo $widget->category ?>';
                            const apiUrl       = '<?php echo $widget->apiUrl ?>';
                            const homeUrl      = apiUrl + '?' + 'PageIndex=' + pageIndex + '&' + categorySlug;

                            // index data
                            fetchCustomerNewFeedsData($dashboardContainer, homeUrl, encodeURIComponent(homeUrl));

                            // pagination current page
                            $dashboardContainer.on('click', '#newfeeds-paginations a.page-numbers:not(a.next.page-numbers, a.prev.page-numbers)', function (e) {
                                e.preventDefault();
                                const $this       = $(this);
                                const currentPage = $this.text(); 
                                const pageUrl    = apiUrl + '?' + 'PageIndex=' + currentPage + '&' + categorySlug;
                                // load data
                                fetchCustomerNewFeedsData($dashboardContainer, pageUrl, encodeURIComponent(pageUrl));
                            });

                            // pagination prev page
                            $dashboardContainer.on('click', '#newfeeds-paginations a.prev.page-numbers', function (e) {
                                e.preventDefault();
                                const currentPage = jQuery('#newfeeds-paginations span.page-numbers.current').text();
                                const prevPage    = parseInt(currentPage, 10);
                                const pageUrl     = apiUrl + '?' + 'PageIndex=' + (prevPage - 1) + '&' + categorySlug;
                                // load data
                                fetchCustomerNewFeedsData($dashboardContainer, pageUrl, encodeURIComponent(pageUrl));
                            });

                            // pagination next page
                            $dashboardContainer.on('click', '#newfeeds-paginations a.next.page-numbers', function (e) {
                                e.preventDefault();
                                const currentPage = jQuery('#newfeeds-paginations span.page-numbers.current').text();
                                const nextPage    = parseInt(currentPage, 10);
                                const pageUrl     = apiUrl + '?' + 'PageIndex=' + (nextPage + 1) + '&' + categorySlug;
                                // load data
                                fetchCustomerNewFeedsData($dashboardContainer, pageUrl, encodeURIComponent(pageUrl));
                            });
                        }

                        function fetchCustomerNewFeedsData($dashboardContainer, apiUrl, cacheKey) {
                            // add loading
                            getPlaceholderContent($dashboardContainer);
                            fetch(apiUrl)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    if (isNewData(data, cacheKey)) {
                                        cacheData(data, cacheKey);
                                    }

                                    // get data
                                    handleCustomerNewFeedsResponse($dashboardContainer, data);
                                    // remove loading
                                    removePlaceholderContent($dashboardContainer);
                                })
                                .catch(error => {
                                    console.error('Error fetching data:', error);
                                });
                        }

                        function handleCustomerNewFeedsResponse($dashboardContainer, response) {
                            if (response && response.responses.description && response.responses.description.length > 0) { 
                                let htmlDescription = '';
                                const description = response.responses.description;
                                if ( description != '' ) {
                                    htmlDescription += `
                                        <div class="community-events-results activity-block last">
                                            <div class="event-none">${description}</div>
                                        </div>
                                    `;

                                    $dashboardContainer.find('#newfeeds-description').html(htmlDescription);
                                }
                            }

                            if (response && response.responses.posts && response.responses.posts.length > 0) {
                                let htmlItems = '';
                                const items = response.responses.posts;
                                items.forEach(item => {
                                    const postTitle   = item.post_title;
                                    const postExcerpt = item.post_excerpt;
                                    const postLink    = item.post_link;
                                    const postImage   = item.post_image;
                        
                                    htmlItems += `
                                        <div class="health-check-widget widget-newfeed-item">
                                            <div class="col-left newfeed-image">
                                                <a target="_blank" class="imgwidget" href="${postLink}">
                                                    <img width="70" height="70" src="${postImage}" alt="">
                                                </a>
                                            </div>
                                            <div class="col-right newfeed-details">
                                                <a target="_blank" class="rsswidget" href="${postLink}">${postTitle}</a>
                                                <div class="site-excerpt">${postExcerpt}</div>
                                            </div>
                                        </div>
                                    `;

                                    $dashboardContainer.find('#newfeeds-posts').html(htmlItems);
                                });
                            } else {
                                const html = `<div class="health-check-widget widget-newfeed-item data-empty">Nội dung sẽ sớm được cập nhật...</div>`;
                                $dashboardContainer.find('#newfeeds-posts').html(html);
                            }

                            if (response && response.responses.tags && response.responses.tags.length > 0) { 
                                let htmlTags = '';
                                const tags = response.responses.tags;
                                tags.forEach((tag, index) => {
                                    const tagLabel   = tag.label;
                                    const tagLink    = tag.link;
                                    const isLastItem = index === tags.length - 1;

                                    htmlTags += `
                                        <a href="${tagLink}" target="_blank">
                                            ${tagLabel}
                                            <span aria-hidden="true" class="dashicons dashicons-external"></span>
                                        </a> ${isLastItem ? '' : ' | '}
                                    `;

                                    $dashboardContainer.find('#newfeeds-tags').html(htmlTags);
                                });
                            }

                            if (response && response.responses.paginations && response.responses.paginations != '') { 
                                $dashboardContainer.find('#newfeeds-paginations').html(response.responses.paginations);
                            }
                        }

                        function isNewData(data, cacheKey) {
                            const cachedData = getCachedData(cacheKey);
                            if (cachedData && data.timestamp > cachedData.timestamp) {
                                return true;
                            }
                            return false;
                        }

                        function cacheData(data, cacheKey) {
                            localStorage.setItem(cacheKey, JSON.stringify(data));
                        }

                        function getCachedData(cacheKey) {
                            const cachedData = localStorage.getItem(cacheKey);
                            if (cachedData) {
                                return JSON.parse(cachedData);
                            }
                            return null;
                        }

                        function getPlaceholderContent($dashboardContainer) {
                            $dashboardContainer.find('#newfeeds-posts').addClass('loading');

                            let htmlPlaceholder = '';
                            for (let i = 0; i < 3; i++) {
                                htmlPlaceholder += `
                                    <div class="health-check-widget widget-newfeed-item">
                                        <div class="placeholder-content">
                                            <div class="placeholder-content_item"></div>
                                            <div class="placeholder-content_item"></div>
                                            <div class="placeholder-content_item"></div>
                                            <div class="placeholder-content_item"></div>
                                            <div class="placeholder-content_item"></div>
                                            <div class="placeholder-content_item"></div>
                                            <div class="placeholder-content_item"></div>
                                            <div class="placeholder-content_item"></div>
                                            <div class="placeholder-content_item"></div>
                                            <div class="placeholder-content_item"></div>
                                            <div class="placeholder-content_item"></div>
                                        </div>
                                    </div>
                                `;
                            }

                            $dashboardContainer.find('#newfeeds-posts').html(htmlPlaceholder);
                        }

                        function removePlaceholderContent($dashboardContainer) {
                            $dashboardContainer.find('#newfeeds-posts').removeClass('loading');
                        }
                    });
                    </script>
                    <?php 
                };

                wp_add_dashboard_widget( 
                    $widget->id, $widget->label, $callbackWidget, '', [], $widget->context, $widget->priority 
                );
            }
        }

    }

}