<?php

/*
 * Template Name: Eventus Chamber
 * Template Post Type: casestudies
 */

get_header();
?>

	<?php
	$imageID = get_field('background_image_case_single');
	$image = wp_get_attachment_image_src( $imageID, 'full-image' );
	$alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
	?> 

    <div id="mobile-case--header">

        <div class="eventus-header">  

        <?php 
        $values = get_field( 'main_title_hero_case' );
        if ( $values ) { ?>
            <h2><?php the_field('main_title_hero_case'); ?></h2>
        <?php 
        } else { ?>
            <h2><?php the_title(); ?></h2>
        <?php } ?>


            <h4><?php the_field('subtitle_hero_case'); ?></h4>

        </div>
        <!-- // inner  -->
    </div>
    <!-- // mobile case header  -->

	<div class="parallax-window" id="case-header" data-parallax="scroll" data-image-src="<?php echo $image[0]; ?>">
		<div class="overlay">
            <div class="container">
                <div class="hero-caption">

                    <?php 
                    $values = get_field( 'main_title_hero_case' );
                    if ( $values ) { ?>
                        <h1><?php the_field('main_title_hero_case'); ?></h1>
                    <?php 
                    } else { ?>
                        <h1><?php the_title(); ?></h1>
                    <?php } ?>

                    
                    <h2><?php the_field('subtitle_hero_case'); ?></h2>
                </div>
                <!-- // caption  -->

                <img src="<?php the_field('shape_image_cases'); ?>" alt="" class="shape shape-eventus">


            </div>
            <!-- // container  -->
        </div>
        
	</div>
    <!-- // parlaax  -->

    <div id="case-benefits">
        <div class="container talson-benefits">
            <?php if( have_rows('benefits_list_single') ): ?>
            <?php while( have_rows('benefits_list_single') ): the_row(); ?>

                <div class="benefit-card">

                    <span class="value">
                        <?php the_sub_field('value_before'); ?><span class='numscroller' 
                        data-min='1' 
                        data-max='<?php the_sub_field('value'); ?>' 
                        data-delay='<?php the_sub_field('delay'); ?>' 
                        data-increment='<?php the_sub_field('increment'); ?>'>
                        
                            <?php the_sub_field('value'); ?></span><small><?php the_sub_field('value_after'); ?></small>

                    </span>
                   <!-- // value  -->

                    <span class="desc"><?php the_sub_field('description'); ?></span>
                </div>
                <!-- // card  -->

            <?php endwhile; ?>
            <?php endif; ?>
        </div>
        <!-- // container  -->
    </div>
    <!-- // case benefits  -->

    <section id="case-single" class="eventus-case">

        <div class="case-intro">
            <div class="container">

                <div class="intro-text">
                    <h2><?php the_field('block_title_intro_eventus'); ?></h2>
                    <?php the_field('content_block_intro_eventus'); ?>
                </div>  

                <div class="image-holder">
                    <?php if( have_rows('featured_images_eventus_intro') ): ?>
                    <?php while( have_rows('featured_images_eventus_intro') ): the_row(); ?>

                        <div class="item">

                            <?php if( get_sub_field('caption') ): ?>
                                <span class="caption"><?php the_sub_field('caption'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/arrow-up.svg" alt=""></span>
                            <?php endif; ?>

                            <div class="image-holderx">
                                <img class="img-responsive" src="<?php the_sub_field('image'); ?>" alt="">
                            </div>
                            
                        </div>

                    <?php endwhile; ?>
                    <?php endif; ?>
                </div>

            </div>
            <!-- // container  -->
            <img src="<?php bloginfo('template_directory'); ?>/img/bg/eventus-shadow-right.png" alt="" class="img-shape-right">
        </div>
        <!-- // case intro  --> 

        <div class="case-values">

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/seasons-shape-left.png" alt="" class="img-shape-left">
        
            <div class="container">

                <div class="case-images">
                    <img class="img-responsive" src="<?php the_field('featured_image_eventus_about'); ?>" alt="">
                    <span class="caption"><?php the_field('caption_eventus_about'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/arrow-up.svg" alt=""></span>
                </div>
                <!-- // case images  -->

                <div class="case-text">
                    <h2><?php the_field('block_title_about_eventus'); ?></h2>
                    <?php the_field('content_block_about_eventus'); ?>
                    <a href="<?php the_field('website_button_link'); ?>" target="_blank" class="btn-cta btn-website"><?php the_field('website_button_1'); ?></a>
                    <a href="<?php the_field('button_label_eventus_aobut'); ?>" class="btn-cta"><?php the_field('button_label_about_eventus'); ?></a>
                </div>
                <!-- // text  -->

            </div>
            <!-- // contaiener  -->
        </div>
        <!-- // case values  --> 
        
        <div class="case-performance">

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/seasons-shape-left.png" alt="" class="img-shape-right">
        
            <div class="container">                

                <div class="case-text">
                    <h2><?php the_field('block_title_performance_aventus'); ?></h2>
                    <p><?php the_field('block_subtitle_performance_aventus'); ?></p>                    
                </div>
                <!-- // text  -->

                <div class="stats">
                    <div class="stat-one stat">
                    <img src="<?php bloginfo('template_directory'); ?>/img/misc/stat-1.png" alt="" class="stat-img">
                    <h4><?php the_field('statistics_1'); ?></h4>
                    </div>
                    <div class="stat-two stat">
                    <img src="<?php bloginfo('template_directory'); ?>/img/misc/stat-2.png" alt="" class="stat-img">
                    <h4><?php the_field('statistics_2'); ?></h4>
                    </div>
                    <div class="stat-two stat">
                    <img src="<?php bloginfo('template_directory'); ?>/img/misc/stat-3.png" alt="" class="stat-img">
                    <h4><?php the_field('statistics_3'); ?></h4>
                    </div>
                </div>

            </div>
            <!-- // contaiener  -->
        </div>
        <!-- // case performance  -->
        
        <div class="case-portfoliox">
            <div class="container">
            <?php if( have_rows('portfolio_list_eventus') ): ?>
                <?php while( have_rows('portfolio_list_eventus') ): the_row(); ?>

                    <div class="portoflio-card">
                        <span class="caption"><?php the_sub_field('caption'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/down-arrow.svg" alt=""></span>
                        <img class="img-responsive" src="<?php the_sub_field('featured_image'); ?>" alt="">
                    </div>
                    <!-- // card  -->

                <?php endwhile; ?>
            <?php endif; ?>
            </div>

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/eventus-shadow-right.png" alt="" class="img-shape-right">

        </div>
        <!-- // portoflio  -->

        <div class="case-testimonials">
            <div class="container">
                <div class="reviews-wrapper">
                    <h3><?php the_field('block_title_reviews_aventus'); ?></h3>
                    <div class="review-block">
                        <?php the_field('reviews_text_eventus_test'); ?>
                        <span class="author"><?php the_field('author_reviews_eventus'); ?></span>
                    </div>
                    <!-- // block  -->
                </div>
                <!-- // wrapper  -->
            </div>
            <!-- // container  -->
        </div>
        <!-- // stories  -->          

        <footer>
            <a href="<?php bloginfo('url'); ?>/case-stories" class="btn-more">Back to Case Stories <span class="icon-Polygon-44"></span></a>
            <a href="#top-page" class="btn-more btn-up">Back to top <span class="icon-Polygon-44-uper"></span></a>
        </footer>

    </section>
    <!-- // case single  -->


<?php get_footer(''); ?>