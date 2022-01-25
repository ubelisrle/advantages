<?php

/*
 * Template Name: French American Chamber
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

        <?php if (get_field('case_study_color_case') == 'Orange') { ?>
            <div class="orange-header">
        <?php } elseif (get_field('case_study_color_case') == 'Red') { ?>
            <div class="red-header">
        <?php } elseif (get_field('case_study_color_case') == 'Dark Blue') { ?>
            <div class="dark-header">
        <?php } elseif (get_field('case_study_color_case') == 'Pink') { ?>
            <div class="pink-header">
        <?php } elseif (get_field('case_study_color_case') == 'Light Blue') { ?>
            <div class="light-header">
        <?php } ?>   

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

                <img src="<?php the_field('shape_image_cases'); ?>" alt="" class="shape">


            </div>
            <!-- // container  -->
        </div>
        
	</div>
    <!-- // parlaax  -->

    <div id="case-benefits">
        <div class="container">
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

    <section id="case-single" class="french-case">

        <div class="case-about case-content--wrapper">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6 col-md-6">
                        <div class="content-block">
                            <h2><?php the_field('block_title_about_french'); ?></h2>
                            <?php the_field('block_text_french_about'); ?>
                                <a href="<?php the_field('button_link_about_french'); ?>" class="btn-cta"><?php the_field('button_label_about_french'); ?></a>
                        </div>
                    </div>
                    <!-- // content block  -->
                    <div class="col-lg-6 image-col col-md-6 offset-md-0">
                        <div class="image-holder">
                                                        
                            <img src="<?php the_field('featured_image_about_french'); ?>" alt="" class="img-responsive">
                        

                                
                        </div>
                    </div>
                    <!-- // image  -->
                </div>
                <!-- // row  -->
            </div>
            <!-- // container  -->
        </div>
        <!-- // content wrapper case about  -->       

        <img src="<?php bloginfo('template_directory'); ?>/img/bg/big-left-shape.svg" alt="" class="big-shape">
        
        <div class="case-result case-content--wrapper">
            <div class="container">
                <div class="row">
                    <div class="col-lg-5 image-col col-md-6 results-image">
                        <div class="image-holder">                                   

                            <img src="<?php the_field('featured_image_results_french'); ?>" alt="" class="img-responsive">

                        </div>
                    </div>
                    <!-- // image  -->
                    <div class="col-lg-6 offset-lg-1 col-md-6 offset-md-0">
                        <div class="content-block content-block--top">
                            <?php the_field('block_content_results_french'); ?>
                            <div class="awards">
                                <?php if( have_rows('awards_french') ): ?>
                                <?php while( have_rows('awards_french') ): the_row(); ?>

                                    <img src="<?php the_sub_field('logo'); ?>" alt="">

                                <?php endwhile; ?>
                                <?php endif; ?>
                            </div>
                            <!-- // awards  -->
                        </div>
                    </div>
                    <!-- // content block  -->                            
                </div>
                <!-- // row  -->
            </div>
        </div>
        <!-- // content wrapper  -->     

        <div class="case-testimonials">
            <div class="container">
                <div class="reviews-wrapper">
                    <h3><?php the_field('block_title_test_french'); ?></h3>
                    <div class="review-block">
                        <?php the_field('testimonial_text_french'); ?>
                        <span class="author"><?php the_field('testimonial_author_french'); ?></span>
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