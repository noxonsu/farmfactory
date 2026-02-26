<?php
/**
 * MetaBoxes
 *
 * @package FarmFactory
 */

/**
 * Adds a meta box to post type farmfactory
 */
class FarmFactory_Meta_Box {

	/**
	 * Construct
	 */
	public function __construct() {

		if ( is_admin() ) {
			add_action( 'load-post.php', array( $this, 'init_metabox' ) );
			add_action( 'load-post-new.php', array( $this, 'init_metabox' ) );
		}

	}

	/**
	 * Init Metabox
	 */
	public function init_metabox() {

		add_action( 'add_meta_boxes', array( $this, 'add_metabox' ) );
		add_action( 'save_post', array( $this, 'save_metabox' ), 10, 2 );

	}

	/**
	 * Add Metabox
	 */
	public function add_metabox() {

		add_meta_box(
			'farmfactory_meta',
			esc_html__( 'Farm Factory Details', 'farmfactory' ),
			array( $this, 'render_metabox' ),
			'farmfactory',
			'normal',
			'high'
		);

		add_meta_box(
			'farmimagediv',
			esc_html__( 'Staking Token Icon', 'farmfactory' ),
			array( $this, 'render_thumbnail' ),
			'farmfactory',
			'side',
			'low'
		);

	}
	/**
	 * Render Metabox
	 *
	 * @param object $post Post.
	 */
	public function render_metabox( $post ) {

		/* Add nonce for security and authentication */
		wp_nonce_field( 'farmfactory_meta_action', 'farmfactory_meta_nonce' );

		// Retrieve an existing value from the database.
		$staking_address = get_post_meta( $post->ID, 'staking_address', true );
		$staking_token_name  = get_post_meta( $post->ID, 'staking_token_name', true );
		$staking_token_symbol  = get_post_meta( $post->ID, 'staking_token_symbol', true );
		$staking_decimals = get_post_meta( $post->ID, 'staking_decimals', true );
		$reward_address  = get_post_meta( $post->ID, 'reward_address', true );
		$reward_token_name  = get_post_meta( $post->ID, 'reward_token_name', true );
		$reward_token_symbol  = get_post_meta( $post->ID, 'reward_token_symbol', true );
		$reward_decimals = get_post_meta( $post->ID, 'reward_decimals', true );
		$reward_duration = get_post_meta( $post->ID, 'reward_duration', true );
		$farm_apy        = get_post_meta( $post->ID, 'farm_apy', true );
		$farm_apy_label  = get_post_meta( $post->ID, 'farm_apy_label', true );
		$network_name    = get_post_meta( $post->ID, 'network_name', true );
		$farm_address    = get_post_meta( $post->ID, 'farm_address', true );

		$configured_network_name = get_option( 'farmfactory_networkName', 'ropsten' );

		// Set default values.
		if ( empty( $staking_address ) ) $staking_address 				= ''; // phpcs:ignore
		if ( empty( $staking_token_name ) ) $staking_token_name   		= ''; // phpcs:ignore
		if ( empty( $staking_token_symbol ) ) $staking_token_symbol   	= ''; // phpcs:ignore
		if ( empty( $staking_decimals ) ) $staking_decimals 			= ''; // phpcs:ignore
		if ( empty( $reward_address ) ) $reward_address   				= ''; // phpcs:ignore
		if ( empty( $reward_token_name ) ) $reward_token_name   		= ''; // phpcs:ignore
		if ( empty( $reward_token_symbol ) ) $reward_token_symbol   	= ''; // phpcs:ignore
		if ( empty( $reward_decimals ) ) $reward_decimals 				= ''; // phpcs:ignore
		if ( empty( $reward_duration ) ) $reward_duration 				= ''; // phpcs:ignore
		if ( empty( $farm_apy ) ) $farm_apy               				= ''; // phpcs:ignore
		if ( empty( $farm_apy_label ) ) $farm_apy_label   				= 'APY'; // phpcs:ignore
		if ( empty( $network_name ) ) $network_name       				= $configured_network_name;
		if ( empty( $farm_address ) ) $farm_address       				= ''; // phpcs:ignore


		$not_uses_configured_network = ($network_name !== $configured_network_name);

		// Check farm status

		$has_staking_decimals = (
			!empty( $staking_decimals )
			or (
				$staking_decimals === '0'
				or $staking_decimals === 0
			)
		);

		$is_deployed_farm = ( !empty($farm_address) and !empty($reward_address) and !empty($staking_address) and $has_staking_decimals);

		$farm_status = $is_deployed_farm ? 'deployed' : 'setup';

		$should_activate_license = farmfactory_does_pro_exist() && ! get_option( 'farmfactory_purchase_code' );

		if ( $should_activate_license ) {
			$farm_status = 'activate_license';
		}

		// Farm details.
		?>

			<div class="farm-details">

		<?php
		switch ($farm_status) {
			case "activate_license":
				?>
					<h1>You have not an activated license key</h1>
					<p>
						To create, manage, and edit farms you must have an active license key.
					</p>
					<a
						class="button button-primary"
						href="<?php echo esc_url( admin_url( 'admin.php?page=farmfactory-license' ) ); ?>"
					>
						<?php echo esc_attr__('Go to the license page', 'farmfactory'); ?>
					</a>

					<input type="hidden" name="network_name" id="network_name" value="<?php echo esc_attr( $network_name ) ?>" />
					<input type="hidden" name="farm_address" id="farm_address" value="<?php echo esc_attr( $farm_address ) ?>" >
					<input type="hidden" name="reward_duration" id="reward_duration" value="<?php echo esc_attr( $reward_duration ); ?>">

					<input type="hidden" name="staking_address" value="<?php echo esc_attr( $staking_address ); ?>">
					<input type="hidden" name="staking_token_name" id="staking_token_name" value="<?php echo esc_attr( $staking_token_name ) ?>" />
					<input type="hidden" name="staking_token_symbol" id="staking_token_symbol" value="<?php echo esc_attr( $staking_token_symbol ) ?>" />
					<input type="hidden" name="staking_decimals" id="staking_decimals" value="<?php echo esc_attr( $staking_decimals ) ?>" />

					<input type="hidden" name="reward_address" value="<?php echo esc_attr( $reward_address ); ?>">
					<input type="hidden" name="reward_token_name" id="reward_token_name" value="<?php echo esc_attr( $reward_token_name ) ?>" />
					<input type="hidden" name="reward_token_symbol" id="reward_token_symbol" value="<?php echo esc_attr( $reward_token_symbol ) ?>" />
					<input type="hidden" name="reward_decimals" id="reward_decimals" value="<?php echo esc_attr( $reward_decimals ) ?>" />

				<?php
			  	break;
			case "setup":
				?>
					<h1>Setup farming</h1>
					<p>
						To start farming, you need to create it. At this stage you don't launch anything.
					</p>
					<p>
						Current network: <strong><?php echo esc_html__( $network_name ) ?></strong> (you can change it in "Staking settings")
						<input type="hidden" name="network_name" id="network_name" value="<?php echo esc_attr( $network_name ) ?>" />
					</p>
					<p>
						You need to have deployed Farm Contract to setup new Farming (this is the core contract, users will interact with it to stake tokens and claim rewards)
					</p>
					<input type="radio" id="deployNewFarm" name="setup_type" value="deployNewFarm" checked>
					<label for="deployNewFarm">Deploy new contract</label><br>
					<input type="radio" id="fetchExistsFarm" name="setup_type" value="fetchExistsFarm">
					<label for="fetchExistsFarm">I have deployed contract</label><br>
					<div id="deployNewFarmContainer">
						<table class="form-table">

							<tr>
								<th>
									<label><?php echo esc_html__( 'Staking erc20 Address', 'farmfactory' ); ?></label>
								</th>
								<td>
									<div class="farmfactory-form-inline">
										<input type="text" name="staking_address" id="stakingAddress" class="large-text" value="<?php echo esc_attr( $staking_address ); ?>">
										<a class="button button-secondary" id="farmfactory_fetch_staking_token_button"><?php echo esc_html__( 'Fetch', 'farmfactory' ) ?></a>
									</div>
									<p class="description"><?php echo sprintf( esc_html__( 'ERC20 address of token&#039;s contract which users will stake (deposit). Free test tokens %s.', 'farmfactory' ), '<a href="https://github.com/bokkypoobah/WeenusTokenFaucet" target="_blank">https://github.com/bokkypoobah/WeenusTokenFaucet</a>' ); ?></p>
								</td>
							</tr>

							<tr id="staking_token_info" <?php if (!$staking_decimals) echo ' style="display: none" '; ?>>
								<th>
									<label><?php echo esc_html__( 'Staking token info', 'farmfactory' ); ?></label>
								</th>
								<td>
									<strong id="staking_token_name_view"><?php if ($staking_token_name) echo esc_html__( $staking_token_name )?></strong>
									<strong id="staking_token_symbol_view"><?php if ($staking_token_symbol) echo esc_html__( ' (' . $staking_token_symbol . '). ' )?></strong>
									<strong id="staking_decimals_view"><?php echo 'Decimals: ' . esc_html__( $staking_decimals )?></strong>
									<input type="hidden" name="staking_token_name" id="staking_token_name" value="<?php echo esc_attr( $staking_token_name ) ?>" />
									<input type="hidden" name="staking_token_symbol" id="staking_token_symbol" value="<?php echo esc_attr( $staking_token_symbol ) ?>" />
									<input type="hidden" name="staking_decimals" id="staking_decimals" value="<?php echo esc_attr( $staking_decimals ) ?>" />
								</td>
							</tr>

							<tr>
								<th>
									<label><?php echo esc_html__( 'Rewarding Token Address', 'farmfactory' ); ?></label>
								</th>
								<td>
									<div class="farmfactory-form-inline">
										<input type="text" name="reward_address" id="rewardsAddress" class="large-text" value="<?php echo esc_attr( $reward_address ); ?>">
										<a class="button button-secondary" id="farmfactory_fetch_reward_token_button"><?php echo esc_html__( 'Fetch', 'farmfactory' ) ?></a>
									</div>
									<p class="description"><?php echo esc_html__( 'ERC20 address of reward token which users will earn. You can use the same as "Staking address".', 'farmfactory' ); ?></p>
								</td>
							</tr>

							<tr id="reward_token_info" <?php if (!$reward_decimals) echo ' style="display: none" '; ?>>
								<th>
									<label><?php echo esc_html__( 'Rewarding token info', 'farmfactory' ); ?></label>
								</th>
								<td>
									<strong id="reward_token_name_view"><?php if ($reward_token_name) echo esc_html__( $reward_token_name )?></strong>
									<strong id="reward_token_symbol_view"><?php if ($reward_token_symbol) echo esc_html__( ' (' . $reward_token_symbol . '). ' )?></strong>
									<strong id="reward_decimals_view"><?php echo 'Decimals: ' . esc_html__( $reward_decimals )?></strong>
									<input type="hidden" name="reward_token_name" id="reward_token_name" value="<?php echo esc_attr( $reward_token_name ) ?>" />
									<input type="hidden" name="reward_token_symbol" id="reward_token_symbol" value="<?php echo esc_attr( $reward_token_symbol ) ?>" />
									<input type="hidden" name="reward_decimals" id="reward_decimals" value="<?php echo esc_attr( $reward_decimals ) ?>" />
								</td>
							</tr>

							<tr>
								<th>
									<label><?php echo esc_html__( 'Reward Duration', 'farmfactory' ); ?></label>
								</th>
								<td>
									<input type="text" name="reward_duration" id="farmfactory_duration" class="large-text" value="<?php echo esc_attr( $reward_duration ); ?>">
									<p class="description"><?php echo sprintf( esc_html__( 'Enter _rewardsDuration - duration of staking round in seconds.%s 86400 - 1 day, 2592000 - 30 day, 31536000 - 1 year', 'farmfactory' ), '<br>' ); ?></p>
								</td>
							</tr>

							<tr>
								<th>
									<label><?php echo esc_html__( 'Farming Address', 'farmfactory' ); ?></label>
								</th>
								<td>
									<div class="farmfactory-form-inline">
										<strong id="farm_address_view"><?php if ( empty($farm_address) ) {echo esc_html__( 'Deployed farm contract address will be displayed here', 'farmfactory' ); } else { echo esc_attr( $farm_address );} ?></strong>
										<input type="hidden" name="farm_address" id="farm_address" value="<?php echo esc_attr( $farm_address ) ?>" >
										&nbsp;
										<a class="button button-secondary" id="farmfactory_deploy_button"><?php echo esc_html__( 'Deploy', 'farmfactory' ); ?></a>
									</div>
									<p class="desctiption"><?php echo esc_html__( 'Use "Deploy" button next to the field to create new Farm contract. After deployment address will be automatically placed in the field above', 'farmfactory' ); ?></p>
									<p class="desctiption" style="color: red;"><?php echo esc_html__( 'If you have Farm contract address then you need to use "I have deployed contract" setup way.', 'farmfactory' ); ?></p>
								</td>
							</tr>

						</table>
					</div>
					<div id="fetchExistsFarmContainer" style="display: none">
						<p class="desctiption" style="color: red;"><?php echo esc_html__( 'NOTE: please be sure that you fill Farm contract address! If you are not sure PLEASE USE "Deploy new contract" setup way!!! Otherwise, this may lead to incorrect operations of the program and you may lose your tokens!', 'farmfactory' ); ?></p>
						<table id="fetchingFarmContainer" class="form-table">

							<tr>
								<th>
									<label><?php echo esc_html__( 'Exist Farm Address', 'farmfactory' ); ?></label>
								</th>
								<td>
									<div class="farmfactory-form-inline">
										<input type="text" class="large-text" id="fetchingFarmAddress" name="fetchingFarmAddress" placeholder="Fill your existing farm contract here" >
										<a class="button button-secondary" id="fetchFarmContractButton"><?php echo esc_html__( 'Fetch', 'farmfactory' ) ?></a>
									</div>
								</td>
							</tr>

						</table>

						<table id="fetchedFarmContainer" class="form-table" style="display: none">

							<tr>
								<th>
									<label><?php echo esc_html__( 'Farm Contract Address', 'farmfactory' ); ?></label>
								</th>
								<td>
									<p class="farmfactory-fake-input" id="farmAddressView"></p>
									<input type="hidden" name="farm_address" id="farmAddress" value="" >
									<p class="description"><?php echo sprintf( esc_html__( 'The main contract of farming.', 'farmfactory' ) ); ?></p>
								</td>
							</tr>

							<tr>
								<th>
									<label><?php echo esc_html__( 'Staking Token Address', 'farmfactory' ); ?></label>
								</th>
								<td>
									<p class="farmfactory-fake-input" id="stakingAddressView"></p>
									<input type="hidden" name="staking_address" id="stakingAddress" value="">
									<p class="description"><?php echo sprintf( esc_html__( 'ERC20 address of token&#039;s contract which users will stake (deposit).', 'farmfactory' ) ); ?></p>
								</td>
							</tr>

							<tr>
								<th>
									<label><?php echo esc_html__( 'Staking Token Info', 'farmfactory' ); ?></label>
								</th>
								<td>
									<strong id="staking_token_name_view"></strong>
									<strong id="staking_token_symbol_view"></strong>
									<strong id="staking_decimals_view"></strong>

									<input type="hidden" name="staking_token_name" id="staking_token_name" value="" />
									<input type="hidden" name="staking_token_symbol" id="staking_token_symbol" value="" />
									<input type="hidden" name="staking_decimals" id="staking_decimals" value="" />
								</td>
							</tr>

							<tr>
								<th>
									<label><?php echo esc_html__( 'Rewarding Token Address', 'farmfactory' ); ?></label>
								</th>
								<td>
									<p class="farmfactory-fake-input" id="rewardsAddressView"></p>
									<input type="hidden" name="reward_address" id="rewardsAddress" value="">
									<p class="description"><?php echo esc_html__( 'ERC20 address of reward token which users will earn.', 'farmfactory' ); ?></p>
								</td>
							</tr>

							<tr>
								<th>
									<label><?php echo esc_html__( 'Rewarding Token Info', 'farmfactory' ); ?></label>
								</th>
								<td>
									<strong id="reward_token_name_view"></strong>
									<strong id="reward_token_symbol_view"></strong>
									<strong id="reward_decimals_view"></strong>

									<input type="hidden" name="reward_token_name" id="reward_token_name" value="" />
									<input type="hidden" name="reward_token_symbol" id="reward_token_symbol" value="" />
									<input type="hidden" name="reward_decimals" id="reward_decimals" value="" />
								</td>
							</tr>

							<tr>
								<th>
									<label><?php echo esc_html__( 'Reward Duration', 'farmfactory' ); ?></label>
								</th>
								<td>
									<strong id="reward_duration_view"></strong>
									<input type="hidden" name="reward_duration" id="reward_duration" value="">
								</td>
							</tr>

						</table>
					</div>
			  	<?php
			  	break;
			case "deployed":
				?>
					<h1><?php if ( empty( $staking_token_symbol ) or empty( $reward_token_symbol ) ) { echo esc_html__( 'Deployed', 'farmfactory' ); } else { echo esc_html__( $staking_token_symbol . '-' . $reward_token_symbol );} ?> Farming</h1>
					<input type="hidden" name="network_name" id="network_name" value="<?php echo esc_attr( $network_name ) ?>" />
					<?php if ($not_uses_configured_network) {
						?>
						<p class="desctiption">To use this farm you need to change "Network" in "Staking settings" to <strong><?php echo esc_html__( $network_name ) ?></strong></p>
						<?php
					}
					?>
					<table class="form-table">

						<tr>
							<th>
								<label><?php echo esc_html__( 'Farm Contract Address', 'farmfactory' ); ?></label>
							</th>
							<td>
								<p class="farmfactory-fake-input"><?php echo esc_attr( $farm_address ); ?></p>
								<input type="hidden" name="farm_address" id="farmAddress" value="<?php echo esc_attr( $farm_address ) ?>" >
								<p class="description"><?php echo sprintf( esc_html__( 'The main contract of farming.', 'farmfactory' ) ); ?></p>
							</td>
						</tr>

						<tr>
							<th>
								<label><?php echo esc_html__( 'Staking Token Address', 'farmfactory' ); ?></label>
							</th>
							<td>
								<p class="farmfactory-fake-input"><?php echo esc_attr( $staking_address ); ?></p>
								<input type="hidden" name="staking_address" value="<?php echo esc_attr( $staking_address ); ?>">
								<p class="description"><?php echo sprintf( esc_html__( 'ERC20 address of token&#039;s contract which users will stake (deposit).', 'farmfactory' ) ); ?></p>
							</td>
						</tr>

						<tr <?php if (!$staking_decimals) echo ' style="display: none" '; ?>>
							<th>
								<label><?php echo esc_html__( 'Staking Token Info', 'farmfactory' ); ?></label>
							</th>
							<td>
								<strong><?php if ($staking_token_name) echo esc_html__( $staking_token_name )?></strong>
								<strong><?php if ($staking_token_symbol) echo esc_html__( ' (' . $staking_token_symbol . '). ' )?></strong>
								<strong><?php if ($staking_decimals) echo esc_html__( 'Decimals: ' . $staking_decimals )?></strong>

								<input type="hidden" name="staking_token_name" id="staking_token_name" value="<?php echo esc_attr( $staking_token_name ) ?>" />
								<input type="hidden" name="staking_token_symbol" id="staking_token_symbol" value="<?php echo esc_attr( $staking_token_symbol ) ?>" />
								<input type="hidden" name="staking_decimals" id="staking_decimals" value="<?php echo esc_attr( $staking_decimals ) ?>" />
							</td>
						</tr>

						<tr>
							<th>
								<label><?php echo esc_html__( 'Rewarding Token Address', 'farmfactory' ); ?></label>
							</th>
							<td>
								<p class="farmfactory-fake-input"><?php echo esc_attr( $reward_address ); ?></p>
								<input type="hidden" name="reward_address" value="<?php echo esc_attr( $reward_address ); ?>">
								<p class="description"><?php echo esc_html__( 'ERC20 address of reward token which users will earn.', 'farmfactory' ); ?></p>
							</td>
						</tr>

						<tr <?php if (!$reward_decimals) echo ' style="display: none" '; ?>>
							<th>
								<label><?php echo esc_html__( 'Rewarding Token Info', 'farmfactory' ); ?></label>
							</th>
							<td>
								<strong><?php if ($reward_token_name) echo esc_html__( $reward_token_name ); ?></strong>
								<strong><?php if ($reward_token_symbol) echo esc_html__( ' (' . $reward_token_symbol . '). ' ); ?></strong>
								<strong><?php if ($reward_decimals) echo esc_html__( 'Decimals: ' . $reward_decimals ); ?></strong>

								<input type="hidden" name="reward_token_name" id="reward_token_name" value="<?php echo esc_attr( $reward_token_name ); ?>" />
								<input type="hidden" name="reward_token_symbol" id="reward_token_symbol" value="<?php echo esc_attr( $reward_token_symbol ); ?>" />
								<input type="hidden" name="reward_decimals" id="reward_decimals" value="<?php echo esc_attr( $reward_decimals ); ?>" />
							</td>
						</tr>

						<tr>
							<th>
								<label><?php echo esc_html__( 'Reward Duration', 'farmfactory' ); ?></label>
							</th>
							<td>
								<strong id="reward_duration_view"><?php echo esc_html__( $reward_duration ); ?>  seconds</strong>
								<input type="hidden" name="reward_duration" id="reward_duration" value="<?php echo esc_attr( $reward_duration ); ?>">
							</td>
						</tr>

					</table>
				<?php
			  	break;
		}

		if( !$should_activate_license ) {

			?>
			<h3><?php echo esc_html__( 'Start farming period', 'farmfactory' ); ?></h3>

			<?php
			if ( $farm_address ) {
			?>
				<input type="button" id="checkFarmingStatusButton" class="button button-primary" value="<?php echo esc_attr__('Check Farming Status', 'farmfactory'); ?>">

				<div id="startFarmPeriodContainer" style="display: none">

					<div id="notStartedFarmPeriodContainer" style="display: none">

						<table class="form-table">

							<tr>
								<th>
									<label><?php echo esc_html__( 'Reward Balance', 'farmfactory' ); ?></label>
								</th>
								<td>
									<p id="rewardBalance">0 <?php if ($reward_token_symbol) echo esc_attr( $reward_token_symbol ); ?></p>
									<p class="description"><?php echo esc_html__( 'The balance on the contract that you can use to reward your users. (Click to the "Check Farming Status" button again to update it)', 'farmfactory' ); ?></p>
								</td>
							</tr>

							<tr>
								<th>
									<label><?php echo esc_html__( 'Reward Amount', 'farmfactory' ); ?></label>
								</th>
								<td>
									<input value="" type="number" id="rewardAmount" class="medium-text js-farmfactory-load-icon">
									<p class="description"><?php echo esc_html__( 'Tokens amount that will be distributed for the specified period', 'farmfactory' ); ?></p>
								</td>
							</tr>
						</table>

						<p class="desctiption">
							<strong>1. </strong>
							<?php echo esc_html__("Note that before start farming you need to transfer the specified amount of {$reward_token_symbol} reward tokens to the farm contract:  {$farm_address}.", 'farmfactory'); ?>
						</p>
						<p class="desctiption">
							<strong>2. </strong>
							<span style="color: red;">
								<?php echo esc_html__("Attention! After start farming you won't be able to stop or change it, or withdraw reward tokens. All tokens will be distributed between stakers.", 'farmfactory'); ?>
							</span>
						</p>
						<p class="desctiption">
							<strong>3. </strong>
							<?php echo esc_html__("When farming ends you will be able to start new farming", 'farmfactory'); ?>
						</p>
						<p>
							<input type="button" id="farmfactory_startFarmingButton" class="button button-primary" value="<?php echo esc_attr__('Start Farming Period', 'farmfactory'); ?>">
						</p>

					</div>

					<div id="startedFarmPeriodContainer" style="display: none">
						<p>Wait for Farming Period is end and check Farm Status again to start new period.</p>
					</div>

					<div id="successfullyStartedFarm" style="display: none; color: green;">
						<p>Congratulations! You have started Farming Period.</p>
					</div>

					<h3><?php echo esc_html__( 'Reward distributing', 'farmfactory' ); ?></h3>
					<p class="desctiption">
						<?php echo esc_html__('All distrubutes are autamatically. Put "[farmfactory id="' . get_the_ID() . '"]" shortcode to any post or page in your site and try to deposit, withdraw and harvest some tokens in the frontend ', 'farmfactory'); ?>
					</p>
					<p class="desctiption">
						<?php echo sprintf( esc_html__('Need help? Contact our team using %s.', 'farmfactory'), '<a href="https://t.me/onoutsupportbot/?start=farm_wp_ap" target="_blank">https://t.me/onoutsupportbot</a>' ); ?>
					</p>
				</div>

				<div  id="startedFarmPeriodContainer" style="display: none">

				</div>

				<h3><?php echo esc_html__( 'Additional settings', 'farmfactory' ); ?></h3>

				<table class="form-table">

					<tr>
						<th>
							<label><?php echo esc_html__( 'APY label', 'farmfactory' ); ?></label>
						</th>
						<td>
							<input type="text" name="farm_apy_label" id="farmfactory_apy_label" class="large-text" value="<?php echo esc_attr( $farm_apy_label ); ?>">
						</td>
					</tr>

					<tr>
						<th>
							<label><?php echo esc_html__( 'Annual Percentage Yield (APY)', 'farmfactory' ); ?></label>
						</th>
						<td>
							<input type="text" name="farm_apy" id="farmfactory_apy" class="large-text" value="<?php echo esc_attr( $farm_apy ); ?>">
							<p class="description"><?php echo sprintf( esc_html__( 'APY you write in the admin doesn\'t affect the contract logic. It\'s just a value to display in the widget', 'farmfactory' ), '<br>' ); ?></p>
						</td>
					</tr>

				</table>

			<?php
			} else {
			?>
				<p class="desctiption">
					<?php echo esc_html__('Please deploy new or fetch exists farm address contract and press publish before perform this instructions.', 'farmfactory'); ?>
				</p>
			<?php
			}
		}
		?>
			</div>

			<div id="farmfactory_loaderOverlay" class="farmfactory-overlay">
				<div class="farmfactory-loader"></div>
				<div class="farmfactory-loader-status" id="farmfactory_loaderStatus">Loading...</div>
			</div>

		<?php

	}

