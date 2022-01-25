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

    <header id="single-header">

        <div class="hero-image">
            <?php
            $imageID = get_field('featured_image_post');
            $image = wp_get_attachment_image_src( $imageID, 'blogsingle-image' );
            $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
            ?> 

            <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" /> 
        </div>
        <!-- // hero image  -->

        <div class="container">
            <div class="hero-title">
                <h1><?php the_title(); ?></h1>
                <div class="hero-meta">
                    <span class="date"><?php echo get_the_date( 'F j, Y' ); ?></span>
                </div>
                <!-- // meta  -->
                <div class="hero-cat">
                    <span class="cat">
                    <?php
					 global $post;
					 $categories = get_the_category($post->ID);
					 $cat_link = get_category_link($categories[0]->cat_ID);
					 echo '<small>'.$categories[0]->cat_name.'</small>' 
					 ?>
                    </span>
                </div>
                <!-- / hero cta  -->
            </div>
            <!-- // hero title  -->
        </div>
        <!-- // container  -->
    </header>
    <!-- // single header  -->

    <div id="single-page">
        <div class="container">

            <div id="to-top" class="desktop-top">
                <a href="#top-page" class="btn">
                    <img src="<?php bloginfo('template_directory'); ?>/img/bg/to-top.png" alt="">
                    <small>Back to Top</small>
                </a>
            </div>
            <!-- // to top  -->          

            <article>

                <?php if( have_rows('content_sections_single_article') ): ?>
                    <?php while( have_rows('content_sections_single_article') ): the_row(); ?>
                        <?php if( get_row_layout() == 'intro_content' ): ?>

                            <div class="intro-text">
                                <?php the_sub_field('content_block'); ?>
                            </div>

                        <?php elseif( get_row_layout() == 'full_width_content' ): ?>

                            <div class="content-full">
                                <?php the_sub_field('content_block'); ?>
                            </div>

                        <?php endif; ?>
                    <?php endwhile; ?>
                <?php endif; ?>

            </article>
            <!-- // article  -->

            <div id="to-top" class="mobile-top">
                <div class="container">
                    <a href="#top-page" class="btn">
                        <img src="<?php bloginfo('template_directory'); ?>/img/bg/to-top.png" alt="">
                        <small>Back to Top</small>
                    </a>
                </div>  
            </div>
            <!-- // to top  -->

            <div class="blog-bottom">

                <div class="blog-nl">
                    <span class="title">Subscribe</span>
                    <span class="subtitle">Subscribe to receive the latest posts</span>
                    <div class="form-wrapper">
<!-- SharpSpring Form for Blog Subscribe Form  -->
<script type="text/javascript">
    var ss_form = {'account': 'MzawMLEwMDe0AAA', 'formID': 'S01OsTA0NbbUNU4xMdQ1MTZM0U1MTjLSNTc3tUw0NUszNzMyAwA'};
    ss_form.width = '100%';
    ss_form.domain = 'app-3QNLTBBPC0.marketingautomation.services';
    // ss_form.hidden = {'field_id': 'value'}; // Modify this for sending hidden variables, or overriding values
    // ss_form.target_id = 'target'; // Optional parameter: forms will be placed inside the element with the specified id
    // ss_form.polling = true; // Optional parameter: set to true ONLY if your page loads dynamically and the id needs to be polled continually.
</script>
<script type="text/javascript" src="https://koi-3QNLTBBPC0.marketingautomation.services/client/form.js?ver=2.0.1"></script>
                    </div>
                    <!-- // wrapper  -->
                </div>
                <!-- // newsletter  -->

                <div class="blog-nav">
                    <a href="<?php bloginfo('url'); ?>/blog">View All Blog Posts <span class="icon-Polygon-44"></span></a>
                </div>
                <!-- // nav  -->

            </div>
            <!-- // bottom  -->

            <div class="blog-share">
                <span class="title">Share:</span>

                <!-- Go to www.addthis.com/dashboard to customize your tools -->
                <div class="addthis_inline_share_toolbox"></div>
            
            </div>
            <!-- // share  -->

            <img src="<?php bloginfo('template_directory'); ?>/img/bg/blog-bottom.svg" alt="" class="shape-bottom-blog">

        </div>
        <!-- // container  -->
    </div>
    <!-- // single page  -->

<?php get_footer(''); ?>