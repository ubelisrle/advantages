<?php
/**
 * Template Name: Approach Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
?>

    <header id="regular-header">
        <div class="container">
            <div class="header-caption">
                <h1><?php the_field('main_title_hero_approach'); ?></h1>
                <h2><?php the_field('main_subtitle_hero_approach'); ?></h2>
            </div>
            <!-- // caption  -->
        </div>
        <!-- // container  -->
        <img src="<?php bloginfo('template_directory'); ?>/img/bg/keys-header.svg" alt="" class="side-img">
    </header>
    <!-- // regular header  -->

    <section id="main-keys">
        <div class="container">

            <div class="content-left">

                <div class="content-intro">
                    <h2><?php the_field('intro_title_key_page'); ?></h2>
                    <?php the_field('intro_text_key_value_page'); ?>             
                </div>
                <!-- // intro  -->

                <div class="mobile-image">
                    <iframe src="<?php the_field('side_animation_approach'); ?>" frameborder="0" width="100%" height="300"></iframe>
                </div>
                <!-- // image  -->

                <div class="key-values">
                    <?php if( have_rows('key_values_page') ): ?>
                        <?php while( have_rows('key_values_page') ): the_row(); ?>

                            <div class="feature">
                                <img src="<?php the_sub_field('icon'); ?>" alt="">
                                <span class="title"><?php the_sub_field('title'); ?></span>
                                <p><?php the_sub_field('text'); ?></p>
                            </div>
                            <!-- // feature  -->

                        <?php endwhile; ?>
                    <?php endif; ?>

                </div>
                <!-- // values  -->

            </div>
            <!-- // content left  -->

            <div class="keys-image">
                <iframe src="<?php the_field('side_animation_approach'); ?>" frameborder="0" width="500" height="500"></iframe>
                <!-- <img src="<?php the_field('featured_image_side_keys'); ?>" alt=""> -->
            </div>
            <!-- // image  -->

        </div>
        <!-- // container  -->
    </section>
    <!-- // main keys  -->

    <section id="key-features">
        <div class="container">
            <header>
                <h2><?php the_field('section_title_key_feat_page'); ?></h2>
                <?php the_field('intro_text_key_features_page'); ?>
            </header>
            <!-- // header  -->
            <div class="features-list">
                <div class="row">
                        <script>
                            jQuery(document).ready(function($) {
                            $.fn.inView = function(){
                                            if(!this.length) return false;
                                            var rect = this.get(0).getBoundingClientRect();

                                            return (
                                                rect.top >= 0 &&
                                                rect.left >= 0 &&
                                                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                                                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                                            );

                                        };
                                    });
                        </script>
                        <script src="https://cdnjs.com/libraries/bodymovin" type="text/javascript"></script>
                                    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.7.14/lottie.min.js" integrity="sha512-G1R66RZMhyLDEcAu92/Kv4sWNypnEiJcM6yhe0PNyiYDaMAKpMrJ6ZLR67xC/RMNGRa8Pm9TxtO8a98F6Ct+Gw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                    <?php if( have_rows('features_list_approach_page') ): ?>
                        <?php $i=0; ?> 
                        <?php while( have_rows('features_list_approach_page') ): the_row(); ?>
                        
                            <div class="col-md-4">
                                <div class="feature-card">    
                                    <div class="feature-icon">
                                    <?php $lottieId = get_sub_field('features_id'); ?>
                                    <div id="<?php echo $lottieId ?>" class="lottie"></div>
                                    <script>
                                        
                                           
                                        // lottie
                                        var <?php echo $lottieId ?>Container = document.getElementById('<?php echo $lottieId ?>');
                                        var state = 'play';
                                        var <?php echo $lottieId ?>Animation = lottie.loadAnimation({
                                        container: <?php echo $lottieId ?>Container, // Required
                                        path: '<?php the_sub_field('iframe_file'); ?>', // Required
                                        renderer: 'svg', // Required
                                        loop: true, // Optional
                                        autoplay: false, // Optional
                                        name: "<?php echo $lottieId ?>", // Name for future reference. Optional.
                                        })
                                                
                                        
                                    </script>
                                       
                                    </div>
                                    <!-- // icon  -->
                                    <div class="feature-text">
                                        <h3><?php the_sub_field('block_title'); ?></h3>
                                        <p><?php the_sub_field('content_block'); ?></p>
                                        <a href="#" class="more-btn" data-my-element="approach<?php echo $i; ?>">Read More</a>                         
                                    </div>
                                    
                                    <!-- // link  -->
                                </div>
                            </div>
                            <!-- // card  -->

                        <?php $i++; endwhile; ?>
                    <?php endif; ?>
                    <script>
                        jQuery(document).ready(function($) {
                            $(window).on('scroll',function(){
                            if( $('.feature-icon').inView() ) {
                                console.log('in view');
                                discoverAnimation.play(0,50);
                                
                                discoverAnimation.addEventListener('loopComplete', function() {
                                    discoverAnimation.stop();
                                    unlockAnimation.play();
                                });
                                unlockAnimation.addEventListener('loopComplete', function() {
                                    unlockAnimation.stop();
                                    infuseAnimation.play();
                                });
                                infuseAnimation.addEventListener('loopComplete', function() {
                                    infuseAnimation.stop();
                                    setTimeout(function(){
                                        unlockAnimation.play();
                                        discoverAnimation.play();
                                        infuseAnimation.play();
                                    }, 2000);                                    
                                });
                            }
                        });
                    });
                    </script>
                </div>
                <!-- // row  -->
            </div>
            <!-- // list  -->
        </div>
        <!-- // container  -->
    </section>
    <!-- // key features  -->

    <div id="middle-cta">
        <div class="container">
            <h3><?php the_field('cta_title_middle_approach'); ?></h3>
            <a href="<?php the_field('button_link_mid_cta_approach'); ?>" class="btn-cta"><?php the_field('button_label_mid_cta_approach'); ?></a>
        </div>
        <!-- // container  -->
        <img src="<?php bloginfo('template_directory'); ?>/img/ico/a-small.png" alt="" class="bg-shade">
    </div>
    <!-- // middle cta  -->

    <section id="frameworks">
        <div class="container">


            <header>
                <h2><?php the_field('section_title_frameworks_approach'); ?></h2>
            </header>
            <!-- // header  -->

            <div id="faq-accordion">
                <img src="<?php bloginfo('template_directory'); ?>/img/bg/framework-mobile.svg" class="mobile-shape" alt="">

                <?php if( have_rows('frameworks_list_approach') ): ?>
                    <?php while( have_rows('frameworks_list_approach') ): the_row(); ?>

                        <div class="set">
                            
                            <a href="#" class="accordion-heading">
                                        
                                <div class="card">
                                    <div class="framework-card">
                                        <h3><?php the_sub_field('main_title'); ?></h3>
                                        <span class="btn-more"></span>
                                    </div>
                                    <!-- // card  -->
                                </div>

                            </a>

                            <div class="content">
                                <h4><?php the_sub_field('hover_title'); ?></h4>
                                <?php the_sub_field('hover_text'); ?>
                            </div>
                            <!-- // content  -->

                        </div>

                    <?php $i++; $i++; endwhile; ?>
                <?php endif; ?>                

            </div>
            <!-- /#faq-accordion -->    
            
            <div class="frameworks-list">

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/framework-top.svg" alt="" class="top-shape">

            <?php if( have_rows('frameworks_list_approach') ): ?>
                <?php while( have_rows('frameworks_list_approach') ): the_row(); ?>

                    <div class="card">
                        <div class="framework-card">
                            <h3><?php the_sub_field('main_title'); ?></h3>
                            <div class="frame-caption">
                                <div class="frame-content">
                                    <h4><?php the_sub_field('hover_title'); ?></h4>
                                    <?php the_sub_field('hover_text'); ?>
                                </div>
                                <!-- // frame content  -->
                            </div>  
                            <!-- // caption  -->
                        </div>
                        <!-- // card  -->
                    </div>

                <?php endwhile; ?>
            <?php endif; ?>
            </div>
            <!-- // list  -->

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/framework-bottom.svg" class="bottom-shape" alt="">

        </div>
        <!-- // container  -->
    </section>
    <!-- // frameworks  -->

    <?php if( have_rows('features_list_approach_page') ): ?>
        <?php $i=0; ?> 
        <?php while( have_rows('features_list_approach_page') ): the_row(); ?>
        
            <div class="modal-overlay" data-my-element="approach<?php echo $i; ?>">
                <div class="modal modal-approach" data-my-element="approach<?php echo $i; ?>">
                    <a class="close-modal">
                        <img src="<?php bloginfo('template_directory'); ?>/img/ico/red-close.svg" alt="">
                    </a>
                    <!-- close modal -->
                    <div class="modal-content">
						<img src="<?php bloginfo('template_directory'); ?>/img/bg/modal-bg.svg" class="img-bottom" alt="">
                        <div class="modal-content-in">
                            <div class="content-wrapper">

                                <div class="approach-content">
                                    <?php the_sub_field('modal_content'); ?>
                                </div>

                            </div>
                            <!-- /.row -->
                        </div>
                        <!-- /.modal-content-in -->
                    </div>
                    <!-- content -->
                </div>
                <!-- modal -->
            </div>
            <!-- overlay -->

        <?php $i++; endwhile; ?>
    <?php endif; ?>    

<?php get_footer(); ?>