	/**
	 * Render Thumbnail
	 *
	 * @param object $post Post.
	 */
	public function render_thumbnail( $post ) {

		/* Add nonce for security and authentication */
		wp_nonce_field( 'farmfactory_meta_action', 'farmfactory_meta_nonce' );

		$post             = get_post( $post );
		$post_type_object = get_post_type_object( $post->post_type );

		$thumbnail_id = get_post_meta( $post->ID, '_farm_thumbnail_id', true );

		$content = '<div class="farmfactory-thumbnail-container">';

		if ( $thumbnail_id && get_post( $thumbnail_id ) ) {

			$thumbnail_html = wp_get_attachment_image( $thumbnail_id, 'large' );

			if ( ! empty( $thumbnail_html ) ) {

				$content .= '<p><a href="#" id="set-farm-thumbnail">' . $thumbnail_html . '</a></p>';

				$content .= '<p class="howto" id="set-farm-thumbnail-desc">' . esc_html__( 'Click the image to edit or update', 'farmfactory' ) . '</p>';
				$content .= '<p><a href="#" id="remove-farm-thumbnail">' . $post_type_object->labels->remove_featured_image . '</a></p>';
			}
		} else {
			$content .= '<p><a href="#" id="set-farm-thumbnail">' . $post_type_object->labels->set_featured_image . '</a></p>';
		}

		$content .= '</div>';

		$content .= '<input type="hidden" id="_farm_thumbnail_id" name="_farm_thumbnail_id" value="' . esc_attr( $thumbnail_id ? $thumbnail_id : '-1' ) . '">';

		echo $content;

	}

