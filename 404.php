<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package CodeFavorite_Starter_Theme
 */

get_header();
?>

    <div id="ermac-wrapper">
        <img src="<?php bloginfo('template_directory'); ?>/img/bg/ermac.svg" alt="" class="shape-top">
        <div class="container">
            <div class="ermac-content">
                <h1><?php the_field('main_title_ermac', 'options'); ?></h1>
                <footer>
                    <a href="<?php the_field('button_link_ermac_1', 'options'); ?>" class="btn-cta"><?php the_field('button_label_ermac_1', 'options'); ?></a>
                    <button value="No, really, go back!" onclick="history.go(-1)" class="btnx btn-back"><?php the_field('button_2_label_ermac', 'options'); ?></button>
                    <a href="<?php the_field('button_3_link_ermac', 'options'); ?>" class="btn-cta"><?php the_field('button_3_label_ermac', 'options'); ?></a>
                </footer>
            </div>
            <!-- // ermac content  -->
        </div>
        <!-- // container  -->
    </div>
    <!-- // wrapper  -->

<?php
get_footer();
