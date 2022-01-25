<?php
/**
 * Template Name: Contact Template
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
                    <h2><?php the_field('company_name_contact_sidebar'); ?></h2>
                    <span class="tel"><a href="tel:<?php the_field('phone_number_contact_sidebar'); ?>"><?php the_field('phone_number_contact_sidebar'); ?></a></span>
                    <span class="email"><a href="mailto:<?php the_field('email_address_contact_sidebar'); ?>"><?php the_field('email_address_contact_sidebar'); ?></a></span>
                    <address>
                        <?php the_field('company_address_contact_sidebar'); ?>
                    </address>

                    <ul class="socials">
                        <?php if( have_rows('social_links_gen') ): ?>
                            <?php while( have_rows('social_links_gen') ): the_row(); ?>

                                <li><a href="<?php the_sub_field('link_to_network'); ?>" target="_blank"><img src="<?php the_sub_field('icon'); ?>" alt=""></a></li>

                            <?php endwhile; ?>
                        <?php endif; ?>
                    </ul>

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

                        <?php the_field('form_code_contact_page'); ?>

                    </div>
                    <!-- // wrapper  -->

                    <div class="bottom-notice">
                        <small><?php the_field('form_notice_contact_page'); ?><img src="<?php the_field('notice_logo_footer'); ?>" alt=""></small>
                    </div>

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
