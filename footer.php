<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package CodeFavorite_Starter_Theme
 */

?>

    <div id="certs">
        <div class="container">
            <div id="certs-wrapper">
                <span class="title"><?php the_field('block_title_certss', 'options'); ?></span>
            </div>
            <!-- // wrapperm  -->
            <div class="certs-list">
                <?php if( have_rows('certifications_list_footer', 'options') ): ?>
                    <?php while( have_rows('certifications_list_footer', 'options') ): the_row(); ?>

                        <div class="logo">
                            <img src="<?php the_sub_field('logo'); ?>" alt="">
                        </div>
                        <!-- // logo  -->

                    <?php endwhile; ?>
                <?php endif; ?>
            </div>
            <!-- // list  -->
        </div>
        <!-- // certs  -->
    </div>
    <!-- // certs  -->

    <footer id="page-footer">
        <div class="container">

            <div class="footer-about">
                <img src="<?php the_field('footer_logo_footer', 'options'); ?>" alt="">
            </div>
            <!-- // about  -->
            
            <div class="footer-nav">

                <div class="nav-block">
                    <?php wp_nav_menu( array( 'theme_location' => 'footer1_menu' ) ); ?>
                </div>
                <!-- // nav block  -->

                <div class="nav-block">
                    <?php wp_nav_menu( array( 'theme_location' => 'footer2_menu' ) ); ?>
                </div>
                <!-- // nav block  -->
                
                <div class="nav-block">
                    <?php wp_nav_menu( array( 'theme_location' => 'footer3_menu' ) ); ?>
                </div>
                <!-- // nav block  -->                

            </div>
            <!-- // nav  -->
            

        </div>
        <!-- // container  -->
    </footer>
    <!-- // page footer  -->
  

<?php wp_footer(); ?>

<script src="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js"></script>
<script src="<?php bloginfo('template_directory'); ?>/js/parallax.min.js"></script>

<script src="<?php bloginfo('template_directory'); ?>/js/vidbg.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/js/wow.min.js"></script> 
<script src="<?php echo get_template_directory_uri(); ?>/js/numscroller-1.0.js"></script> 


<script>
wow = new WOW(
{
mobile:       false,       // default
}
)
wow.init();
</script>

</body>
</html>
