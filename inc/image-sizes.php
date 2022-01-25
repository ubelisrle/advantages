<?php
/**
 * Custom image sizes
 *
 * @package CodeFavorite_Starter_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// general
add_image_size('preview-image', 300, 200, TRUE);
add_image_size('full-image', 1600, 9999, FALSE);
add_image_size('half-image', 800, 9999, FALSE);

// home
add_image_size('feat-image', 460, 306, TRUE);

// Blog
add_image_size('bloghead-image', 800, 318, TRUE);
add_image_size('blog-image', 340, 160, TRUE);
add_image_size('blogsingle-image', 960, 430, TRUE);

// Resources
add_image_size('purpose-image', 617, 9999, FALSE);
add_image_size('test-image', 95, 95, TRUE);

// team
add_image_size('team-image', 365, 375, TRUE);
add_image_size('case-image', 720, 364, TRUE);