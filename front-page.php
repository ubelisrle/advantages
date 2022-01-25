<?php get_header(); ?>

    <header id="hero-banner">
        <img src="<?php bloginfo('template_directory'); ?>/img/bg/polygon.png" alt="" class="img-shape">
        <div class="container">
            <div class="hero-caption">

                <div id="hero-slider">

                    <?php if( have_rows('hero_slider_home') ): ?>
                        <?php while( have_rows('hero_slider_home') ): the_row(); ?>

                            <div class="hero-slide">

                                <?php if( get_sub_field('small_title_hero_home') ): ?>
                                    <span class="title"><?php the_sub_field('small_title_hero_home'); ?></span>
                                <?php endif; ?>

                                <h1 class="animated"><?php the_sub_field('main_title_hero_home'); ?> </h1>               
                                <?php the_sub_field('description_text_f'); ?>                 
                            </div>

                        <?php endwhile; ?>
                    <?php endif; ?>

                </div>
                <!-- // hero slider  -->

                <div class="slide-nav"></div>


            </div>
            <!-- // caption  -->
            <footer>
                <?php if( have_rows('cta_buttons_hero_home') ): ?>
                    <?php while( have_rows('cta_buttons_hero_home') ): the_row(); ?>
                        <a href="<?php the_sub_field('link_to_page'); ?>" class="btn-cta"><?php the_sub_field('label'); ?></a>
                    <?php endwhile; ?>
                <?php endif; ?>                
            </footer>
            <!-- // footer cta  -->
        </div>
        <!-- // container  -->
    </header>
    <!-- // hero banner  -->

    <div class="triangle-up"></div>
    <section id="features">
        <div class="container">

            <header class="wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.5s">
                <h3 class="wow fadeIn" data-wow-duration="0.6s" data-wow-delay="0.6s"><?php the_field('section_subtitle_features_home'); ?></h3>
                <h2><?php the_field('section_title_features_home'); ?></h2>
            </header>


            <div id="faq-accordion">

                <?php if( have_rows('features_list_home') ): ?>
                    <?php while( have_rows('features_list_home') ): the_row(); ?>

                        <div class="set">
                            
                            <a href="#" class="accordion-heading">

                               <div class="feature__card">
                                    <div class="feature__icon">
                                        <img src="<?php the_sub_field('icon'); ?>" alt="">
                                    </div>
                                    <div class="feature__desc">
                                        <h4><?php the_sub_field('title'); ?></h4>
                                        <span  class="btn-more"></span>
                                    </div>
                                    <!-- // desc  -->                                    
                               </div>
                               <!-- // card  -->

                            </a>

                            <div class="content">
                                <a href="<?php the_sub_field('link_to_page'); ?>">
                                    <p><?php the_sub_field('hover_text'); ?></p>
                                </a>
                            </div>
                            <!-- // content  -->

                        </div>

                    <?php $i++; $i++; endwhile; ?>
                <?php endif; ?>                

            </div>
            <!-- /#faq-accordion -->            
 
            <div id="features-wrapper">
                
                <?php if( have_rows('features_list_home') ): ?>
                    <?php $i=3; ?>
                    <?php while( have_rows('features_list_home') ): the_row(); ?>

                        <div class="feature__card wow fadeInUp" data-wow-duration="0.<?php echo $i; ?>s" data-wow-delay="0.<?php echo $i; ?>s">
                            <div class="feature__icon">
                                <img src="<?php the_sub_field('icon'); ?>" alt="">
                            </div>
                            <!-- // icon  -->
                            <div class="feature__desc">
                                <h4><?php the_sub_field('title'); ?></h4>
                                <a href="#" class="btn-more"></a>
                            </div>
                            <!-- // desc  -->
                            <div class="feature__hover">
                                <span>
                                    <p><?php the_sub_field('hover_text'); ?></p>
                                </span>
                            </div>
                            <!-- // hover  -->
                        </div>
                        <!-- // card  -->

                    <?php $i++; $i++; endwhile; ?>
                <?php endif; ?>
            </div>
            <!-- // wrapper  -->

            <footer class="wow fadeInUp" data-wow-duration="0.9s" data-wow-delay="0.9s">
                <a href="<?php the_field('button_link_features_home'); ?>" class="btn-cta"><?php the_field('button_label_features_home'); ?></a>
            </footer>

        </div>
        <!-- // container  -->
    </section>
    <!-- // features  -->
    <div class="triangle-down"></div>

    <section id="case-studies">
        <div class="container">
            <img src="<?php bloginfo('template_directory'); ?>/img/bg/case-stories-bg.svg" alt="" class="side-image wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.5s">
            <header>
                <h2 class="wow fadeInDown" data-wow-duration="0.5s" data-wow-delay="0.5s"><?php the_field('section_title_case_home'); ?></h2>
            </header>
            <!-- // header  -->
            <div id="case-list">
                <?php
                    $post_objects = get_field('case_studies_list_home');

                    if( $post_objects ): ?>
                        <?php foreach( $post_objects as $post): // variable must be called $post (IMPORTANT) ?>
                            <?php setup_postdata($post); ?>
                            
                            <?php $i = 3; ?>

                            <div class="case-col wow fadeIn" data-wow-duration="0.<?php echo $i; ?>s" data-wow-delay="0.<?php echo $i; ?>s">
                                <a href="<?php echo get_permalink(); ?>">
                                    <div class="overlay"></div>
                                    <?php
                                    $imageID = get_field('featured_image_case');
                                    $image = wp_get_attachment_image_src( $imageID, 'largeheader-image' );
                                    $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                    ?> 

                                    <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" /> 
                                    <div class="case-caption">
                                        <span class="cat"><?php the_title(); ?></span>
                                        <h4><?php the_field('cateogry_title'); ?></h4>
                                        <small class="btn-more">View <img src="<?php bloginfo('template_directory'); ?>/img/ico/play.png" alt=""></small>
                                    </div>
                                    <!-- // caption  -->
                                </a>
                            </div>
                            <!-- // col  -->

                            <?php $i++;  ?>

                        <?php  endforeach; ?>
                    <?php wp_reset_postdata(); // IMPORTANT - reset the $post object so the rest of the page works correctly ?>
                <?php endif; ?>
            </div>
            <!-- // case list  -->

            <footer>
                <a href="<?php the_field('button_link_case_home'); ?>" class="btn-cta"><?php the_field('button_label_case_home'); ?></a>
            </footer>

        </div>
        <!-- // container  -->
    </section>
    <!-- // case studies  -->

    <div id="reviews-home">
        <div class="container">
            <header>
                <h2><?php the_field('section_title_test_home'); ?></h2>
            </header>
            <!-- // hader  -->
            <div id="reviews-slider">

                <?php
                    $post_objects = get_field('reviews_list_home');

                    if( $post_objects ): ?>
                        <?php foreach( $post_objects as $post): // variable must be called $post (IMPORTANT) ?>
                            <?php setup_postdata($post); ?>

                            <div class="item">
                                <div class="review-slide">
                                    <div class="review-text">
                                        <?php the_field('review_test'); ?>
                                    </div>
                                    <!-- // text  -->
                                    <div class="review-author">
                                        <span>— <?php the_title(); ?></span>
                                        <span><?php the_field('title_and_position_test'); ?></span>
                                    </div>
                                    <!-- // author  -->
                                    <footer>
                                        <a href="<?php the_field('link_to_case_studiy'); ?>" class="btn-more">Read Full Case Story</a>
                                    </footer>
                                </div>
                                <!-- // slide  -->
                            </div>
                            <!-- // item  -->

                        <?php endforeach; ?>
                    <?php wp_reset_postdata(); // IMPORTANT - reset the $post object so the rest of the page works correctly ?>
                <?php endif; ?>

            </div>
            <!-- // reviews slider  -->
            <!-- <img src="<?php bloginfo('template_directory'); ?>/img/bg/test.svg" alt="" class="shaper"> -->
        </div>
        <!-- // container  -->
    </div>
    <!-- // reviews home  -->    

    <div class="triangle-up triangle-top"></div>
    <div id="metrics">
        <div class="container">

            <header>
                <h3 class="wow fadeInDown"><?php the_field('small_title_metrics_home'); ?></h3>
                <h4 class="wow fadeInDown"><?php the_field('main_title_metrics_home'); ?></h4>
            </header>

            <h5 class="wow fadeIn" data-wow-duration="0.5s" data-wow-delay="0.5s"><?php the_field('main_subittle_metrics_home'); ?></h5>

            <div id="metrics-list">
                <?php if( have_rows('content_blocks_metrics') ): ?>
                    <?php $i=4; ?>
                    <?php $b=6; ?>
                    <?php while( have_rows('content_blocks_metrics') ): the_row(); ?>

                        <div class="metrics__card wow fadeIn" data-wow-duration="0.<?php echo $i; ?>s" data-wow-delay="0.<?php echo $i; ?>s">
                            <div class="metric__head">
                                <div class="metric__icon">
                                    <img src="<?php the_sub_field('icon'); ?>" alt="">
                                </div>
                                <!-- // icon  -->
                                <div class="metric__title">
                                    <h4><?php the_sub_field('title'); ?></h4>
                                </div>
                                <!-- // title  -->
                            </div>
                            <!-- // head  -->
                            <div class="metric__text wow fadeInUp" data-wow-duration="0.<?php echo $b; ?>s" data-wow-delay="0.<?php echo $b; ?>s">
                                <?php the_sub_field('content_block'); ?>
                            </div>
                            <!-- // text  -->
                        </div>
                        <!-- // card  -->

                    <?php $i++; $i++; $b++; $b++; endwhile; ?>
                <?php endif; ?>
            </div>
            <!-- // list  -->

            <footer>
                <h6 class="wow fadeIn" data-wow-duration="0.7s" data-wow-delay="0.3s"><?php the_field('cta_title_metrics_home'); ?></h6>
                <a href="<?php the_field('button_link_cta_metric_home'); ?>" class="btn-cta wow fadeIn" data-wow-duration="0.5s" data-wow-delay="0.5s"><?php the_field('button_label_cta_metric_home'); ?></a>
            </footer>

        </div>
        <!-- // container  -->
    </div>
    <!-- // metrics  -->
    <div class="triangle-down"></div>

    <section id="why-us">
        <div class="container">
            <header>
                <h2 class="wow fadeIn Up" data-wow-duration="0.5s" data-wow-delay="0.5s"><?php the_field('section_title_why_home'); ?></h2>
            </header>
            <!-- // header  -->

            <div id="why-wrapper">
                <div class="head-title">
                    <h4 class="wow fadeInUp" data-wow-duration="0.5s" data-wow-delay="0.5s"><?php the_field('left_title_why_home'); ?></h4>
                </div>
                <div class="head-title">
                    <h4 class="wow fadeInUp" data-wow-duration="0.7s" data-wow-delay="0.7s"><?php the_field('right_title_why_home'); ?></h4>
                </div>
            </div>
            <!-- // wrapper  -->

            <div id="why-list">

                <?php if( have_rows('why_list_home') ): ?>
                    <?php $i=3; ?>
                    <?php while( have_rows('why_list_home') ): the_row(); ?>

                        <div class="why-line wow fadeInUp" data-wow-duration="0.<?php echo $i; ?>s" data-wow-delay="0.<?php echo $i; ?>s">
                            <div class="title">
                                <span class="label"><?php the_sub_field('title'); ?></span>
                            </div>
                            <!-- // title  -->
                            <div class="text">
                                <p><?php the_sub_field('text'); ?></p>
                            </div>
                            <!-- // text  -->
                        </div>
                        <!-- // line  -->

                    <?php $i++; $i++; endwhile; ?>
                <?php endif; ?>        

            </div>
            <!-- // list  -->

            <footer class="wow fadeIn" data-wow-duration="0.5s" data-wow-delay="0.5s">
                <a href="<?php the_field('button_link_why_home'); ?>" class="btn-cta"><?php the_field('button_label_what_offer_home'); ?></a>
            </footer>

        </div>
        <!-- // container  -->
    </section>
    <!-- // why us  -->

    <div id="bottom-cta">
        <div class="container">

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/purpose-side.svg" alt="" class="img-side wow fadeInRight" data-wow-duration="0.5s" data-wow-delay="0.5s">

            <header class="wow fadeIn" data-wow-duration="0.4s" data-wow-delay="0.6s">
                <h2><?php the_field('section_title_purpose_home'); ?></h2>
            </header>

            <ul>
                <?php if( have_rows('purpose_list_home') ): ?>
                    <?php $i=4; ?>
                    <?php while( have_rows('purpose_list_home') ): the_row(); ?>
                        <li class="wow fadeInLeft" data-wow-duration="0.<?php echo $i; ?>s" data-wow-delay="0.<?php echo $i; ?>s"><?php the_sub_field('item_text'); ?></li>
                    <?php $i++; endwhile; ?>
                <?php endif; ?>
            </ul>

            <h3 class="wow fadeIn" data-wow-duration="0.7s" data-wow-delay="0.6s"><?php the_field('subheading_purpose_home'); ?></h3>

            <footer class="wow fadeIn" data-wow-duration="0.7s" data-wow-delay="0.7s">
                <a href="<?php the_field('button_link_purpsoe_home'); ?>" class="btn-cta"><?php the_field('button_label_purpose_home'); ?></a>
            </footer>

        </div>
        <!-- // container  -->
    </div>
    <!-- // bototm cta  -->

    <div id="talk-cta">
        <div class="container">
            <img src="<?php the_field('logo_cta', 'options'); ?>" alt="">
            <h3><?php the_field('cta_title_talk_cta', 'options'); ?></h3>
            <a href="<?php the_field('button_link_talk_cta', 'options'); ?>" class="btn-cta"><?php the_field('button_label_cta_talk', 'options'); ?></a>
            <ul>
                <li><?php the_field('company_name_talk_cta', 'options'); ?></li>
                <li><?php the_field('phone_number_talk_cta', 'options'); ?></li>
                <li><a href="mailto:<?php the_field('email_address_cta_tallk', 'options'); ?>"><?php the_field('email_address_cta_tallk', 'options'); ?></a></li>
            </ul>
            <address><?php the_field('company_address_talk_cta', 'options'); ?></address>
        </div>
        <!-- // container  -->
    </div>
    <!-- // talk cta  -->


<?php get_footer(''); ?>

