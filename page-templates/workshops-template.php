<?php
/**
 * Template Name: Workshops Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
?>

    <header id="video-header">

        <div style="padding:56.25% 0 0 0;position:relative;">
            <iframe src="https://player.vimeo.com/video/327932168?autoplay=1&loop=1&background=1&title=0&byline=0&portrait=0&speed=0&badge=0&autopause=0&player_id=0&app_id=58479/embed" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen frameborder="0" style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
        </div>

        <div class="overlay">
            <div class="container">
                <div class="hero-caption">
                    <h1><?php the_field('main_title_header_workshop'); ?></h1>
                    <span class="icon-play"></span>
                </div>
                <!-- // caption  -->
            </div>
            <!-- // container  -->
        </div>
        <!-- // overlay  -->
    </header>
    <!-- // video heder  -->

    <div id="purpose">
        <div class="container">

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/video-bg.svg" alt="" class="top-shape">

            <div class="image-holder">
               
            <div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/331268351?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="WHY DISCOVERY SERIES"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

            </div>
            <!-- // image holder  -->
            <div class="text-block">
                <h2><?php the_field('block_title_purpose_page'); ?></h2>
                <?php the_field('content_block_purpose_page'); ?>
                <a href="<?php the_field('button_link_purpose_page'); ?>" class="btn-more"><?php the_field('button_label_purpose_page'); ?></a>
            </div>
            <!-- // text block  -->
        </div>
    </div>
    <!-- // purpoise  -->

    <section id="our-experience">
        <div class="container">
            <header>
                <h2><?php the_field('section_title_exp_page'); ?></h2>
            </header>
            <!-- // header  -->
            <div class="experience-wrapper">
                <div class="text-block">
                    <?php the_field('content_block_exp_page'); ?>
                    <a href="<?php the_field('button_link_exp_page'); ?>" class="btn-more"><?php the_field('button_label_exp_page'); ?></a>
                </div>
                <!-- // block of text  -->
                <div class="image-holder">
                    <?php
                    $imageID = get_field('featured_image_exp_page');
                    $image = wp_get_attachment_image_src( $imageID, 'purpose-image' );
                    $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                    ?> 

                    <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" />                     
                </div>
                <!-- // image holder  -->
            </div>
            <!-- // wrapper  -->
            <img src="<?php bloginfo('template_directory'); ?>/img/bg/msg-bg.svg" alt="" class="side-shape">
        </div>
        <!-- // contaienr  -->
    </section>
    <!-- // expeirience  -->

    <div id="our-testimonials">
        <div class="container">
            <header>
                <h3><?php the_field('section_title_test_page_res'); ?></h3>
            </header>
            <!-- // heder  -->
            <div class="row">
                <?php if( have_rows('testimonails_list_resources') ): ?>
                    <?php while( have_rows('testimonails_list_resources') ): the_row(); ?>

                        <div class="col-lg-4 col-md-4">
                            <div class="review-card">
                                <?php
                                $imageID = get_sub_field('client_photo');
                                $image = wp_get_attachment_image_src( $imageID, 'test-image' );
                                $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                ?> 

                                <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" /> 
                                <?php the_sub_field('review'); ?>
                                <span class="author"><?php the_sub_field('author'); ?></span>
                                <span class="position"><?php the_sub_field('position'); ?></span>
                            </div>
                        </div>
                        <!-- // review card  -->

                    <?php endwhile; ?>
                <?php endif; ?>
            </div>
            <!-- // row  -->
        </div>
        <!-- // container  -->
    </div>
    <!-- // reviews  -->

    <div id="organization">
        <div class="container">

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/gap-bg.svg" alt="" class="side-bg">

            <header>
                <h3><?php the_field('section_title_org_work'); ?></h3>
                <?php the_field('intro_text_org_workshop'); ?>
            </header>
            <div class="row">
            <?php if( have_rows('content_blocks_org_works') ): ?>
                <?php while( have_rows('content_blocks_org_works') ): the_row(); ?>

                    <div class="col-md-6">
                        <div class="org-card">
                            <div class="org-cover">
                                <div class="org-icon">
                                    <img src="<?php the_sub_field('icon'); ?>" alt="">
                                </div>
                                <!-- // icon  -->
                                <h3><?php the_sub_field('title'); ?></h3>
                            </div>
                            <!-- // cover  -->
                            <div class="org-text">
                                <?php the_sub_field('content_block'); ?>
                            </div>
                            <!-- // text  -->
                        </div>
                        <footer>
                            <a href="<?php the_sub_field('button_link'); ?>" class="btn-more"><?php the_sub_field('button_label'); ?></a>
                        </footer>
                    </div>
                    <!-- // card  -->

                <?php endwhile; ?>
            <?php endif; ?>
            </div>
            <!-- // row  -->
        </div>
        <!-- // container  -->
    </div>
    <!-- // organization  -->

    <div id="key-video">
        <div class="container">
            <header>
                <h3><?php the_field('section_title_key_video_page'); ?></h3>
            </header>
            <!-- // heder  -->
            <div id="video-holder">

            <iframe src="https://player.vimeo.com/video/341703217?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="top:0;left:0;width:100%;height:100%;" title="The WHY Workshop Series - Testimonials"></iframe><script src="https://player.vimeo.com/api/player.js"></script>

            </div>
            <!-- // video holder  -->
        </div>
    </div>
    <!-- // key video  -->

    <div id="bottom-form">
        <div class="container">
            <div id="form-wrapper">

                <header>
                    <h3><?php the_field('form_title_key_page'); ?></h3>
                </header>

                <div class="form-inner">
                    <?php the_field('form_code_key_page'); ?>
                </div>
                <!-- // inner  -->

            </div>
            <!-- // form wrapper  -->

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/framework-bottom.svg" class="bottom-shape" alt="">

        </div>
        <!-- // container  -->
    </div>
    <!-- // bototm form  -->
  
<?php get_footer(); ?>
