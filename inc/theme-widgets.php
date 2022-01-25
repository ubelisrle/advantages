<?php
/**
 * Declaring widgets
 *
 * @package CodeFavorite_Starter_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action( 'widgets_init', 'cf_widgets_init' );

if ( ! function_exists( 'cf_widgets_init' ) ) {
	/**
	 * Initializes themes widgets.
	 */
	function cf_widgets_init() {
		register_sidebar(
			array(
				'name'          => __( 'Woo Sidebar', 'cf' ),
				'id'            => 'woocommerce_sidebar',
				'description'   => __( 'Wocommerce Sidebar', 'cf' ),
				'before_widget' => '<aside id="%1$s" class="widget %2$s">',
				'after_widget'  => '</aside>',
				'before_title'  => '<h3 class="widget-title">',
				'after_title'   => '</h3>',
			)
		);

		register_sidebar(
			array(
				'name'          => __( 'Left Sidebar', 'cf' ),
				'id'            => 'left-sidebar',
				'description'   => __( 'Left sidebar widget area', 'cf' ),
				'before_widget' => '<aside id="%1$s" class="widget %2$s">',
				'after_widget'  => '</aside>',
				'before_title'  => '<h3 class="widget-title">',
				'after_title'   => '</h3>',
			)
		);

	}
} // endif function_exists( 'cf_widgets_init' ).