<?php
/**
 * Template Name: Thanks Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
?>

    <div id="ermac-wrapper">
        <img src="<?php bloginfo('template_directory'); ?>/img/bg/ermac.svg" alt="" class="shape-top">
        <div class="container">
            <div class="ermac-content">
                <h1><?php the_field('main_title_tnx'); ?></h1>
                <footer>
                    <a href="<?php the_field('button_link_tnx'); ?>" class="btn-cta"><?php the_field('button_label_tnx'); ?></a>
                </footer>
            </div>
            <!-- // ermac content  -->
        </div>
        <!-- // container  -->
    </div>
    <!-- // wrapper  -->

<?php get_footer(); ?>
