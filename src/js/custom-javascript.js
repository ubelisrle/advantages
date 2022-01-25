(function($) {

	jQuery(document).ready(function() {

      // Sticky header
      $(window).scroll(function() {
          if ($(this).scrollTop() > 10){
              $('#top-bar').addClass("sticky");
          }
          else{
              $('#top-bar').removeClass("sticky");
          }
        });

      // Sticky header
      $(window).scroll(function() {
        if ($(this).scrollTop() > 10){
            $('#case-header .overlay .container .hero-caption').addClass("title-up");
        }
        else{
            $('#case-header .overlay .container .hero-caption').removeClass("title-up");
        }
      });

      // Sticky header
      $(window).scroll(function() {
        if ($(this).scrollTop() > 10){
            $('#case-header .shape').addClass("shape-up");
        }
        else{
            $('#case-header .shape').removeClass("shape-up");
        }
      });



        // $(document).ready(function(){
        //     $(this).scrollTop(0);
        // });

        $(document).ready(function() {
            if($(window).scrollTop() !== 0) {
                $('#top-nav').addClass("sticky");
            }
         });



        $('#partners-slider').slick({
          infinite: true,
          slidesToShow: 5,
          slidesToScroll:1,

          responsive: [
            {
              breakpoint: 1000,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
              }
            },
            {
              breakpoint: 640,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
          ]

        });

        $('#reviews-slider').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll:1,
          dots:true,
          arrows:true,
          autoplay: true,
          autoplaySpeed: 5000,
          pauseOnHover: false,
          adaptiveHeight: true
        });

        $('#hero-slider').slick({
          autoplay: true,
          autoplaySpeed: 5000,
          pauseOnHover: false,
            arrows:false,
            dots: true,
            appendDots: ".slide-nav",
            responsive: [
              {
                breakpoint: 480,
                settings: {
                  adaptiveHeight: true

                }
              }
            ]

        });



        $('#blog-slider').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll:1,
          arrows:false,
          dots:true,
          appendDots:$(".dots-container"),
        });

        $(function() {
          $('#btn-up').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
              var target = $(this.hash);
              target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
              if (target.length) {
                $('html, body').animate({
                  scrollTop: target.offset().top -97
                }, 1000);
                return false;
              }
            }
          });
        });

        $(function() {
          $('#case-single footer .btn-up').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
              var target = $(this.hash);
              target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
              if (target.length) {
                $('html, body').animate({
                  scrollTop: target.offset().top -100
                }, 1000);
                return false;
              }
            }
          });
        });

        $(function() {
          $('#to-top a').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
              var target = $(this.hash);
              target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
              if (target.length) {
                $('html, body').animate({
                  scrollTop: target.offset().top -100
                }, 1000);
                return false;
              }
            }
          });
        });

          // modal script
          setTimeout(function() {
            jQuery('.modal-overlay').addClass('show');
        }, 1000);
        $('.sign-btn a, .feature-card a.more-btn').click(function(e){
            var myEm = $(this).attr('data-my-element');
            var modal = $('.modal-overlay[data-my-element = '+myEm+'], .modal[data-my-element = '+myEm+']');
            e.preventDefault();
            modal.addClass('active');
            $('html').addClass('fixed');
        });
        $('.close-modal').click(function(){
            var modal = $('.modal-overlay, .modal');
            $('html').removeClass('fixed');
            modal.removeClass('active');
        });


          $(function() {
            $('#featured .featured-card .featured-desc').matchHeight();
            $('#featured .featured-card .featured-desc p').matchHeight();
            // $('#blog-listing .container .articles .row .grid-item .blog-card .blog-inner .blog-desc h3').matchHeight();
            $('#organization .org-card .org-text').matchHeight();
            // $('#case-stories .case-listing .case-card .case-desc h2').matchHeight();
            $('#case-stories .case-listing .case-card .case-desc p').matchHeight();
            $('#case-stories .case-listing .case-card').matchHeight();
          });

          $("span:contains('Infuse')").addClass('cat-infuse');
          $("span:contains('Unlock')").addClass('cat-unlock');

        // Menu
        $('#mobile-menu--btn a').click(function(){
          $('.main-menu-sidebar').toggleClass("menu-active");
          $('.menu-overlay').addClass("active-overlay");
          $(this).toggleClass('open');
      });

      // Menu
      $('.close-menu-btn').click(function(){
          $('.main-menu-sidebar').removeClass("menu-active");
          $('.menu-overlay').removeClass("active-overlay");
      });

          $(function() {

          var menu_ul = $('.nav-links > li.has-menu  ul'),
              menu_a  = $('.nav-links > li.has-menu  small');

          menu_ul.hide();

          menu_a.click(function(e) {
              e.preventDefault();
              if(!$(this).hasClass('active')) {
              menu_a.removeClass('active');
              menu_ul.filter(':visible').slideUp('normal');
              $(this).addClass('active').next().stop(true,true).slideDown('normal');
              } else {
              $(this).removeClass('active');
              $(this).next().stop(true,true).slideUp('normal');
              }
          });

          });

      $(".nav-links > li.has-menu  small ").attr("href","javascript:;");

      var $menu = $('#menu');

      $(document).mouseup(function (e) {
        if (!$menu.is(e.target) // if the target of the click isn't the container...
        && $menu.has(e.target).length === 0) // ... nor a descendant of the container
        {
          $menu.removeClass('menu-active');
          $('.menu-overlay').removeClass("active-overlay");
        }
      });

      $(document).ready(function() {
        $("#faq-accordion .set > a.accordion-heading").on("click", function(e) {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this)
                .siblings("#faq-accordion .content")
                .slideUp(200);
            } else {
                $("#faq-accordion .set > a.accordion-heading").removeClass("active");
                $(this).addClass("active");
                $("#faq-accordion .content").slideUp(200);
                $(this)
                .siblings("#faq-accordion .content")
                .slideDown(200);
            }
            e.preventDefault();
        });
    });

  });

})(jQuery);
