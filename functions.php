<?php
/**
 * CodeFavorite Starter Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package CodeFavorite_Starter_Theme
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/*
* Include files and functions
*/
require_once( __DIR__ . '/inc/theme-settings.php');         // Initialize theme default settings.
require_once( __DIR__ . '/inc/theme-setup.php');            // Theme setup and custom theme supports.
require_once( __DIR__ . '/inc/theme-menus.php');            // Register theme menus.
require_once( __DIR__ . '/inc/theme-widgets.php');          // Register widget area.

require_once( __DIR__ . '/inc/enqueue.php');               // Enqueue scripts and styles.
require_once( __DIR__ . '/inc/ctp.php');                   // Register Custom Post types
require_once( __DIR__ . '/inc/image-sizes.php');           // Custom image sizes

require_once( __DIR__ . '/inc/theme-extras.php');          // Customize theme, extra settings
require_once( __DIR__ . '/inc/theme-cleanup.php');         // Cleaning worpdress garbage
require_once( __DIR__ . '/inc/shortcodes.php');            // Shortcodes
require_once( __DIR__ . '/inc/customizer.php');            // Theme customizer
require_once( __DIR__ . '/inc/hooks.php');                 // Theme Hooks

require_once( __DIR__ . '/inc/wp_bootstrap_mobile_navwalker.php'); 

// Allow SVG
add_filter( 'wp_check_filetype_and_ext', function($data, $file, $filename, $mimes) {

    global $wp_version;
    if ( $wp_version !== '4.7.1' ) {
       return $data;
    }
  
    $filetype = wp_check_filetype( $filename, $mimes );
  
    return [
        'ext'             => $filetype['ext'],
        'type'            => $filetype['type'],
        'proper_filename' => $data['proper_filename']
    ];
  
  }, 10, 4 );
  
  function cc_mime_types($mimes) {
    $mimes['json'] = 'application/json';
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');
  
  function fix_svg() {
    echo '<style type="text/css">
          .attachment-266x266, .thumbnail img {
               width: 100% !important;
               height: auto !important;
          }
          </style>';
  }
  add_action( 'admin_head', 'fix_svg' );

  add_filter( 'wpcf7_autop_or_not', '__return_false' );

  add_action('init', 'init_remove_support',100);
  function init_remove_support(){
      $post_type = 'post';
      remove_post_type_support( $post_type, 'editor');
  }

  
add_action('admin_head', 'remove_content_editor');
/**
 * Remove the content editor from ALL pages 
 */
function remove_content_editor()
{ 
    remove_post_type_support('page', 'editor');        
}

/**
 * Hide editor on specific pages.
 *
 */
add_action( 'admin_init', 'hide_editor' );
function hide_editor() {
  // Get the Post ID.
  $post_id = $_GET['post'] ? $_GET['post'] : $_POST['post_ID'] ;
  if( !isset( $post_id ) ) return;
  // Hide the editor on the page titled 'Homepage'
  $homepgname = get_the_title($post_id);
  if($homepgname == 'Home'){ 
    remove_post_type_support('page', 'editor');
  }
  // Hide the editor on a page with a specific page template
  // Get the name of the Page Template file.
  $template_file = get_post_meta($post_id, '_wp_page_template', true);
  if(
  $template_file == 'front-page.php' 
  || $template_file == 'page-templates/approach-template.php'
  || $template_file == 'page.php'
  || $template_file == 'page-templates/contact-template.php'
  || $template_file == 'page-templates/approach-template.php'
  || $template_file == 'page-templates/workshops-template.php'  
  || $template_file == 'page-templates/meetfran-template.php'   
  || $template_file == 'page-templates/about-template.php' 
  || $template_file == 'page-templates/resources-template.php'   
  || $template_file == 'page-templates/cases-template.php'    
  ){ // the filename of the page template
    remove_post_type_support('page', 'editor');
  }
}


