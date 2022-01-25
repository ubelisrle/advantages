<?php
/**
 * Theme basic setup.
 *
 * @package CodeFavorite_Starter_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action( 'after_setup_theme', 'cf_menu_setup' );

if ( ! function_exists ( 'cf_menu_setup' ) ) {

	function cf_menu_setup() {

        // This theme uses wp_nav_menu() in one location.
        register_nav_menus( array(
            'primary_menu' => __( 'Primary Menu', 'cf' ),
            'mobile_menu' => __( 'Mobile Menu', 'cf' ),
            'footer_menu' => __( 'Footer Menu', 'cf' ),
            'footer1_menu' => __( 'Footer Block 1', 'cf' ),
            'footer2_menu' => __( 'Footer Block 2', 'cf' ),
            'footer3_menu' => __( 'Footer Block 3', 'cf' ),
        ) );


	}
}
