<?php
/**
 * Template Name: Meet Fran Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
?>

    <header id="meet-header">
        <div class="container">
            <div class="hero-title">
                <h1><?php the_field('header_title_fran_header'); ?></h1>
                <?php the_field('header_text_meet_fran'); ?>
            </div>
            <!-- // hero title  -->
        </div>
        <!-- // container  -->
        <div class="image-holder">
            <?php
            $imageID = get_field('featured_image_fran_header');
            $image = wp_get_attachment_image_src( $imageID, 'full-image' );
            $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
            ?> 

            <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" /> 
        </div>
        <!-- // image  -->
    </header>
    <!-- // meet header  -->

    <section id="about-fran">
        <div class="container">

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/aboutfran-bg.svg" class="top-shape" alt="">

            <div class="image-holder">
                <img src="<?php the_field('profile_image_fran'); ?>" alt="">
            </div>
            <!-- // image holder  -->
            <div class="about-text">
                <h2><?php the_field('main_title_meet_fran_about'); ?></h2>
                <?php the_field('about_text_fran_page'); ?>
            </div>
            <!-- // text  -->
        </div>
        <!-- // container  -->
    </section>
    <!-- // about fran  -->

    <div id="podcast"></div>

    <section id="fran-podcast">
        <div class="container">

            <div class="podcast-text">
                <h2><?php the_field('block_title_podcast_fran'); ?></h2>
                <?php the_field('content_block_podcast_fran'); ?>
                <div class="podcast-logos">
                    <?php if( have_rows('podcast_logos_fran') ): ?>
                        <?php while( have_rows('podcast_logos_fran') ): the_row(); ?>

                            <div class="logo">
                                <a href="<?php the_sub_field('link_to_platform'); ?>" target="_blank">
                                    <img src="<?php the_sub_field('logo'); ?>" alt="">
                                </a>
                            </div>

                        <?php endwhile; ?>
                    <?php endif; ?>
                </div>
                <!-- // logos  -->
                <a href="<?php the_field('button_link_podcat_fran'); ?>" target="_blank" class="btn-more"><?php the_field('button_label_podcast_fran'); ?></a>
            </div>
            <!-- // podcast text  -->

            <div class="podcast-image">
                <img src="<?php the_field('featured_image_podcast_fran'); ?>" alt="">
            </div>
            <!-- // image  -->

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/podcast-bg.svg" alt="" class="img-side">

        </div>
        <!-- // container  -->
    </section>
    <!-- // podcast  -->

    <div id="order-cta">

        <img src="<?php bloginfo('template_directory'); ?>/img/bg/key-bg.svg" alt="" class="side-img">

        <div class="container">
            <img src="<?php the_field('order_image_cta'); ?>" alt="" class="download">
            <div class="cta-text">
                <h3><?php the_field('cta_title_order_cta'); ?></h3>
                <?php the_field('cta_text_order_cta'); ?>
                <a href="<?php the_field('button_1_link_order_cta'); ?>" target="_blank" class="btn btn-more"><?php the_field('button_1_label_cta_order'); ?></a>
                <a href="<?php the_field('button_2_link_order_cta'); ?>" target="_blank" class="btn btn-order"><?php the_field('button_2_label_order_cta'); ?></a>
            </div>
            <!-- // text  -->
        </div>
        <!-- // container  -->
    </div>
    <!-- // order cta  -->

    <section id="in-action">

        <div class="container">

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/action-bg.svg" alt="" class="img-side">

            <header>
                <h2><?php the_field('section_title_in_action_page'); ?></h2>
            </header>
            <!-- // header  -->
            <div class="videos-list">
                <?php if( have_rows('action_videos_repe') ): ?>
                    <?php while( have_rows('action_videos_repe') ): the_row(); ?>

                        <div class="video-card">
                            <h3><?php the_sub_field('video_title'); ?></h3>
                            <div class="video-holder">
                                <?php the_sub_field('video_code'); ?>
                                <!-- <span class="icon-play"></span> -->
                            </div>
                            <!-- // video holder  -->
                        </div>
                        <!-- // card  -->

                    <?php endwhile; ?>
                <?php endif; ?>
            </div>
            <!-- // videos list  -->
        </div>
        <!-- // container  -->
    </section>
    <!-- // in action  -->

    <div id="awards">
        <header>
            <h4><?php the_field('section_title_awards_podcast'); ?></h4>
        </header>
        <!-- // header  -->
        <div id="awards-wrapper">
            <div class="container">
                <?php if( have_rows('awards_list_logos') ): ?>
                <?php while( have_rows('awards_list_logos') ): the_row(); ?>

                    <div class="logo">
                        <img src="<?php the_sub_field('logo'); ?>" alt="">
                    </div>
                    <!-- // logo  -->

                <?php endwhile; ?>
                <?php endif; ?>
            </div>
            <!-- // container  -->
        </div>
        <!-- // wrapper  -->
    </div>
    <!-- // awards  -->

    <div id="fran-content">
        <div class="container">

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/forbes-bg.svg" alt="" class="bottom-shape">

            <?php if( have_rows('content_blocks_pod') ): ?>
                <?php while( have_rows('content_blocks_pod') ): the_row(); ?>

                    <div class="content-wrapper">
                        <div class="image-holder">
                            <img src="<?php the_sub_field('featured_image'); ?>" alt="">
                        </div>
                        <!-- // image  -->
                        <div class="content-text">
                            <h3><?php the_sub_field('block_title'); ?></h3>
                            <?php the_sub_field('content_block'); ?>
                            <?php if( get_sub_field('button_label') ): ?>
                                <a href="<?php the_sub_field('button_link'); ?>" target="_blank" class="btn-more"><?php the_sub_field('button_label'); ?></a>
                            <?php endif; ?>
                        </div>
                        <!-- // text  -->
                    </div>
                    <!-- // wrapper  -->

                <?php endwhile; ?>
            <?php endif; ?>
        </div>
        <!-- // container  -->
    </div>
    <!-- // fran content  -->
  
<?php get_footer(); ?>
