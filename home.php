<?php
/**
 * Home Blog template
 *
 * Post Listing
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package CodeFavorite_Starter_Theme
 */

get_header();
?>

    <header id="blog-header">
        <div class="container">

            <div class="hero-title">
                <span class="title"><?php the_field('small_title_blog_page', get_option('page_for_posts')); ?></span>
                <span class="subtitle"><?php the_field('main_title_blog_page', get_option('page_for_posts')); ?></span>
            </div>
            <!-- // title  -->

        </div>
        <!-- // container  -->

        <div class="hero-images">
            <div id="blog-slider">
                <?php if( have_rows('hero_images_blog', get_option('page_for_posts')) ): ?>
                <?php while( have_rows('hero_images_blog', get_option('page_for_posts')) ): the_row(); ?>

                    <div>

                    <a href="<?php the_sub_field('link_to_post'); ?>">

                    <?php
                    $imageID = get_sub_field('featured_image');
                    $image = wp_get_attachment_image_src( $imageID, 'full-image' );
                    $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                    ?> 

                    <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" /> 
                    </a>
                    </div>
                <?php endwhile; ?>
                <?php endif; ?>
            </div>
            <!-- // blog slider  -->
        </div>
        <!-- // imges  -->

    </header>
    <!-- // blog header  -->

    <div id="dots-wrapper">
        <div class="dots-container"></div>
    </div>
    <!-- // wrapper  -->

    <div id="blog-listing">
        <div class="container">

            <div class="articles">

                <div class="row grid">
                    <?php
                        $current_page = (get_query_var('paged')) ? get_query_var('paged') : 1; // get current page number
                        $args = array(
                            'posts_per_page' => 10, // the value from Settings > Reading by default
                            'paged'          => $current_page // current page
                        );
                        query_posts( $args );
                        
                        $wp_query->is_archive = true;
                        $wp_query->is_home = false;
                        
                        while(have_posts()): the_post(); ?>

                            <div class="grid-item  element-item 
                            <?php $terms = get_the_terms( $post->ID , 'category' ); foreach( $terms as $term ) {  
                                
                                $departments = $term->name; 
                                $departments = preg_replace('/\s+/', '', $departments); 
                                $departments2 = preg_replace('/[^A-Za-z0-9\-]/', '', $departments);

                                echo $departments2   . '  ';
                                
                                unset($term); }?>" 

                            data-category="<?php $terms = get_the_terms( $post->ID , 'category' ); foreach( $terms as $term ) { 

                                $departments = $term->name; 
                                $departments = preg_replace('/\s+/', '', $departments); 
                                $departments2 = preg_replace('/[^A-Za-z0-9\-]/', '', $departments);

                                echo $departments2  . '  ' ;
                                
                                unset($term); }?>
                                ">
                                
                            <article class="blog-card">
                                <div class="blog-inner">

                                    <div class="blog-photo">
                                        <a href="<?php echo get_permalink(); ?>"> 
                                        <?php
                                        $imageID = get_field('featured_image_post');
                                        $image = wp_get_attachment_image_src( $imageID, 'blog-image' );
                                        $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                        ?> 

                                        <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" /> 
                                        <span class="cat"><?php
                                        global $post;
                                        $categories = get_the_category($post->ID);
                                        $cat_link = get_category_link($categories[0]->cat_ID);
                                        echo ''.$categories[0]->cat_name.'' 
                                        ?></span>
                                        </a>
                                    </div>
                                    <!-- // photo  -->

                                    <div class="blog-desc">
                                        <span class="date"><?php echo get_the_date( 'F j, Y' ); ?></span>
                                        <h3><?php the_title(); ?></h3>
                                        <?php the_field('excerpt_text_blog_artc'); ?>
                                        <a href="<?php echo get_permalink(); ?>" class="btn-more">Read More</a>
                                    </div>
                                    <!-- // desc  -->
                                    
                                </div>
                            </article>
                            <!-- // media card  -->

                        </div>


                        <?php endwhile; ?>

                </div>
                <!-- // row  -->

                <?php if( function_exists('wp_pagenavi') ) wp_pagenavi(); // WP-PageNavi function ?>
                <?php
                //  if(function_exists('wp_pagenavi')) { wp_pagenavi(array('query'=> $wp_query));} 
                wp_reset_postdata();
                wp_reset_query();
                ?>
            
            </div>
            <!-- // articles  -->

            <div class="blog-sidebar">

                <div class="blog-cats">
                    <ul class="button-group filter-button-group">
                        <!-- <li>
                        <button data-filter="*" class="btn-all">All</button> </li> -->
                        <?php
                        $terms = get_terms( 'category' );
                        $count = count( $terms );
                        if ( $count > 0 ) {
                            foreach ( $terms as $term ) { ?>

                            <?php $departments = $term->name; ?>
                            <?php $desc = $term->description; ?>
                            <?php $departments = preg_replace('/\s+/', '', $departments); ?>
                            <?php  $departments2 = preg_replace('/[^A-Za-z0-9\-]/', '', $departments); ?>

                            <li> 
                                <button data-filter=".<?php echo $departments2 ?>"><?php echo $term->name ?></button>
                                <small><?php echo $desc; ?></small>
                            </li>

                                <?php
                            }
                        }
                        ?>     
                        <li><button data-filter="*" class="clear-btn ">All</button> </li>               
                    </ul>
                </div>
                <!-- // cats  -->

                <div class="blog-search">
                    <form role="search" method="get" id="searchform"
                        class="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
                        <div>
                            <input type="text" value="<?php echo get_search_query(); ?>" name="s" id="s" />
                            <input type="submit" id="searchsubmit"
                                value="<?php echo esc_attr_x( 'Search', 'submit button' ); ?>" />
                        </div>
                    </form>
                </div>
                <!-- // search  -->

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
                <!-- // nmewsletter  -->

            </div>
            <!-- // sidebar  -->

        </div>
        <!-- // container  -->
    </div>
    <!-- // blog listing  -->

