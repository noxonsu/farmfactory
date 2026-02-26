<?php
/**
 * Init Pro
 * 
 * @package Envato API Functions
 */

/**
 * Get License Info
 */
function farmfactory_get_license_info( $code = null, $email = '' ){

	$url = 'https://wallet.wpmix.net/wp-json/license/info?code=' . $code . '&email=' . $email . '&site=' . get_site_url();

	$response = wp_remote_get( $url,
		array(
			'headers' => array(
				'timeout' => 120,
			),
		)
	);

	$response = wp_remote_retrieve_body( $response );
	$response = json_decode( $response );

	$code = 'undefined';
	if ( isset( $response->code ) ) {
		$code = $response->code;
	}
	$return = array(
		'code' => strval( $code ),
	);

	if ( 'success' === $code ) {
		$return['sold_at']         = $response->sold_at;
		$return['supported_until'] = $response->supported_until;
	}

	return $return;
}

/**
 * Sanitize Purchase Code
 */
function farmfactory_sanitize_purchase_code( $code ){
	$code = trim( $code );

	if( empty( $code ) ) {
		$message = esc_html__( 'The purchase code must not be empty.', 'farmfactory' );
	} else {
		$message = esc_html__( 'Please enter a valid purchase code.', 'farmfactory' );
	}
	if ( preg_match("/^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i", $code ) ) {

		$email = '';
		if ( isset( $_POST['farmfactory_email'] ) && is_email( $_POST['farmfactory_email'] ) ) {
			$email = $_POST['farmfactory_email'];
		}

		$info = farmfactory_get_license_info( $code, $email );

		if ( '404' === $info['code'] ) {
			$message = esc_html__( 'Please enter a valid purchase code.', 'farmfactory' );
			add_settings_error( 'farmfactory_purchase_code', 'settings_updated', $message, 'error' );
			return;
		}

		if ( 'success' === $info['code'] ) {
			if ( isset( $info['sold_at'] ) ) {
				update_option( 'farmfactory_license_sold_at', $info['sold_at'] );
			}
			if ( isset( $info['supported_until'] ) ) {
				update_option( 'farmfactory_license_supported_until', $info['supported_until'] );
			}
		} else {
			delete_option( 'farmfactory_license_sold_at' );
			delete_option( 'farmfactory_license_supported_until' );
		}

		$message = esc_html__( 'Your license code has been successfully added.', 'farmfactory' );

		add_settings_error( 'farmfactory_purchase_code', 'settings_updated', $message, 'updated' );
		return $code;
	} else {
		delete_option( 'farmfactory_license_sold_at' );
		delete_option( 'farmfactory_license_supported_until' );
	}

	add_settings_error( 'farmfactory_purchase_code', 'settings_updated', $message, 'error' );
	return false;
}

/**
 * Validate Purchase Code
 */
function farmfactory_validate_purchase_code( $code ){
	if ( farmfactory_sanitize_purchase_code( $code ) ) {
		return true;
	}
	return false;
}

/**
 * If Support Has Expired
 */
function farmfactory_is_supported() {
	if ( get_option( 'farmfactory_license_supported_until' ) ) {

		$date_now   = new DateTime( 'NOW' );
		$date_until = new DateTime( get_option( 'farmfactory_license_supported_until' ) );
		$diff       = $date_now->diff( $date_until );
		if ( $diff->invert ) {
			return false;
		}
		return true;
	}
	return false;
}

/**
 * Get Support days left
 */
function farmfactory_support_days_left() {
	$left = 'false';

	if ( ! farmfactory_is_supported() ) {
		return $left;
	}

	$date_now   = new DateTime( 'NOW' );
	$date_until = new DateTime( get_option( 'farmfactory_license_supported_until' ) );
	$diff       = $date_now->diff( $date_until );

	if( isset( $diff->days ) && $diff->days ) {
		$left = $diff->days;
	}

	return $left;
}

/**
 * If Active License
 */
function farmfactory_is_active_license() {
	if ( get_option( 'farmfactory_purchase_code' ) ) {
		if ( ! farmfactory_is_supported() ) {
			return false;
		}
		return true;
	}
	return false;
}


function farmfactory_license_admin_notice() {

	if ( farmfactory_is_active_license() ) {
		return;
	}

	$screen = get_current_screen();
	if ( isset( $screen->id ) && ('admin_page_farmfactory-license' === $screen->id)  ) {
		return;
	}

	if ( get_option( 'farmfactory_purchase_code' ) && ! farmfactory_is_supported() ) {
		?>
		<div class="notice notice-warning">
			<p><?php echo sprintf ( esc_html__( 'Your license is expired. Expired license does not affect the Farmfactory functionality. %sLicense page%s.', 'farmfactory' ), '<a href="' . esc_url( admin_url( 'admin.php?page=farmfactory-license' ) ) . '">', '</a>' ); ?></p>
		</div>
		<?php
	} else {
		?>
		<div class="notice notice-error">
			<p><?php echo sprintf ( esc_html__( 'To create, manage, and edit farms you must to %sactivate the license%s.', 'farmfactory' ), '<a href="' . esc_url( admin_url( 'admin.php?page=farmfactory-license' ) ) . '">', '</a>' ); ?></p>
		</div>
		<?php
	}
}
add_action( 'admin_notices', 'farmfactory_license_admin_notice' );
