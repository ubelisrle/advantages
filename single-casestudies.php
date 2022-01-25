<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package CodeFavorite_Starter_Theme
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

    <section id="case-single">

        <?php if( have_rows('section_blocks_single_case') ): ?>
            <?php while( have_rows('section_blocks_single_case') ): the_row(); ?>
                <?php if( get_row_layout() == 'content_left_image_right' ): ?>

                    <div class="content-wrapper">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-6 col-md-6">
                                    <div class="content-block">
                                        <h2><?php the_sub_field('main_title'); ?></h2>
                                        <?php the_sub_field('content_block'); ?>
                                        <?php if( get_sub_field('button_label') ): ?>
                                            <a href="<?php the_sub_field('button_link'); ?>" class="btn-cta"><?php the_sub_field('button_label'); ?></a>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                <!-- // content block  -->
                                <div class="col-lg-5 offset-lg-1 image-col col-md-6 offset-md-0">
                                    <div class="image-holder">
                                        
                                        <?php if ( get_sub_field( 'background_image' ) ): ?>
                                            <img src="<?php bloginfo('template_directory'); ?>/img/bg/content-right.svg" alt="" class="img-shape">
                                        <?php else: ?>
                                        <?php endif; ?>     
                                    

                                        <?php
                                        $imageID = get_sub_field('featured_image');
                                        $image = wp_get_attachment_image_src( $imageID, 'half-image' );
                                        $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                        ?> 

                                        <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" /> 
                                    </div>
                                </div>
                                <!-- // image  -->
                            </div>
                            <!-- // row  -->
                        </div>
                        <!-- // container  -->
                    </div>
                    <!-- // content wrapper  -->

                <?php elseif( get_row_layout() == 'video' ): ?>

                    <div class="video-wrapper">
                        <div class="container">
                            <img src="<?php bloginfo('template_directory'); ?>/img/bg/video-left.svg" alt="" class="top-shape">
                            <?php if( get_sub_field('section_title') ): ?>
                            <header>
                                <h2><?php the_sub_field('section_title'); ?></h2>
                            </header>
                            <?php endif; ?>

                            <div class="video-holder">
                                <div class="embed-container">
                                    <a href="<?php the_sub_field('video'); ?>">
                                    <?php
                                    $imageID = get_sub_field('video_screenshot');
                                    $image = wp_get_attachment_image_src( $imageID, 'half-image' );
                                    $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                    ?> 

                                    <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" />     
                                    </a>          
                                </div>       
                                <!-- // container -->
                                <span class="caption"><?php the_sub_field('caption_video'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/arrow-up.svg" alt=""></span>                      
                            </div>
                            <!-- // video  -->

                        </div>
                    </div>
                    <!-- // vidoe wrapper  -->

                <?php elseif( get_row_layout() == 'image_left_content_right' ): ?>

                    <div class="content-wrapper">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-5 image-col col-md-6">
                                    <div class="image-holder">

                                        <?php if ( get_sub_field( 'background_image_left' ) ): ?>
                                            <img src="<?php bloginfo('template_directory'); ?>/img/bg/content-right.svg" alt="" class="img-shape-left">
                                        <?php else: ?>
                                        <?php endif; ?>                                    

                                        <?php
                                        $imageID = get_sub_field('featured_image');
                                        $image = wp_get_attachment_image_src( $imageID, 'half-image' );
                                        $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                        ?> 

                                        <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" /> 
                                        <span class="caption"><?php the_sub_field('image_caption'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/arrow-up.svg" alt=""></span>
                                    </div>
                                </div>
                                <!-- // image  -->
                                <div class="col-lg-6 offset-lg-1 col-md-6 offset-md-0">
                                    <div class="content-block">
                                        <?php if( get_sub_field('block_title') ): ?>
                                            <h2><?php the_sub_field('block_title'); ?></h2>
                                        <?php endif; ?>
                                        <?php the_sub_field('content_block'); ?>
                                        <?php if( get_sub_field('button_label') ): ?>
                                            <a href="<?php the_sub_field('button_link'); ?>" class="btn-cta"><?php the_sub_field('button_label'); ?></a>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                <!-- // content block  -->                            
                            </div>
                            <!-- // row  -->
                        </div>
                    </div>
                    <!-- // content wrapper  -->

                    <?php elseif( get_row_layout() == 'cta' ): ?>

                    <div class="case-cta">
                        <div class="container">
                            <div class="cta-text">
                                <h2><?php the_sub_field('cta_title'); ?></h2>
                                <a href="<?php the_sub_field('button_link'); ?>" target="_blank" class="btn-cta"><?php the_sub_field('button_label'); ?></a>
                            </div>
                            <!-- // text  -->
                            <img src="<?php the_sub_field('featured_image'); ?>" alt="">
                        </div>
                        <!-- // container  -->
                    </div>
                    <!-- // case cta  -->

                <?php elseif( get_row_layout() == 'testimonials' ): ?>

                    <div class="testimonials-stories">
                        <div class="container">
                            <div class="reviews-wrapper">
                                <h3><?php the_sub_field('block_title'); ?></h3>
                                <div class="review-block">
                                    <?php the_sub_field('review_text'); ?>
                                    <span class="author"><?php the_sub_field('author'); ?></span>
                                </div>
                                <!-- // block  -->
                            </div>
                            <!-- // wrapper  -->
                        </div>
                        <!-- // container  -->
                    </div>
                    <!-- // stories  -->
                    
                <?php endif; ?>
            <?php endwhile; ?>
        <?php endif; ?>        

        <footer>
            <a href="<?php bloginfo('url'); ?>/case-stories" class="btn-more">Back to Case Stories <span class="icon-Polygon-44"></span></a>
            <a href="#top-page" class="btn-more btn-up">Back to top <span class="icon-Polygon-44-uper"></span></a>
        </footer>

    </section>
    <!-- // case single  -->


<?php get_footer(''); ?>