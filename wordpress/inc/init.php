<?php
/**
 * Farm Factory Init
 *
 * @package Farm Factory
 */

/**
 * Init
 */
require FARMFACTORY_BASE_DIR . '/App/autoload.php';

/**
 * Functions
 */
require FARMFACTORY_PATH . 'inc/functions.php';

/**
 * Load pro functions if exists
 */
if ( farmfactory_does_pro_exist() ) {
	require FARMFACTORY_PATH . 'pro/init-pro.php';
}

/**
 * Enqueue Scripts
 */
require FARMFACTORY_PATH . 'inc/scripts.php';

/**
 * Shortcodes
 */
require FARMFACTORY_PATH . 'inc/shortcode.php';

/**
 * MetaBox
 */
require FARMFACTORY_PATH . 'inc/metabox.php';

/**
 * Post Type
 */
require FARMFACTORY_PATH . 'inc/post-type.php';
