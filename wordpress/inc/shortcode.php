<?php
/**
 * Shortcodes
 *
 * @package Farm Factory
 */

/**
 * Farm react-widget init div
 *
 * @param number $id Pos id.
 */

function farmfactory_reactwidget( $id ) {
  $out = "\n";
  $out.= "<script>\n";
  $out.= "    window.SO_FARM_FACTORY_ROOT = \"" . FARMFACTORY_URL . "\";\n";
  $out.= "    window.SO_FARM_FACTORY_NETWORK = \"" . get_option( 'farmfactory_networkName', 'sepolia' ) . "\";\n";
  $out.= "</script>\n";
  $out.= "<div \n";
  $out.= "    class=\"ff-farmfactory-widget\" \n";
  $out.= "    data-network-name=\"" . get_option( 'farmfactory_networkName', 'sepolia' ) . "\" \n";
  $out.= "    data-farm-address=\"" . get_post_meta( $id, 'farm_address', true ) . "\" \n";
  $out.= "    data-rewards-address=\"" . get_post_meta( $id, 'reward_address', true ) . "\" \n";
  $out.= "    data-staking-address=\"" . get_post_meta( $id, 'staking_address', true ) . "\" \n";
  $out.= "    data-rewards-token-icon=\"" . get_the_post_thumbnail_url( $id, 'medium' ) . "\" \n";
  $out.= "    data-staking-token-icon=\"" . wp_get_attachment_image_url( get_post_meta( $id, '_farm_thumbnail_id', true ), 'medium' ) . "\" \n";
  $out.= "></div>\n";
  
  return $out;
}
/**
 * Main Shortcode
 */
function farmfactory_main_shortcode( $atts ) {

	$atts = shortcode_atts( array(
		'id' => null,
	), $atts );

	$id             = $atts['id'];
	$html           = '';
	$farms          = wp_count_posts( 'farmfactory' )->publish;


	if ( null !== $id && get_post( $id ) ) {

    $html = farmfactory_reactwidget( $id );

	} elseif ( null === $id ) {

		$farm_args  = array(
			'post_type'      => 'farmfactory',
			'posts_per_page' => -1,
		);
		$farm_query = new WP_Query( $farm_args );

		if ( $farm_query->have_posts() ) :
			while ( $farm_query->have_posts() ) :
				$farm_query->the_post();
				$id = get_the_ID();

        $html .= farmfactory_reactwidget( $id );

			endwhile;
		endif;

		wp_reset_postdata();

	}

	return $html;
}
add_shortcode( 'farmfactory', 'farmfactory_main_shortcode' );

/**
 * Timer Shortcode
 */
function farmfactory_timer_shortcode() {
	return '<div id="farmfactory-timer-root"></div>';
}
add_shortcode( 'farmfactoryTimer', 'farmfactory_timer_shortcode' );

/**
 * Price Shortcode
 */
function farmfactory_price_shortcode( $attrs ) {
  $attrs = shortcode_atts( array(
    'address' => null,
    'network' => null
	), $attrs );

  return '<span data-farm-container="price" data-token="' . $attrs['address'] . '" data-network="' . $attrs['network'] .'" data-api-key="YdC2b3OQsjrbBaBrFO62rsI6idlLENgfBp0taq8Dvj7z35k9B3VamcXhIlS6rMFw">...</span>';
}
add_shortcode( 'farmfactoryPrice', 'farmfactory_price_shortcode' );
