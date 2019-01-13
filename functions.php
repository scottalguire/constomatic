<?php
/**
 * Child Theme Specific Scripts
  */

define('CSS_VERSION', '1.0.0');
define('JS_VERSION', '1.0.0');

function child_theme_enqueue_scripts() {
	// register main stylesheet
	wp_register_style( 'main-stylesheet', get_stylesheet_directory_uri() . '/library/css/style.css?vers'. echo CSS_VERSION , array(), '', 'all' );
	wp_register_script( 'child-js', get_stylesheet_directory_uri() . '/library/js/child-scripts.js?vers1.2', array( 'jquery' ), '', true );
	wp_register_script( 'child-homepage-js', get_stylesheet_directory_uri() . '/library/js/child-home-scripts.js?vers1.2', array( 'jquery' ), '', true );
	wp_register_script( 'inv-search-bar-js', get_template_directory_uri() . '/library/js/inv-search-bar.js?vers1.2', array( 'jquery' ), '', true );
	wp_register_script( 'live-inv-search', get_template_directory_uri() . '/library/js/live-inventory-search.js?vers1.3', array( 'jquery' ), '', true );
	wp_register_script( 'inv-search-banner-js', get_template_directory_uri() . '/library/js/inv-search-banner.js', array( 'jquery' ), '', true );
	wp_register_script( 'payment-slider', get_template_directory_uri() . '/library/js/payment-slider.js', array( 'jquery' ), '1.0.1', true );
	wp_register_script( 'ion-range-js', 'https://s3.amazonaws.com/websites.edealer.ca/assets/js/ionRange.js', array( 'jquery' ), '1.0.1', true );
	wp_register_script( 'edealer-common-js', 'http://websites.edealer.ca/assets/js/custom/common.js', array(), '', true );
	wp_register_style( 'edealer-custom-styles', 'http://websites.edealer.ca/assets/css/custom.css', array(), '1.0.0', all );
	wp_register_style( 'edealer-icon-files', 'http://websites.edealer.ca/assets/icons/ed-icons/style.css', array(), '1.0.0', all );
	wp_register_script( 'nice-select-js', get_template_directory_uri() . '/library/js/libs/jquery.nice-select.min.js?ver1.1', array( 'jquery' ), '', true );
	wp_register_style( 'custom-scrollbar-css', 'https://cdn.jsdelivr.net/jquery.mcustomscrollbar/3.0.6/jquery.mCustomScrollbar.min.css', array(), '' );
    wp_register_script( 'custom-scrollbar-js', 'https://cdn.jsdelivr.net/jquery.mcustomscrollbar/3.0.6/jquery.mCustomScrollbar.concat.min.js', array( 'jquery' ), '', true );
	wp_register_style( 'content-stylesheet', get_stylesheet_directory_uri() . '/library/css/content-style.css?vers1.7', array(), '', 'all' );

	//Enqueue
	wp_enqueue_style( 'main-stylesheet' );
	wp_enqueue_script( 'child-js' );
	wp_enqueue_script( 'edealer-common-js' );
	wp_enqueue_script( 'live-inv-search' );
	wp_enqueue_style( 'edealer-custom-styles' );
	wp_enqueue_style( 'edealer-icon-files' );

 	// ALPG FUNCS TPL Start
	// ALPG FUNCS TPL End 

	if(is_front_page()){
		 // HMPG FUNCS TPL Start
		 // BS01 - banner-search option-1
		 wp_register_script( 'nice-select-js', get_template_directory_uri() . '/library/js/libs/jquery.nice-select.min.js?ver1.1', array( 'jquery' ), '', true );
		 wp_enqueue_script( "nice-select-js" );
		 wp_register_script( 'inv-search-banner-js', get_template_directory_uri() . '/library/js/inv-search-banner.js', array( 'jquery' ), '', true );
		 wp_enqueue_script( "inv-search-banner-js" );
		// HMPG FUNCS TPL End 
	} else {
		wp_enqueue_style( 'content-stylesheet' );
	}
}
add_action( 'wp_enqueue_scripts', 'child_theme_enqueue_scripts' );

/**
 * Dealer Logo Styling on Login Screen
 */
function my_login_logo() {
	?>
	<style type="text/css">
		#login h1 a {
			background-image: url('https://s3.amazonaws.com/websites.edealer.ca/edealer/tpl/6/images/admin-logo.png');
			padding-bottom: 5px;
			background-size: 143px;
			height: 30px;
			width: 180px;
		}
	</style>
