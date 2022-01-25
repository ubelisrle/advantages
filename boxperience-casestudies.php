<?php

/*
 * Template Name: Boxperience Chamber
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

    <section id="case-single" class="boxperience-case">

        <div class="case-intro">
            <div class="container">
                <div class="row">

                    <div class="col-lg-6 col-sm-6">
                        <div class="intro-text">
                            <h2><?php the_field('block_title_intro_box'); ?></h2>
                            <?php the_field('intro_text_intro_box'); ?>
                            <a href="<?php the_field('button_link_box_intro'); ?>" class="btn-cta"><?php the_field('button_label_intro_box'); ?></a>
                        </div>  
                    </div>
                    <!-- // text  -->

                    <div class="col-lg-6 col-sm-6">
                        <div class="image-holder">
                            <img class="img-responsive" src="<?php the_field('featured_image_intro_box'); ?>" alt="">
                            <span class="caption"><?php the_field('caption_box_intro'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/arrow-up.svg" alt=""></span>

                        </div>
                    </div>
                    <!-- // image  -->

                </div>
                <!-- // row  -->
            </div>
            <!-- // container  -->
            <img src="<?php bloginfo('template_directory'); ?>/img/bg/eventus-shadow-right.png" alt="" class="img-shape-right">
        </div>
        <!-- // case intro  -->

        <div class="case-features">
            <div class="container">
                <div class="row">

                    <div class="col-lg-7 col-sm-6">
                        <div class="image-holder">
                            <?php if( have_rows('list_of_images_box') ): ?>
                            <?php while( have_rows('list_of_images_box') ): the_row(); ?>
                                <div class="image-box">
                                    <img class="img-responsive" src="<?php the_sub_field('featured_image'); ?>" alt="">
                                    <span class="caption"><?php the_sub_field('caption'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/arrow-up.svg" alt=""></span>
                                </div>
                                <!-- // list  -->
                            <?php endwhile; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                    <!-- // image holder  -->

                    <div class="col-lg-5 col-sm-6">
                        <div class="features-text">
                            <?php the_field('top_content_feat_box'); ?>
                            <div class="features-list">
                                <ul>
                                <?php if( have_rows('features_list_feat_box') ): ?>
                                    <?php while( have_rows('features_list_feat_box') ): the_row(); ?>

                                        <li><img src="<?php the_sub_field('icon'); ?>" alt=""><?php the_sub_field('feature_label'); ?></li>

                                    <?php endwhile; ?>
                                <?php endif; ?>
                                </ul>
                            </div>
                            <!-- // list  -->
                            <?php the_field('bottom_content_features_box'); ?>
                        </div>
                    </div>
                    <!-- // text  -->

                </div>
                <!-- // row  -->
            </div>
            <!-- // container  -->
            <img src="<?php bloginfo('template_directory'); ?>/img/bg/seasons-shape-left.png" alt="" class="shape-left">            
        </div>
        <!-- //features  -->

        <div class="case-work">
            <div class="container">
                <header>
                    <h3><?php the_field('block_title_portfolio_box'); ?></h3>
                </header>
                <!-- // header  -->
                <div class="work-list">
                <?php if( have_rows('work_list_portfolio_box') ): ?>
                <?php while( have_rows('work_list_portfolio_box') ): the_row(); ?>

                    <div class="work-card">
                        <span class="caption"><?php the_sub_field('caption'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/down-arrow.svg" alt=""></span>

                        <img class="img-responsive" src="<?php the_sub_field('featured_image'); ?>" alt="">

                    </div>
                    <!-- // card  -->

                <?php endwhile; ?>
                <?php endif; ?>
                </div>
                <!-- // list  -->
            </div>
            <!-- // container  -->
            <img src="<?php bloginfo('template_directory'); ?>/img/bg/box-shape-right.png" alt="" class="shape-right">
        </div>
        <!-- // case work  -->

        <footer>
            <a href="<?php bloginfo('url'); ?>/case-stories" class="btn-more">Back to Case Stories <span class="icon-Polygon-44"></span></a>
            <a href="#top-page" class="btn-more btn-up">Back to top <span class="icon-Polygon-44-uper"></span></a>
        </footer>

    </section>
    <!-- // case single  -->


<?php get_footer(''); ?>