	public function save_metabox( $post_id, $post ) {

		/* Add nonce for security and authentication */
		$nonce_name   = isset( $_POST['farmfactory_meta_nonce'] ) ? $_POST['farmfactory_meta_nonce'] : '';
		$nonce_action = 'farmfactory_meta_action';

		/* Check if a nonce is set */
		if ( ! isset( $nonce_name ) ) {
			return;
		}

		/* Check if a nonce is valid */
		if ( ! wp_verify_nonce( $nonce_name, $nonce_action ) ) {
			return;
		}

		/* Check if the user has permissions to save data */
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		/* Check if it's not an autosave */
		if ( wp_is_post_autosave( $post_id ) ) {
			return;
		}

		/* Sanitize user input */
		$staking_address 		= isset( $_POST['staking_address'] ) ? sanitize_text_field( $_POST['staking_address'] ) : '';
		$staking_token_name  	= isset( $_POST['staking_token_name'] ) ? sanitize_text_field( $_POST['staking_token_name'] ) : '';
		$staking_token_symbol  	= isset( $_POST['staking_token_symbol'] ) ? sanitize_text_field( $_POST['staking_token_symbol'] ) : '';
		$staking_decimals 		= isset( $_POST['staking_decimals'] ) ? sanitize_text_field( $_POST['staking_decimals'] ) : '';
		$reward_address  		= isset( $_POST['reward_address'] ) ? sanitize_text_field( $_POST['reward_address'] ) : '';
		$reward_token_name  	= isset( $_POST['reward_token_name'] ) ? sanitize_text_field( $_POST['reward_token_name'] ) : '';
		$reward_token_symbol  	= isset( $_POST['reward_token_symbol'] ) ? sanitize_text_field( $_POST['reward_token_symbol'] ) : '';
		$reward_decimals 		= isset( $_POST['reward_decimals'] ) ? sanitize_text_field( $_POST['reward_decimals'] ) : '';
		$reward_duration 		= isset( $_POST['reward_duration'] ) ? sanitize_text_field( $_POST['reward_duration'] ) : '';
		$network_name    		= isset( $_POST['network_name'] ) ? sanitize_text_field( $_POST['network_name'] ) : '';
		$farm_address    		= isset( $_POST['farm_address'] ) ? sanitize_text_field( $_POST['farm_address'] ) : '';
		$farm_apy        		= isset( $_POST['farm_apy'] ) ? sanitize_text_field( $_POST['farm_apy'] ) : '';
		$farm_apy_label  		= isset( $_POST['farm_apy_label'] ) ? sanitize_text_field( $_POST['farm_apy_label'] ) : '';
		$farm_thumbnail  		= isset( $_POST['_farm_thumbnail_id'] ) ? sanitize_text_field( $_POST['_farm_thumbnail_id'] ) : '-1';

		/* Update the meta field in the database */
		update_post_meta( $post_id, 'staking_address', $staking_address );
		update_post_meta( $post_id, 'staking_token_name', $staking_token_name );
		update_post_meta( $post_id, 'staking_token_symbol', $staking_token_symbol );
		update_post_meta( $post_id, 'staking_decimals', $staking_decimals );
		update_post_meta( $post_id, 'reward_address', $reward_address );
		update_post_meta( $post_id, 'reward_token_name', $reward_token_name );
		update_post_meta( $post_id, 'reward_token_symbol', $reward_token_symbol );
		update_post_meta( $post_id, 'reward_decimals', $reward_decimals );
		update_post_meta( $post_id, 'farm_apy', $farm_apy );
		update_post_meta( $post_id, 'farm_apy_label', $farm_apy_label );
		update_post_meta( $post_id, 'reward_duration', $reward_duration );
		update_post_meta( $post_id, 'network_name', $network_name );
		update_post_meta( $post_id, 'farm_address', $farm_address );
		update_post_meta( $post_id, '_farm_thumbnail_id', $farm_thumbnail );

	}

}

new FarmFactory_Meta_Box;

/**
 * Shortcode
 */
function farmfactory_post_submitbox( $post ) {
	if ( 'farmfactory' === $post->post_type ) {
		?>
		<div class="misc-pub-section">
			<p class="description"><strong><?php esc_html_e( 'Shortcode', 'farmfactory' ); ?><strong></p>
			<input type="text" class="large-text farmfactory-schortcode-copy" value='[farmfactory id="<?php echo esc_attr( $post->ID ); ?>"]' readonly>
			<div class="copy-to-clipboard-container">
				<button type="button" class="button button-small copy-farm-shortcode" data-clipboard-target=".farmfactory-schortcode-copy"><?php esc_html_e( 'Copy Shortcode to clipboard', 'farmfactory' ); ?></button>
				<span class="success hidden" aria-hidden="true"><?php esc_html_e( 'Copied!', 'farmfactory' ); ?></span>
			</div>
		</div>
		<?php
	}
}
add_action( 'post_submitbox_misc_actions', 'farmfactory_post_submitbox' );