<?php }
add_action( 'login_enqueue_scripts', 'my_login_logo' );

/**
 * Change Logo Link on Login Screen
 *
 * @return string|void
 */
function my_login_logo_url() {
	return home_url();
}
add_filter( 'login_headerurl', 'my_login_logo_url' );

/**
 * Custom Favicon
 */

add_action('admin_init','custom_site_options');

//Register & Add Field to Wordpress
function custom_site_options(){
	register_setting( 'ed-site-options', 'ed_customFavicon_png');
	add_settings_field( 'ed_customFavicon_png', 'Custom Favicon (.png)', 'ed_customFavicon_png_cb', 'ed-site-options', 'ed_general');

	register_setting( 'ed-site-options', 'ed_customFavicon_ico');
	add_settings_field( 'ed_customFavicon_ico', 'Custom Favicon (.ico)', 'ed_customFavicon_ico_cb', 'ed-site-options', 'ed_general');
}

// .png Callback function
function ed_customFavicon_png_cb(){
    $custom_favicon = get_option('ed_customFavicon_png');
    echo '<input style="width: 300px" type="text" name="ed_customFavicon_png" id="ed_customFavicon_png" value="'. $custom_favicon .'" >';
    echo '<p class="note">Link to custom .png favicon.</p>';
}

// .ico Callback functions
function ed_customFavicon_ico_cb(){
    $custom_favicon = get_option('ed_customFavicon_ico');
    echo '<input style="width: 300px" type="text" name="ed_customFavicon_ico" id="ed_customFavicon_ico" value="'. $custom_favicon .'" >';
    echo '<p class="note">Link to custom .ico favicon.</p>';
}

/**
 * Favicion Brands Icon Generator
 */
function brand_favicon_generator() {
	$brandFavicon = strtolower(get_option('ed_dealerbrand'));
	
	switch ($brandFavicon) {
		case "honda";
			$brandFavicon = "https://websites.edealer.ca/favicons/honda.png";
			break;
		case "kia";
			$brandFavicon = "https://websites.edealer.ca/favicons/kia.png";
			break;
		case "audi";
			$brandFavicon = "https://websites.edealer.ca/favicons/audi.png";
			break;
		case "bmw";
			$brandFavicon = "https://websites.edealer.ca/favicons/bmw.png";
			break;
		case "buick";
			$brandFavicon = "https://websites.edealer.ca/favicons/buick.png";
			break;
		case "chevrolet";
			$brandFavicon = "https://websites.edealer.ca/favicons/chevrolet.png";
			break;
		case "ford";
			$brandFavicon = "https://websites.edealer.ca/favicons/ford.png";
			break;
		case "gm";
			$brandFavicon = "https://websites.edealer.ca/favicons/gm.png";
			break;
		case "hyundai";
			$brandFavicon = "https://websites.edealer.ca/favicons/hyundai.png";
			break;
		case "lincoln";
			$brandFavicon = "https://websites.edealer.ca/favicons/lincoln.png";
			break;
		case "mitsubishi";
			$brandFavicon = "https://websites.edealer.ca/favicons/mitsubishi.png";
			break;
		case "subaru";
			$brandFavicon = "https://websites.edealer.ca/favicons/subaru.png";
			break;
		case "toyota";
			$brandFavicon = "https://websites.edealer.ca/favicons/toyota.png";
			break;
		case "volkswagen";
			$brandFavicon = "https://websites.edealer.ca/favicons/volkswagen.png";
			break;
		case "acura";
			$brandFavicon = "https://websites.edealer.ca/favicons/acura.png";
			break;
		case "dodge";
			$brandFavicon = "https://websites.edealer.ca/favicons/dodge.png";
			break;
		case "infiniti";
			$brandFavicon = "https://websites.edealer.ca/favicons/infiniti.png";
			break;
		case "mazda";
			$brandFavicon = "https://websites.edealer.ca/favicons/mazda.png";
			break;
		case "nissan";
			$brandFavicon = "https://websites.edealer.ca/favicons/nissan.png";
			break;
		default :
			$brandFavicon = "https://websites.edealer.ca/favicons/edealer.png";
			break;
	}
	return $brandFavicon;
}

