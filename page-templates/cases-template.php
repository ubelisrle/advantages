<?php
/**
 * Template Name: Case Story Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
?>

    <header id="header-cases">
        <div class="container">
            <div class="header-caption">
                <iframe src="<?php bloginfo('template_directory'); ?>/img/misc/infuse.html"  class="shape" frameborder="0"></iframe>

                <h1><?php the_field('main_title_header_case'); ?></h1>
            </div>
            <!-- // caption  -->
        </div>
        <!-- // container  -->
        <iframe src="<?php bloginfo('template_directory'); ?>/img/misc/infuse.html"  class="image-side" frameborder="0"></iframe>
    </header>
    <!-- // hader cases  -->

    <section id="case-stories">
        <div class="container">
            <div class="case-listing row">
                <?php
                $loop = new WP_Query( array( 'post_type' => 'casestudies', 'posts_per_page' => 100) ); ?>  
                <?php while ( $loop->have_posts() ) : $loop->the_post(); ?>

                    <div class="col-lg-4 col-md-6">

                        <?php if (get_field('case_study_color_case') == 'Orange') { ?>
                            <div class="case-card card-orange">
                        <?php } elseif (get_field('case_study_color_case') == 'Red') { ?>
                            <div class="case-card card-red">
                        <?php } elseif (get_field('case_study_color_case') == 'Dark Blue') { ?>
                            <div class="case-card card-dark">
                        <?php } elseif (get_field('case_study_color_case') == 'Pink') { ?>
                            <div class="case-card card-pink">
                        <?php } elseif (get_field('case_study_color_case') == 'Light Blue') { ?>
                            <div class="case-card card-light">
                        <?php } ?>   

                            <a href="<?php echo get_permalink(); ?>">

                            <div class="case-photo">
                                <?php
                                $imageID = get_field('featured_image_case');
                                $image = wp_get_attachment_image_src( $imageID, 'case-image' );
                                $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                ?> 

                                <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" />  
                                <div class="case-info">

                                    <div class="benefits">
                                        <span class="value"><?php the_field('benefits'); ?></span>
                                        <span class="desc"><?php the_field('benefits_description'); ?></span>
                                    </div>
                                    <!-- // benefits  -->
                                    
                                </div>
                                <!-- // info -->
                            </div>
                            <!-- // photo  -->
                            <div class="case-desc">
                                <h2><?php the_title(); ?></h2>
                                <?php the_field('intro_text_cases'); ?>    
                                                  
                            </div>
                            <!-- // desc  -->
                            </a>
                        </div>
                        <!-- // card  -->
                        </a>  
                    </div>

                <?php endwhile; ?>
                <?php wp_reset_postdata(); ?>                  
            </div>
            <!-- // listing  -->
        </div>
        <!-- // container  -->
    </section>
    <!-- // case studies  -->


<?php get_footer(); ?>
