<?php
/**
 * Template Name: Open Contact Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
?>

    <div class="top-shape-wrapper">
        <img src="<?php bloginfo('template_directory'); ?>/img/bg/contact-side-top.svg" alt="" class="top-shape">
    </div>

    <div id="contact-page">
        <div class="left-shape">
            <img src="<?php bloginfo('template_directory'); ?>/img/bg/contact-left-side.svg" alt="">
        </div>
        <!-- // shape  -->
        <div class="container">

            <aside id="contact-sidebar">

                <img src="<?php bloginfo('template_directory'); ?>/img/bg/contact-top.svg" alt="" class="mobile-shape">

                <h1><?php the_field('block_title_contact_sidebar'); ?></h1>
                <div class="contact-info">
      
                    <h2><?php the_field('block_title_open_contact'); ?></h2>
                   <?php the_field('intro_text_open_contact'); ?>

                </div>
                <!-- // info  -->

                <div class="mobile-intro">
                    <?php the_field('form_intro_contact_page'); ?>                    
                </div>
                <!-- // mobile intro  -->

            </aside>
            <!-- // contact sidebar  -->

            <div id="contact-form">
                <div id="contact-inner">

                    <div class="form-intro">
                        <?php the_field('form_intro_contact_page'); ?>
                    </div>
                    <!-- // from intro  -->

                    <div class="form-wrapper">

                        <?php the_field('form_code_open_contact'); ?>

                    </div>
                    <!-- // wrapper  -->


                </div>
            </div>
            <!-- // form -->

        </div>
        <!-- // container  -->

        <div class="shape-bottom">
            <img src="<?php bloginfo('template_directory'); ?>/img/bg/contact-bottom.svg" alt="">
        </div>
        <!-- // shape bottom  -->

    </div>
    <!-- // contact page  -->

<?php get_footer(); ?>
