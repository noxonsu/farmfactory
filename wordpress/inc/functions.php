<?php
/**
 * Functions
 *
 * @package Farm Factory
 */

/**
 * Get default Infura ID
 */
function farmfactory_default_infura_id() {
	return '8043bb2cf99347b1bfadfb233c5325c0';
}

/**
 * Check pro functions exists
 */
function farmfactory_does_pro_exist() {
	$farmfactory_pro_path = FARMFACTORY_PATH . 'pro/init-pro.php';

	return file_exists( $farmfactory_pro_path );
}
