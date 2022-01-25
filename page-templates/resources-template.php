<?php
/**
 * Template Name: Resources Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
?>

    <header id="regular-header">
        <div class="container">
            <div class="header-caption">
                <h1><?php the_field('header_title_res'); ?></h1>
            </div>
            <!-- // caption  -->
        </div>
        <!-- // container  -->
        <img src="<?php bloginfo('template_directory'); ?>/img/bg/keys-header.svg" alt="" class="side-img">
    </header>
    <!-- // regular header  -->

    <div id="resources-list">
        <div class="container">
            <div class="row">

            <?php if( have_rows('resources_listing_list') ): ?>
                <?php while( have_rows('resources_listing_list') ): the_row(); ?>

                    <div class="col-md-6">
                        <div class="res-card">
                            <div class="res-photo">
                                <img src="<?php the_sub_field('photo'); ?>" alt="">
                            </div>
                            <!-- // photo  -->
                            <div class="res-desc">
                                <h3><?php the_sub_field('title'); ?></h3>
                                <a href="<?php the_sub_field('link_to_page'); ?>" class="btn-more">Read More</a>
                            </div>
                            <!-- // desc  -->
                        </div>
                    </div>
                    <!-- // card  -->

                <?php endwhile; ?>
            <?php endif; ?>


            </div>
            <!-- // row  -->
        </div>
        <!-- // container  -->
    </div>
    <!-- // list  -->

<?php get_footer(); ?>