function get_favicon($icoFlag) {
	$pngFavicon = get_option('ed_customFavicon_png');
	$icoFavicon = get_option('ed_customFavicon_ico');
	$favicon = "";

	if($pngFavicon === "" && $icoFavicon === "") {
	   	$favicon = brand_favicon_generator();
	} elseif(strpos($pngFavicon, ".png") !== false && strpos($icoFavicon, ".ico") !== false) {
		if($icoFlag === true) {
			$favicon = $icoFavicon;
		} else {
			$favicon = $pngFavicon;
			$icoFlag = false;
		}
	} else {
		$favicon = "https://websites.edealer.ca/favicons/edealer.png";
	}

	if($icoFlag === true) {
		$favicon = str_replace(".png", ".ico", $favicon);
	}

	return $favicon;
}

function ed_wp_child_theme_options(){
	//Create Banner Static CTA Section (Tabs)
	$custom_section = new Ed_Wp_Section();
	$custom_section->id = 'ed_wp_options_banner_ctas'; 
	$custom_section->title = 'Homepage Banner CTAs'; 
	$custom_section->callback = 'ed_wp_options_admin_options_callback_homepage';
	$custom_section->page = 'ed-wp-options';
	//Create Banner Static CTA  Options 
	$custom_option = new Ed_Wp_Option();
	$custom_option->id = 'ed_wp_options_banner_ctas';
	$custom_option->array_option_settings = [
		(object) [
			'parent_id' => 'cta_1',
			'id' => 'button',
			'title' => 'Top CTA 1',
			'input_type' => 'button',
			'style_class' => 'lrg',
		],
		(object) [
			'parent_id' => 'cta_2',
			'id' => 'button',
			'title' => 'Top CTA 2',
			'input_type' => 'button',
			'style_class' => 'lrg',
		],
		(object) [
			'parent_id' => 'cta_3',
			'id' => 'button',
			'title' => 'Top CTA 3',
			'input_type' => 'button',
			'style_class' => 'lrg',
		],
		(object) [
			'parent_id' => 'cta_4',
			'id' => 'button',
			'title' => 'Top CTA 4',
			'input_type' => 'button',
			'style_class' => 'lrg',
		],
	];
	
	$custom_option->title = '';
	$custom_option->help_text = '';
	$custom_option->callback = 'ed_wp_options_array_format_cb';
	$custom_option->page = 'ed-wp-options';
	$custom_option->section = 'ed_wp_options_banner_ctas';

	//Create Banner Static CTA  Options - ROW 2
	$custom_option = new Ed_Wp_Option();
	$custom_option->id = 'ed_wp_options_banner_ctas_row_2';
	$custom_option->array_option_settings = [
		(object) [
			'parent_id' => 'second_row_cta_1',
			'id' => 'button',
			'title' => 'Top CTA 5',
			'input_type' => 'button',
			'style_class' => 'lrg',
		],
		(object) [
			'parent_id' => 'second_row_cta_2',
			'id' => 'button',
			'title' => 'Top CTA 6',
			'input_type' => 'button',
			'style_class' => 'lrg',
		],
		(object) [
			'parent_id' => 'second_row_cta_3',
			'id' => 'button',
			'title' => 'Top CTA 7',
			'input_type' => 'button',
			'style_class' => 'lrg',
		],
		(object) [
			'parent_id' => 'second_row_cta_4',
			'id' => 'button',
			'title' => 'Top CTA 8',
			'input_type' => 'button',
			'style_class' => 'lrg',
		],
	];
	
	$custom_option->title = '---- CTAs Row 2 ----';
	$custom_option->help_text = '';
	$custom_option->callback = 'ed_wp_options_array_format_cb';
	$custom_option->page = 'ed-wp-options';
	$custom_option->section = 'ed_wp_options_banner_ctas';

		//Create Banner Static CTA  Options - ROW 3
		$custom_option = new Ed_Wp_Option();
		$custom_option->id = 'ed_wp_options_banner_ctas_row_3';
		$custom_option->array_option_settings = [
			(object) [
				'parent_id' => 'third_row_cta_1',
				'id' => 'button',
				'title' => 'Top CTA 9',
				'input_type' => 'button',
				'style_class' => 'lrg',
			],
		];
		
		$custom_option->title = '---- CTAs Row 3 ----';
		$custom_option->help_text = '';
		$custom_option->callback = 'ed_wp_options_array_format_cb';
		$custom_option->page = 'ed-wp-options';
		$custom_option->section = 'ed_wp_options_banner_ctas';

}
register_nav_menus(
    array(
        'secondary-nav' => __( 'Secondary Menu', 'bonestheme' ) // secondary nav in footer
    )
); 