<?php
get_footer();
?>
<script>
    jQuery(document).ready(function($) {

		$('#mobile-menu--btn a').click(function () {
          $('.main-menu-sidebar').toggleClass("menu-active");
          $('.menu-overlay').addClass("active-overlay");
          $(this).toggleClass('open');
        }); // Menu
        $('.close-menu-btn').click(function () {
          $('.main-menu-sidebar').removeClass("menu-active");
          $('.menu-overlay').removeClass("active-overlay");
        });
    
        $('.wp-pagenavi a').click(function (event) {
            var href = $(this).attr('href');
            event.preventDefault();
            window.location = href += window.location.hash;
        });

    });
</script>
<script src="https://unpkg.com/imagesloaded@4/imagesloaded.pkgd.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/js/isotope.pkgd.min.js"></script>


<script>
        var $grid = jQuery('.grid').imagesLoaded( function() {
        // init Isotope after all images have loaded

    // filter functions
    var filterFns = {
        // show if number is greater than 50
        numberGreaterThan50: function() {
            var number = jQuery(this).find('.number').text();
            return parseInt( number, 10 ) > 50;
        },
        // show if name ends with -ium
        ium: function() {
            var name = jQuery(this).find('.name').text();
            return name.match( /ium$/ );
        }
        };

        function getHashFilter() {
        // get filter=filterName
        var matches = location.hash.match( /category=([^&]+)/i );
        var hashFilter = matches && matches[1];
        return hashFilter && decodeURIComponent( hashFilter );
        }

        // init Isotope
        var $grid = jQuery('.grid');

        // bind filter button click
        var $filterButtonGroup = jQuery('.filter-button-group');
        $filterButtonGroup.on( 'click', 'button', function() {
        var filterAttr = jQuery( this ).attr('data-filter');
        // set filter in hash
        location.hash = 'category=' + encodeURIComponent( filterAttr );
        });

        var isIsotopeInit = false;

        function onHashchange() {
        var hashFilter = getHashFilter();
        if ( !hashFilter && isIsotopeInit ) {
            return;
        }
        isIsotopeInit = true;
        // filter isotope
        $grid.isotope({
            itemSelector: '.element-item',
            layoutMode: 'fitRows',
            // use filterFns
            filter: filterFns[ hashFilter ] || hashFilter
        });
        // set selected class on button
        if ( hashFilter ) {
            $filterButtonGroup.find('.is-checked').removeClass('is-checked');
            $filterButtonGroup.find('[data-filter="' + hashFilter + '"]').addClass('is-checked');
        }
        }

        jQuery(window).on( 'hashchange', onHashchange );

        // trigger event handler to init Isotope
        onHashchange();


        });
    </script>	

    <script>
            var buttonGroups = document.querySelectorAll('.button-group');
            for ( var i=0, len = buttonGroups.length; i < len; i++ ) {
            var buttonGroup = buttonGroups[i];
            radioButtonGroup( buttonGroup );
            }

            function radioButtonGroup( buttonGroup ) {
            buttonGroup.addEventListener( 'click', function( event ) {
            // only work with buttons
            if ( !matchesSelector( event.target, 'button' ) ) {
            return;
            }
            buttonGroup.querySelector('.is-checked').classList.remove('is-checked');
            event.target.classList.add('is-checked');
            });
            }
    </script>

<script>
          //Filter complete
          $grid.on( 'arrangeComplete', function( event, filteredItems ) {
            //matchheight on the visible items 
            jQuery('.blog-card:visible').matchHeight(); 
            //And re-layout the grid  
            $grid.isotope('layout'); 
          });    
</script>

<script>
    jQuery('span.cat:contains("Discover")').addClass('discover-blog');
    jQuery('span.cat:contains("Infuse")').addClass('infuse-blog');
    jQuery('span.cat:contains("Unlock")').addClass('unlock-blog');
</script>