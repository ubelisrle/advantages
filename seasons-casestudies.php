<?php

/*
 * Template Name: Seasons Kosher Chamber
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
        <div class="container seasons-benefits">
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

    <section id="case-single" class="seasons-case">

        <div class="case-intro">
    
            <img src="<?php bloginfo('template_directory'); ?>/img/bg/seasons-shape-right.png" alt="" class="shape-right">

            <div class="container">

                <div class="intro-text">
                    <h2><?php the_field('block_title_intro_seasons'); ?></h2>
                    <?php the_field('block_content_intro_seasons'); ?>
                </div>  

                <div class="image-holder">
                    <img class="img-responsive" src="<?php the_field('featured_image_intro_seasons'); ?>" alt="">
                    <span class="caption"><?php the_field('caption_intro_seasons'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/arrow-up.svg" alt=""></span>

                </div>

            </div>
            <!-- // container  -->
        </div>
        <!-- // case intro  -->   

        <div class="case-values">
            <img src="<?php bloginfo('template_directory'); ?>/img/bg/seasons-shape-left.png" alt="" class="shape-left">
            <div class="container">

                <div class="case-images">
                    <div class="top-image">
                        <img class="img-responsive" src="<?php the_field('top_image_values_seasons'); ?>" alt="">
                        <span class="caption"><?php the_field('caption_top_image_seas'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/arrow-up.svg" alt=""></span>
                    </div>
                    <!-- // top image  -->
                    <div class="bottom-imagex">
                        <img class="img-responsive" src="<?php the_field('bottom_image_seas_values'); ?>" alt="">
                        <span class="caption"><?php the_field('caption_bottom_values_seas'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/arrow-right.svg" alt=""></span>                        
                    </div>
                    <!-- // bototm image  -->
                </div>
                <!-- // case images  -->

                <div class="case-text">
                    <h2><?php the_field('block_title_vakues_seas'); ?></h2>
                    <?php the_field('content_block_values_seas'); ?>
                    <a href="<?php the_field('button_link_seas_values'); ?>" class="btn-cta"><?php the_field('button_label_seas_values'); ?></a>
                </div>
                <!-- // text  -->

            </div>
            <!-- // contaiener  -->
        </div>
        <!-- // case values  -->

        <div class="case-growth">
            <div class="container">

                <div class="intro-text">
                    <h2><?php the_field('block_title_browth_seas'); ?></h2>
                    <?php the_field('block_content_growth_seas'); ?>
                </div>  

                <div class="image-holder">
                    <img class="img-responsive" src="<?php the_field('featured_image_browth_seas'); ?>" alt="">
                    <span class="caption"><?php the_field('caption_growth_sas'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/arrow-up.svg" alt=""></span>

                </div>

            </div>
            <!-- // container  -->
        </div>
        <!-- // case intro  -->   
        
        <div class="bottom-image">
            <img src="<?php bloginfo('template_directory'); ?>/img/bg/seasons-shape-right.png" alt="" class="shape-right">
            <div class="container">
                <span class="caption"><?php the_field('caption_growth_bottom_image_seas'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/down-arrow.svg" alt=""></span>                    
                <img class="img-responsive" src="<?php the_field('bottom_image_growth_seas'); ?>" alt="">
            </div>
        </div>
        <!-- // bottom iamge  -->      
        
        <div class="case-intro">
    
            <img src="<?php bloginfo('template_directory'); ?>/img/bg/seasons-shape-left.png" alt="" class="shape-left">

            <div class="container">

                <div class="intro-text">
                    <h2><?php the_field('block_title_keys_seas'); ?></h2>
                    <?php the_field('content_block_keys_seas'); ?>
                </div>  

                <div class="image-holder">
                    <img class="img-responsive" src="<?php the_field('featured_image_keys_seas'); ?>" alt="">
                    <span class="caption"><?php the_field('caption_keys_seas'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/arrow-up.svg" alt=""></span>

                </div>

            </div>
            <!-- // container  -->
        </div>
        <!-- // case intro  -->       
        
        <div class="success-images">
            <div class="container">
            <?php if( have_rows('success_images_keys_seas') ): ?>
                <?php while( have_rows('success_images_keys_seas') ): the_row(); ?>

                    <div class="image-holder">
                        <span class="caption"><?php the_sub_field('caption'); ?><img src="<?php bloginfo('template_directory'); ?>/img/ico/down-arrow.svg" alt=""></span>                            
                        <img class="img-responsive" src="<?php the_sub_field('featured_image'); ?>" alt="">
                    </div>

                <?php endwhile; ?>
            <?php endif; ?>
            </div>
        </div>
        <!-- // images  -->

        <div class="brand-case">
            <div class="container">
                <header>
                    <h2><?php the_field('block_title_brand_seas'); ?></h2>
                    <img src="<?php the_field('brand_logo_seas'); ?>" alt="">
                </header>
                <div class="row">
                    <?php if( have_rows('brands_list_seas') ): ?>
                        <?php while( have_rows('brands_list_seas') ): the_row(); ?>

                            <div class="col-lg-3 col-sm-6">
                                <div class="brand-card">
                                    <div class="brand-logo">
                                        <img src="<?php the_sub_field('featured_logo'); ?>" alt="">
                                    </div>
                                    <!-- // logo  -->
                                    <div class="brand-shots">
                                        <img src="<?php the_sub_field('featured_image'); ?>" alt="">
                                    </div>
                                    <!-- // shots  -->
                                </div>
                            </div>
                            <!-- // card  -->

                        <?php endwhile; ?>
                    <?php endif; ?>
                </div>
                <!-- // row  -->
            </div>
        </div>
        <!-- // brands  -->

        <footer>
            <a href="<?php bloginfo('url'); ?>/case-stories" class="btn-more">Back to Case Stories <span class="icon-Polygon-44"></span></a>
            <a href="#top-page" class="btn-more btn-up">Back to top <span class="icon-Polygon-44-uper"></span></a>
        </footer>

    </section>
    <!-- // case single  -->


<?php get_footer(''); ?>