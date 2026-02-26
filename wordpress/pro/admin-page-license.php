<?php
/**
 * Add License page to submenu
 */
function farmfactory_license_submenu_page() {
	add_submenu_page(
		'farmfactory',
		esc_html__( 'License', 'farmfactory' ),
		esc_html__( 'License', 'farmfactory' ),
		'manage_options',
		'farmfactory-license',
		'farmfactory_license_page',
		2
	);

	//call register settings function
	add_action( 'admin_init', 'farmfactory_register_settings_license' );
}
add_action('admin_menu', 'farmfactory_license_submenu_page', 11 );


function farmfactory_register_settings_license() {
	//register our settings
	register_setting( 'farmfactory-settings-license', 'farmfactory_purchase_code', 'farmfactory_sanitize_purchase_code' );
}

/**
 * Widget Page
 */
function farmfactory_license_page() {

?>

<div class="wrap">
	<h2><?php echo get_admin_page_title(); ?></h2>
	<?php settings_errors(); ?>

	<div class="farmfactory-welcome-panel">
		<div class="farmfactory-welcome-panel-content">

			<h3><?php esc_html_e( 'License Activation', 'farmfactory' ); ?></h3>
			<p><?php esc_html_e( 'To create, manage, and edit farms you must to have an activated license.', 'farmfactory' ); ?></p>
			<?php if ( get_option( 'farmfactory_purchase_code' ) ) { ?>
				<?php if ( farmfactory_is_supported() ) {
					$d = new DateTime( get_option( 'farmfactory_license_supported_until' ) );

					$date_until = $d->format( 'Y-m-d H:i'); // 012345
					?>
					<p><?php esc_html_e( 'Your support is valid until:', 'farmfactory' ); ?> <strong><?php echo esc_html( $date_until ); ?></strong></p>
				<?php } else { ?>
					<p><?php esc_html_e( 'Your support is expired, please renew the plugin license.', 'farmfactory' ); ?></p>
				<?php } ?>
			<?php } ?>

			<form method="post" action="options.php">

				<?php settings_fields( 'farmfactory-settings-license' ); ?>
				<?php do_settings_sections( 'farmfactory-settings-license' ); ?>

				<table class="form-table">
					<tbody>
						<tr>
							<th scope="row">
								<label><?php esc_html_e( 'Purchase Code', 'farmfactory' );?></label>
							</th>
							<td>
								<input name="farmfactory_purchase_code" type="text" class="regular-text" value="<?php echo esc_attr( get_option( 'farmfactory_purchase_code' ) );?>" placeholder="00000000-0000-0000-0000-000000000000">
							</td>
						</tr>
						<?php if ( ! get_option( 'farmfactory_purchase_code' ) ) { ?>
							<tr>
								<th scope="row">
									<label><?php esc_html_e( 'Your Email', 'farmfactory' );?></label>
								</th>
								<td>
									<input name="farmfactory_email" type="text" class="regular-text" value="<?php echo esc_attr( get_option( 'admin_email' ) );?>">
								</td>
							</tr>
						<?php } ?>
						<tr>
							<th scope="row"></th>
							<td>
								<?php
									$button_text = esc_attr__( 'Activate License', 'farmfactory' );
									if ( get_option( 'farmfactory_purchase_code' ) ) {
										$button_text = esc_attr__( 'Update License', 'farmfactory' );
									}
									submit_button( $button_text, 'primary', false );
								?>
							</td>
						</tr>
					</tbody>
				</table><!-- .form-table -->
			</form>

		</div>
	</div>
</div>

<?php
}
