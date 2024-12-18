<div class="mona-admin-toolbar">
    <a href="<?php echo MonaAdmin()->admin_url ?>" class="toolbar-logo">MONA.Media / Website</a>
    <?php 
    $menu_settings = get_admin_menu_tabs();
    if ( is_array ( $menu_settings ) ) {
    ?>
    <div class="toolbar-controls">
        <div class="toolbar-menus">
            <?php 
            foreach ( $menu_settings as $key => $class ) {
                if (  class_exists ( $class ) ) {
                    $callBack = (new $class());
                    echo sprintf( '<a class="'.$callBack->__classes().'" href="%1$s">%3$s %2$s</a>', $callBack->__link(), $callBack->__title(), $callBack->__icon() );
                }
            }
            ?>
        </div>
    </div>
    <?php } ?>
</div>