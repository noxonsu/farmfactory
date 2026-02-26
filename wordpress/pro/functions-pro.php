<?php
/**
 * Functions Pro
 * 
 * @package Envato API Functions
 */

/**
 * Hide admin tabs if no license.
 */
function farmfactory_admin_page_tabs_init( $tabs ){
	if ( ! get_option( 'farmfactory_purchase_code' ) ) {
		$tabs = array(
			'no-license' => esc_html__( 'No license', 'farmfactory' ),
		);
	}
	return $tabs;
}
add_filter( 'farmfactory_admin_page_tabs', 'farmfactory_admin_page_tabs_init' );

/**
 * Add content to no license admin tab.
 */
function farmfactory_admin_page_tab_custom( $content, $slug ){
	if ( 'no-license' === $slug ) {
		$license_page_url = admin_url( 'admin.php?page=farmfactory-license' );
		$content = '
			<div class="farmfactory-shortcode-panel-row">
				<h3>' . esc_html__( 'Please activate Farmfactory plugin license', 'farmfactory' ) . '</h3>
				<p><a href="' . esc_url( $license_page_url ) . '" class="button button-primary">' . esc_html__( 'Go to license page', 'farmfactory' ) . '</a></p>
			</div>
		';
	}
	return $content;
}
add_filter( 'farmfactory_admin_page_tab', 'farmfactory_admin_page_tab_custom', 10, 2 );

/**
 * Add content to no license front template.
 */
function farmfactory_front_template_message(){
	if ( ! get_option( 'farmfactory_purchase_code' ) ) {
		?>
		<h1><center><?php esc_html_e( 'Please activate Farmfactory plugin license', 'farmfactory' ); ?></center></h1>
		<?php
	}
}
add_action( 'farmfactory_footer', 'farmfactory_front_template_message' );

/**
 * Add license info to global window variables.
 */
function farmfactory_window_variable_license( $variables ){
	$variables['licenceInfo'] = farmfactory_support_days_left();
	return $variables;
}
add_filter( 'farmfactory_window_variables', 'farmfactory_window_variable_license', 10, 2 );

/**
 * Update Admin Page Footer info.
 */
function farmfactory_info_bar_custom_content( $content ) {
	$filename = FARMFACTORY_PATH . 'farmfactory.php';
	$update_time = gmdate( 'H\h : i\m : s\s', time() - filectime( $filename ) );
	$content = sprintf( esc_html__( 'Plugin version: %s | Updated: %s ago.', 'farmfactory' ), FARMFACTORY_VER, $update_time );
	return $content;
}
add_filter( 'farmfactory_info_bar_content', 'farmfactory_info_bar_custom_content' );

/**
 * Disable Design page if no license
 */
function farmfactory_disable_fee() {
	return false;
}
add_filter( 'farmfactory_disable_fee', 'farmfactory_disable_fee' );

/**
 * Disable Design page if no license
 */
function farmfactory_disable_if_no_license( $status ) {
	if ( ! get_option( 'farmfactory_purchase_code' ) ) {
		$status = true;
	}
	return $status;
}
add_filter( 'farmfactory_disable_desing_submenu', 'farmfactory_disable_if_no_license' );
add_filter( 'farmfactory_disable_banner', 'farmfactory_disable_if_no_license' );
add_filter( 'farmfactory_disable_front_template', 'farmfactory_disable_if_no_license' );

/**
 * Remove Blog - from wp title
 */
function farmfactory_wp_title( $title ){
	str_replace( 'Blog - ', '', $title );

	return $title;
}
add_filter( 'wp_title', 'farmfactory_wp_title', 10, 3 );
