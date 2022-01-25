<?php
/**
 * Template Name: About Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
?>

    <header id="video-header">

		<div style="padding:56.25% 0 0 0;position:relative;">
			<iframe src="https://player.vimeo.com/video/331842532??autoplay=1&loop=1&background=1&title=0&byline=0&portrait=0&speed=0&badge=0&autopause=0&player_id=0&app_id=58479/embed" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen frameborder="0" style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
		</div>

        <div class="overlay">
            <div class="container">
                <div class="hero-caption">
                    <h1><?php the_field('header_title_header-about'); ?></h1>
					<?php the_field('intro_text_header_about'); ?>
                    <span class="icon-play"></span>
                </div>
                <!-- // caption  -->
            </div>
            <!-- // container  -->
        </div>
        <!-- // overlay  -->
    </header>
    <!-- // video heder  -->

	<section id="our-values">
		<div class="container">

			<img src="<?php bloginfo('template_directory'); ?>/img/bg/values-bg.svg" alt="" class="top-shape">

			<header>
				<h2><?php the_field('section_title_values_about'); ?></h2>
				<?php the_field('intro_content_about_intro'); ?>
			</header>
			<!-- // header  -->


            <div id="faq-accordion">

				<?php if( have_rows('values_list_about_page') ): ?>
					<?php while( have_rows('values_list_about_page') ): the_row(); ?>

                        <div class="set">
                            
                            <a href="#" class="accordion-heading">

                               <div class="value__card">
								   <div class="value-title">
							   			<h3><?php the_sub_field('title'); ?></h3>     
									</div>                             
                               </div>
                               <!-- // card  -->

                            </a>

                            <div class="content">
								<div class="value-hover">
									<p><?php the_sub_field('hover_text'); ?></p>
								</div>
								<!-- // hover  -->
                            </div>
                            <!-- // content  -->

                        </div>

					<?php endwhile; ?>
				<?php endif; ?>       

            </div>
            <!-- /#faq-accordion -->     

			<div id="values-list">
				<?php if( have_rows('values_list_about_page') ): ?>
					<?php while( have_rows('values_list_about_page') ): the_row(); ?>

						<div class="value-card">
							<div class="value-title">
								<h3><?php the_sub_field('title'); ?></h3>
							</div>
							<!-- // title  -->
							<div class="value-hover">
								<p><?php the_sub_field('hover_text'); ?></p>
							</div>
							<!-- // hover  -->
						</div>
						<!-- // acrd  -->

					<?php endwhile; ?>
				<?php endif; ?>
			</div>
			<!-- // values list  -->
		</div>
		<!-- // values container -->
	</section>
	<!-- // our values  -->

	<section id="our-story">
		<div class="container">
			<div class="image-holder wow fadeIn"  data-wow-duration="0.5s" data-wow-delay="0.5s">
				<img src="<?php the_field('featured_image_story_aout'); ?>" alt="">
			</div>
			<!-- // image  -->
			<div class="story-text">
				<h2 class="wow fadeInUp"><?php the_field('block_title_about_story'); ?></h2>
				<div class="wow fadeInUp" data-wow-duration="0.5s" data-wow-delay="0.5s">
					<?php the_field('content_block_about_stry'); ?>
				</div>
				<a href="<?php the_field('button_link_about_story'); ?>" class="btn-more wow fadeInUp" data-wow-duration="0.7s" data-wow-delay="0.7s"><?php the_field('button_label_story_about'); ?></a>

				<a href="<?php the_field('button_2_link_about_story'); ?>" class="btn-more wow fadeInUp yellow-btn" data-wow-duration="0.8s" data-wow-delay="0.8s"><?php the_field('button_2_label_story_about'); ?></a>
			</div>
			<!-- // text  -->
		</div>
		<!-- // container  -->
	</section>
	<!-- // story  -->

	<div id="team-intro">
		<div class="container">
			<h3><?php the_field('section_title_team_intro'); ?></h3>
			<?php the_field('intro_text_team_page'); ?>
		</div>
	</div>
	<!-- // team intro  -->

	<div id="management-listing">
		<div class="container">

			<img src="<?php bloginfo('template_directory'); ?>/img/bg/team-top.svg" alt="" class="top-shape">

			<div id="management-wrapper">
				<?php
				$loop = new WP_Query( array( 'post_type' => 'management', 'posts_per_page' => 115) ); ?>  
				<?php $i=0; ?> 
				<?php while ( $loop->have_posts() ) : $loop->the_post(); ?>

					<div class="team-card">
						<div class="team-card-inner">
							<div class="team-card-front">
								<?php
								$imageID = get_field('member_photo');
								$image = wp_get_attachment_image_src( $imageID, 'team-image' );
								$alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
								?> 

								<img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" /> 
							</div>
							<div class="team-card-back sign-btn">

								<div class="caption">
									<a href="" data-my-element="member<?php echo $i; ?>">
										<h3><?php the_field('hover_text_teamer'); ?></h3>
									</a>

								</div>

							</div>
						</div>

						<div class="team-desc sign-btn">
							<h3><?php the_title(); ?></h3>
							<p><?php the_field('position_team'); ?></p>		
							<a href="" class="more-btn" data-my-element="member<?php echo $i; ?>">Read Bio</a>
						</div>

					</div>
					<!-- // card  -->

					<?php $i++; endwhile; ?>
				<?php wp_reset_postdata(); ?>  
			</div>
			<!-- // wrapper  -->
		</div>
		<!-- // container  -->
	</div>
	<!-- // managemnt  -->

	<div id="team-listing">
		<div class="container">

			<img src="<?php bloginfo('template_directory'); ?>/img/bg/team-bottom.svg" alt="" class="top-shape">

			<div id="team-wrapper">
				<?php
				$loop = new WP_Query( array( 'post_type' => 'team', 'posts_per_page' => 115) ); ?>  
				<?php while ( $loop->have_posts() ) : $loop->the_post(); ?>

					<div class="team-card">
						<div class="team-card-inner">
							<div class="team-card-front">
								<?php
								$imageID = get_field('member_photo');
								$image = wp_get_attachment_image_src( $imageID, 'team-image' );
								$alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
								?> 

								<img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" /> 

								<div class="team-details">
									<h3><?php the_title(); ?></h3>
									<p><?php the_field('position_team'); ?></p>	
								</div>
								<!-- // details  -->
								
							</div>
							<div class="team-card-back">
								<div class="caption">
									<h3><?php the_title(); ?></h3>
									<p><?php the_field('position_team'); ?></p>									
								</div>
							</div>
						</div>
					</div>
					<!-- // card  -->

				<?php endwhile; ?>
				<?php wp_reset_postdata(); ?>      
			</div>
			<!-- // wrapper  -->
		</div>
		<!-- // container  -->
	</div>
	<!-- // team listing  -->

	<div id="noticed">
		<div class="container">
			<header>
				<img src="<?php the_field('small_logo_noticed'); ?>" alt="">
				<small><?php the_field('notice_noticed'); ?></small>
			</header>
			<img class="img-responsive" src="<?php the_field('logos_image_noticed'); ?>" alt="">
		</div>
		<!-- // container  -->
	</div>
	<!-- // noticed  -->

	<?php
    $loop = new WP_Query( array( 'post_type' => 'management', 'posts_per_page' => 115) ); ?>   
    <?php $i=0; ?>
    <?php while ( $loop->have_posts() ) : $loop->the_post(); ?>

            <div class="modal-overlay" data-my-element="member<?php echo $i; ?>">
                <div class="modal" data-my-element="member<?php echo $i; ?>">
                    <a class="close-modal">
                        <img src="<?php bloginfo('template_directory'); ?>/img/ico/red-close.svg" alt="">
                    </a>
                    <!-- close modal -->
                    <div class="modal-content">
						<img src="<?php bloginfo('template_directory'); ?>/img/bg/modal-bg.svg" class="img-bottom" alt="">
                        <div class="modal-content-in">
                            <div class="content-wrapper">

                                <div class="col-image">
                                    <div class="modal-photo">
                                        <?php
                                        $imageID = get_field('member_photo');
                                        $image = wp_get_attachment_image_src( $imageID, 'team-image' );
                                        $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                        ?> 

                                        <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" />  
                                    </div>
                                    <!-- /.modal-photo -->
									<div class="author-desc">
										<h4><?php the_title(); ?></h4>
										<span class="position"><?php the_field('position_team'); ?></span>

										<?php if( get_field('linkedin_url_gen') ): ?>
										<a href="<?php the_field('linkedin_url_gen'); ?>" target="_blank" class="btn-in"><img src="<?php bloginfo('template_directory'); ?>/img/bg/in.svg" alt=""></a>
										<?php endif; ?>

									</div>
									<!-- // desc  -->
                                </div>
                                <!-- /.col -->

                                <div class="col-text">
                                    <div class="modal-text">
										<h2><?php the_field('bio_title_pop'); ?></h2>
										<?php the_field('bio_content_pop'); ?>
                                    </div>
                                    <!-- /.modal-text -->
                                </div>
                                <!-- /.col -->
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
    <?php wp_reset_postdata(); ?>  	

<?php get_footer(); ?>
