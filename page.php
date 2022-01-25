<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package CodeFavorite_Starter_Theme
 */

get_header();
?>

    <header id="page-header">
        <div class="container">
            <?php 
            $values = get_field( 'custom_title_regular_header' );
            if ( $values ) { ?>
                <h1><?php the_field('custom_title_regular_header'); ?></h1>
            <?php 
            } else { ?>
                <h1><?php the_title(); ?></h1>
            <?php } ?>

            
        </div>
        <!-- // container  -->
        <img src="<?php bloginfo('template_directory'); ?>/img/bg/regular-h.svg" alt="" class="side-img">

    </header>
    <!-- // header  -->

    <div id="regular-page">
        <div class="container">
            <?php the_field('content_block_regular'); ?>
            <a href="<?php the_field('button_link_regu'); ?>" class="btn-back"><?php the_field('button_label_regular'); ?></a>
        </div>
        <!-- // containr  -->
    </div>
    <!-- // regular page  -->

<?php
get_footer();
