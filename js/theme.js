/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.9.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */

/* global window, document, define, jQuery, setInterval, clearInterval */
;

(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {
  'use strict';

  var Slick = window.Slick || {};

  Slick = function () {
    var instanceUid = 0;

    function Slick(element, settings) {
      var _ = this,
          dataSettings;

      _.defaults = {
        accessibility: true,
        adaptiveHeight: false,
        appendArrows: $(element),
        appendDots: $(element),
        arrows: true,
        asNavFor: null,
        prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: false,
        autoplaySpeed: 3000,
        centerMode: false,
        centerPadding: '50px',
        cssEase: 'ease',
        customPaging: function (slider, i) {
          return $('<button type="button" />').text(i + 1);
        },
        dots: false,
        dotsClass: 'slick-dots',
        draggable: true,
        easing: 'linear',
        edgeFriction: 0.35,
        fade: false,
        focusOnSelect: false,
        focusOnChange: false,
        infinite: true,
        initialSlide: 0,
        lazyLoad: 'ondemand',
        mobileFirst: false,
        pauseOnHover: true,
        pauseOnFocus: true,
        pauseOnDotsHover: false,
        respondTo: 'window',
        responsive: null,
        rows: 1,
        rtl: false,
        slide: '',
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: true,
        swipeToSlide: false,
        touchMove: true,
        touchThreshold: 5,
        useCSS: true,
        useTransform: true,
        variableWidth: false,
        vertical: false,
        verticalSwiping: false,
        waitForAnimate: true,
        zIndex: 1000
      };
      _.initials = {
        animating: false,
        dragging: false,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        scrolling: false,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: false,
        slideOffset: 0,
        swipeLeft: null,
        swiping: false,
        $list: null,
        touchObject: {},
        transformsEnabled: false,
        unslicked: false
      };
      $.extend(_, _.initials);
      _.activeBreakpoint = null;
      _.animType = null;
      _.animProp = null;
      _.breakpoints = [];
      _.breakpointSettings = [];
      _.cssTransitions = false;
      _.focussed = false;
      _.interrupted = false;
      _.hidden = 'hidden';
      _.paused = true;
      _.positionProp = null;
      _.respondTo = null;
      _.rowCount = 1;
      _.shouldClick = true;
      _.$slider = $(element);
      _.$slidesCache = null;
      _.transformType = null;
      _.transitionType = null;
      _.visibilityChange = 'visibilitychange';
      _.windowWidth = 0;
      _.windowTimer = null;
      dataSettings = $(element).data('slick') || {};
      _.options = $.extend({}, _.defaults, settings, dataSettings);
      _.currentSlide = _.options.initialSlide;
      _.originalSettings = _.options;

      if (typeof document.mozHidden !== 'undefined') {
        _.hidden = 'mozHidden';
        _.visibilityChange = 'mozvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        _.hidden = 'webkitHidden';
        _.visibilityChange = 'webkitvisibilitychange';
      }

      _.autoPlay = $.proxy(_.autoPlay, _);
      _.autoPlayClear = $.proxy(_.autoPlayClear, _);
      _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
      _.changeSlide = $.proxy(_.changeSlide, _);
      _.clickHandler = $.proxy(_.clickHandler, _);
      _.selectHandler = $.proxy(_.selectHandler, _);
      _.setPosition = $.proxy(_.setPosition, _);
      _.swipeHandler = $.proxy(_.swipeHandler, _);
      _.dragHandler = $.proxy(_.dragHandler, _);
      _.keyHandler = $.proxy(_.keyHandler, _);
      _.instanceUid = instanceUid++; // A simple way to check for HTML strings
      // Strict HTML recognition (must start with <)
      // Extracted from jQuery v1.11 source

      _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

      _.registerBreakpoints();

      _.init(true);
    }

    return Slick;
  }();

  Slick.prototype.activateADA = function () {
    var _ = this;

    _.$slideTrack.find('.slick-active').attr({
      'aria-hidden': 'false'
    }).find('a, input, button, select').attr({
      'tabindex': '0'
    });
  };

  Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {
    var _ = this;

    if (typeof index === 'boolean') {
      addBefore = index;
      index = null;
    } else if (index < 0 || index >= _.slideCount) {
      return false;
    }

    _.unload();

    if (typeof index === 'number') {
      if (index === 0 && _.$slides.length === 0) {
        $(markup).appendTo(_.$slideTrack);
      } else if (addBefore) {
        $(markup).insertBefore(_.$slides.eq(index));
      } else {
        $(markup).insertAfter(_.$slides.eq(index));
      }
    } else {
      if (addBefore === true) {
        $(markup).prependTo(_.$slideTrack);
      } else {
        $(markup).appendTo(_.$slideTrack);
      }
    }

    _.$slides = _.$slideTrack.children(this.options.slide);

    _.$slideTrack.children(this.options.slide).detach();

    _.$slideTrack.append(_.$slides);

    _.$slides.each(function (index, element) {
      $(element).attr('data-slick-index', index);
    });

    _.$slidesCache = _.$slides;

    _.reinit();
  };

  Slick.prototype.animateHeight = function () {
    var _ = this;

    if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);

      _.$list.animate({
        height: targetHeight
      }, _.options.speed);
    }
  };

  Slick.prototype.animateSlide = function (targetLeft, callback) {
    var animProps = {},
        _ = this;

    _.animateHeight();

    if (_.options.rtl === true && _.options.vertical === false) {
      targetLeft = -targetLeft;
    }

    if (_.transformsEnabled === false) {
      if (_.options.vertical === false) {
        _.$slideTrack.animate({
          left: targetLeft
        }, _.options.speed, _.options.easing, callback);
      } else {
        _.$slideTrack.animate({
          top: targetLeft
        }, _.options.speed, _.options.easing, callback);
      }
    } else {
      if (_.cssTransitions === false) {
        if (_.options.rtl === true) {
          _.currentLeft = -_.currentLeft;
        }

        $({
          animStart: _.currentLeft
        }).animate({
          animStart: targetLeft
        }, {
          duration: _.options.speed,
          easing: _.options.easing,
          step: function (now) {
            now = Math.ceil(now);

            if (_.options.vertical === false) {
              animProps[_.animType] = 'translate(' + now + 'px, 0px)';

              _.$slideTrack.css(animProps);
            } else {
              animProps[_.animType] = 'translate(0px,' + now + 'px)';

              _.$slideTrack.css(animProps);
            }
          },
          complete: function () {
            if (callback) {
              callback.call();
            }
          }
        });
      } else {
        _.applyTransition();

        targetLeft = Math.ceil(targetLeft);

        if (_.options.vertical === false) {
          animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
        } else {
          animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
        }

        _.$slideTrack.css(animProps);

        if (callback) {
          setTimeout(function () {
            _.disableTransition();

            callback.call();
          }, _.options.speed);
        }
      }
    }
  };

  Slick.prototype.getNavTarget = function () {
    var _ = this,
        asNavFor = _.options.asNavFor;

    if (asNavFor && asNavFor !== null) {
      asNavFor = $(asNavFor).not(_.$slider);
    }

    return asNavFor;
  };

  Slick.prototype.asNavFor = function (index) {
    var _ = this,
        asNavFor = _.getNavTarget();

    if (asNavFor !== null && typeof asNavFor === 'object') {
      asNavFor.each(function () {
        var target = $(this).slick('getSlick');

        if (!target.unslicked) {
          target.slideHandler(index, true);
        }
      });
    }
  };

  Slick.prototype.applyTransition = function (slide) {
    var _ = this,
        transition = {};

    if (_.options.fade === false) {
      transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
    } else {
      transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
    }

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  };

  Slick.prototype.autoPlay = function () {
    var _ = this;

    _.autoPlayClear();

    if (_.slideCount > _.options.slidesToShow) {
      _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
    }
  };

  Slick.prototype.autoPlayClear = function () {
    var _ = this;

    if (_.autoPlayTimer) {
      clearInterval(_.autoPlayTimer);
    }
  };

  Slick.prototype.autoPlayIterator = function () {
    var _ = this,
        slideTo = _.currentSlide + _.options.slidesToScroll;

    if (!_.paused && !_.interrupted && !_.focussed) {
      if (_.options.infinite === false) {
        if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
          _.direction = 0;
        } else if (_.direction === 0) {
          slideTo = _.currentSlide - _.options.slidesToScroll;

          if (_.currentSlide - 1 === 0) {
            _.direction = 1;
          }
        }
      }

      _.slideHandler(slideTo);
    }
  };

  Slick.prototype.buildArrows = function () {
    var _ = this;

    if (_.options.arrows === true) {
      _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
      _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

      if (_.slideCount > _.options.slidesToShow) {
        _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

        _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

        if (_.htmlExpr.test(_.options.prevArrow)) {
          _.$prevArrow.prependTo(_.options.appendArrows);
        }

        if (_.htmlExpr.test(_.options.nextArrow)) {
          _.$nextArrow.appendTo(_.options.appendArrows);
        }

        if (_.options.infinite !== true) {
          _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
        }
      } else {
        _.$prevArrow.add(_.$nextArrow).addClass('slick-hidden').attr({
          'aria-disabled': 'true',
          'tabindex': '-1'
        });
      }
    }
  };

  Slick.prototype.buildDots = function () {
    var _ = this,
        i,
        dot;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$slider.addClass('slick-dotted');

      dot = $('<ul />').addClass(_.options.dotsClass);

      for (i = 0; i <= _.getDotCount(); i += 1) {
        dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
      }

      _.$dots = dot.appendTo(_.options.appendDots);

      _.$dots.find('li').first().addClass('slick-active');
    }
  };

  Slick.prototype.buildOut = function () {
    var _ = this;

    _.$slides = _.$slider.children(_.options.slide + ':not(.slick-cloned)').addClass('slick-slide');
    _.slideCount = _.$slides.length;

    _.$slides.each(function (index, element) {
      $(element).attr('data-slick-index', index).data('originalStyling', $(element).attr('style') || '');
    });

    _.$slider.addClass('slick-slider');

    _.$slideTrack = _.slideCount === 0 ? $('<div class="slick-track"/>').appendTo(_.$slider) : _.$slides.wrapAll('<div class="slick-track"/>').parent();
    _.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent();

    _.$slideTrack.css('opacity', 0);

    if (_.options.centerMode === true || _.options.swipeToSlide === true) {
      _.options.slidesToScroll = 1;
    }

    $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

    _.setupInfinite();

    _.buildArrows();

    _.buildDots();

    _.updateDots();

    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

    if (_.options.draggable === true) {
      _.$list.addClass('draggable');
    }
  };

  Slick.prototype.buildRows = function () {
    var _ = this,
        a,
        b,
        c,
        newSlides,
        numOfSlides,
        originalSlides,
        slidesPerSection;

    newSlides = document.createDocumentFragment();
    originalSlides = _.$slider.children();

    if (_.options.rows > 0) {
      slidesPerSection = _.options.slidesPerRow * _.options.rows;
      numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);

      for (a = 0; a < numOfSlides; a++) {
        var slide = document.createElement('div');

        for (b = 0; b < _.options.rows; b++) {
          var row = document.createElement('div');

          for (c = 0; c < _.options.slidesPerRow; c++) {
            var target = a * slidesPerSection + (b * _.options.slidesPerRow + c);

            if (originalSlides.get(target)) {
              row.appendChild(originalSlides.get(target));
            }
          }

          slide.appendChild(row);
        }

        newSlides.appendChild(slide);
      }

      _.$slider.empty().append(newSlides);

      _.$slider.children().children().children().css({
        'width': 100 / _.options.slidesPerRow + '%',
        'display': 'inline-block'
      });
    }
  };

  Slick.prototype.checkResponsive = function (initial, forceUpdate) {
    var _ = this,
        breakpoint,
        targetBreakpoint,
        respondToWidth,
        triggerBreakpoint = false;

    var sliderWidth = _.$slider.width();

    var windowWidth = window.innerWidth || $(window).width();

    if (_.respondTo === 'window') {
      respondToWidth = windowWidth;
    } else if (_.respondTo === 'slider') {
      respondToWidth = sliderWidth;
    } else if (_.respondTo === 'min') {
      respondToWidth = Math.min(windowWidth, sliderWidth);
    }

    if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {
      targetBreakpoint = null;

      for (breakpoint in _.breakpoints) {
        if (_.breakpoints.hasOwnProperty(breakpoint)) {
          if (_.originalSettings.mobileFirst === false) {
            if (respondToWidth < _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint];
            }
          } else {
            if (respondToWidth > _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint];
            }
          }
        }
      }

      if (targetBreakpoint !== null) {
        if (_.activeBreakpoint !== null) {
          if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
            _.activeBreakpoint = targetBreakpoint;

            if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
              _.unslick(targetBreakpoint);
            } else {
              _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);

              if (initial === true) {
                _.currentSlide = _.options.initialSlide;
              }

              _.refresh(initial);
            }

            triggerBreakpoint = targetBreakpoint;
          }
        } else {
          _.activeBreakpoint = targetBreakpoint;

          if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
            _.unslick(targetBreakpoint);
          } else {
            _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);

            if (initial === true) {
              _.currentSlide = _.options.initialSlide;
            }

            _.refresh(initial);
          }

          triggerBreakpoint = targetBreakpoint;
        }
      } else {
        if (_.activeBreakpoint !== null) {
          _.activeBreakpoint = null;
          _.options = _.originalSettings;

          if (initial === true) {
            _.currentSlide = _.options.initialSlide;
          }

          _.refresh(initial);

          triggerBreakpoint = targetBreakpoint;
        }
      } // only trigger breakpoints during an actual break. not on initialize.


      if (!initial && triggerBreakpoint !== false) {
        _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
      }
    }
  };

  Slick.prototype.changeSlide = function (event, dontAnimate) {
    var _ = this,
        $target = $(event.currentTarget),
        indexOffset,
        slideOffset,
        unevenOffset; // If target is a link, prevent default action.


    if ($target.is('a')) {
      event.preventDefault();
    } // If target is not the <li> element (ie: a child), find the <li>.


    if (!$target.is('li')) {
      $target = $target.closest('li');
    }

    unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
    indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

    switch (event.data.message) {
      case 'previous':
        slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;

        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
        }

        break;

      case 'next':
        slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;

        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
        }

        break;

      case 'index':
        var index = event.data.index === 0 ? 0 : event.data.index || $target.index() * _.options.slidesToScroll;

        _.slideHandler(_.checkNavigable(index), false, dontAnimate);

        $target.children().trigger('focus');
        break;

      default:
        return;
    }
  };

  Slick.prototype.checkNavigable = function (index) {
    var _ = this,
        navigables,
        prevNavigable;

    navigables = _.getNavigableIndexes();
    prevNavigable = 0;

    if (index > navigables[navigables.length - 1]) {
      index = navigables[navigables.length - 1];
    } else {
      for (var n in navigables) {
        if (index < navigables[n]) {
          index = prevNavigable;
          break;
        }

        prevNavigable = navigables[n];
      }
    }

    return index;
  };

  Slick.prototype.cleanUpEvents = function () {
    var _ = this;

    if (_.options.dots && _.$dots !== null) {
      $('li', _.$dots).off('click.slick', _.changeSlide).off('mouseenter.slick', $.proxy(_.interrupt, _, true)).off('mouseleave.slick', $.proxy(_.interrupt, _, false));

      if (_.options.accessibility === true) {
        _.$dots.off('keydown.slick', _.keyHandler);
      }
    }

    _.$slider.off('focus.slick blur.slick');

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
      _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

      if (_.options.accessibility === true) {
        _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
        _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
      }
    }

    _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);

    _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);

    _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);

    _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

    _.$list.off('click.slick', _.clickHandler);

    $(document).off(_.visibilityChange, _.visibility);

    _.cleanUpSlideEvents();

    if (_.options.accessibility === true) {
      _.$list.off('keydown.slick', _.keyHandler);
    }

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().off('click.slick', _.selectHandler);
    }

    $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);
    $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);
    $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);
    $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
  };

  Slick.prototype.cleanUpSlideEvents = function () {
    var _ = this;

    _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));

    _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
  };

  Slick.prototype.cleanUpRows = function () {
    var _ = this,
        originalSlides;

    if (_.options.rows > 0) {
      originalSlides = _.$slides.children().children();
      originalSlides.removeAttr('style');

      _.$slider.empty().append(originalSlides);
    }
  };

  Slick.prototype.clickHandler = function (event) {
    var _ = this;

    if (_.shouldClick === false) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  Slick.prototype.destroy = function (refresh) {
    var _ = this;

    _.autoPlayClear();

    _.touchObject = {};

    _.cleanUpEvents();

    $('.slick-cloned', _.$slider).detach();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.$prevArrow.length) {
      _.$prevArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

      if (_.htmlExpr.test(_.options.prevArrow)) {
        _.$prevArrow.remove();
      }
    }

    if (_.$nextArrow && _.$nextArrow.length) {
      _.$nextArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

      if (_.htmlExpr.test(_.options.nextArrow)) {
        _.$nextArrow.remove();
      }
    }

    if (_.$slides) {
      _.$slides.removeClass('slick-slide slick-active slick-center slick-visible slick-current').removeAttr('aria-hidden').removeAttr('data-slick-index').each(function () {
        $(this).attr('style', $(this).data('originalStyling'));
      });

      _.$slideTrack.children(this.options.slide).detach();

      _.$slideTrack.detach();

      _.$list.detach();

      _.$slider.append(_.$slides);
    }

    _.cleanUpRows();

    _.$slider.removeClass('slick-slider');

    _.$slider.removeClass('slick-initialized');

    _.$slider.removeClass('slick-dotted');

    _.unslicked = true;

    if (!refresh) {
      _.$slider.trigger('destroy', [_]);
    }
  };

  Slick.prototype.disableTransition = function (slide) {
    var _ = this,
        transition = {};

    transition[_.transitionType] = '';

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  };

  Slick.prototype.fadeSlide = function (slideIndex, callback) {
    var _ = this;

    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).css({
        zIndex: _.options.zIndex
      });

      _.$slides.eq(slideIndex).animate({
        opacity: 1
      }, _.options.speed, _.options.easing, callback);
    } else {
      _.applyTransition(slideIndex);

      _.$slides.eq(slideIndex).css({
        opacity: 1,
        zIndex: _.options.zIndex
      });

      if (callback) {
        setTimeout(function () {
          _.disableTransition(slideIndex);

          callback.call();
        }, _.options.speed);
      }
    }
  };

  Slick.prototype.fadeSlideOut = function (slideIndex) {
    var _ = this;

    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).animate({
        opacity: 0,
        zIndex: _.options.zIndex - 2
      }, _.options.speed, _.options.easing);
    } else {
      _.applyTransition(slideIndex);

      _.$slides.eq(slideIndex).css({
        opacity: 0,
        zIndex: _.options.zIndex - 2
      });
    }
  };

  Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {
    var _ = this;

    if (filter !== null) {
      _.$slidesCache = _.$slides;

      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

      _.reinit();
    }
  };

  Slick.prototype.focusHandler = function () {
    var _ = this; // If any child element receives focus within the slider we need to pause the autoplay


    _.$slider.off('focus.slick blur.slick').on('focus.slick', '*', function (event) {
      var $sf = $(this);
      setTimeout(function () {
        if (_.options.pauseOnFocus) {
          if ($sf.is(':focus')) {
            _.focussed = true;

            _.autoPlay();
          }
        }
      }, 0);
    }).on('blur.slick', '*', function (event) {
      var $sf = $(this); // When a blur occurs on any elements within the slider we become unfocused

      if (_.options.pauseOnFocus) {
        _.focussed = false;

        _.autoPlay();
      }
    });
  };

  Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {
    var _ = this;

    return _.currentSlide;
  };

  Slick.prototype.getDotCount = function () {
    var _ = this;

    var breakPoint = 0;
    var counter = 0;
    var pagerQty = 0;

    if (_.options.infinite === true) {
      if (_.slideCount <= _.options.slidesToShow) {
        ++pagerQty;
      } else {
        while (breakPoint < _.slideCount) {
          ++pagerQty;
          breakPoint = counter + _.options.slidesToScroll;
          counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }
      }
    } else if (_.options.centerMode === true) {
      pagerQty = _.slideCount;
    } else if (!_.options.asNavFor) {
      pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
    } else {
      while (breakPoint < _.slideCount) {
        ++pagerQty;
        breakPoint = counter + _.options.slidesToScroll;
        counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
      }
    }

    return pagerQty - 1;
  };

  Slick.prototype.getLeft = function (slideIndex) {
    var _ = this,
        targetLeft,
        verticalHeight,
        verticalOffset = 0,
        targetSlide,
        coef;

    _.slideOffset = 0;
    verticalHeight = _.$slides.first().outerHeight(true);

    if (_.options.infinite === true) {
      if (_.slideCount > _.options.slidesToShow) {
        _.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
        coef = -1;

        if (_.options.vertical === true && _.options.centerMode === true) {
          if (_.options.slidesToShow === 2) {
            coef = -1.5;
          } else if (_.options.slidesToShow === 1) {
            coef = -2;
          }
        }

        verticalOffset = verticalHeight * _.options.slidesToShow * coef;
      }

      if (_.slideCount % _.options.slidesToScroll !== 0) {
        if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
          if (slideIndex > _.slideCount) {
            _.slideOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1;
            verticalOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1;
          } else {
            _.slideOffset = _.slideCount % _.options.slidesToScroll * _.slideWidth * -1;
            verticalOffset = _.slideCount % _.options.slidesToScroll * verticalHeight * -1;
          }
        }
      }
    } else {
      if (slideIndex + _.options.slidesToShow > _.slideCount) {
        _.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth;
        verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
      }
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.slideOffset = 0;
      verticalOffset = 0;
    }

    if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
      _.slideOffset = _.slideWidth * Math.floor(_.options.slidesToShow) / 2 - _.slideWidth * _.slideCount / 2;
    } else if (_.options.centerMode === true && _.options.infinite === true) {
      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
    } else if (_.options.centerMode === true) {
      _.slideOffset = 0;
      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
    }

    if (_.options.vertical === false) {
      targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
    } else {
      targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
    }

    if (_.options.variableWidth === true) {
      if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
      } else {
        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
      }

      if (_.options.rtl === true) {
        if (targetSlide[0]) {
          targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
        } else {
          targetLeft = 0;
        }
      } else {
        targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
      }

      if (_.options.centerMode === true) {
        if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
        } else {
          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
        }

        if (_.options.rtl === true) {
          if (targetSlide[0]) {
            targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
          } else {
            targetLeft = 0;
          }
        } else {
          targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
        }

        targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
      }
    }

    return targetLeft;
  };

  Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {
    var _ = this;

    return _.options[option];
  };

  Slick.prototype.getNavigableIndexes = function () {
    var _ = this,
        breakPoint = 0,
        counter = 0,
        indexes = [],
        max;

    if (_.options.infinite === false) {
      max = _.slideCount;
    } else {
      breakPoint = _.options.slidesToScroll * -1;
      counter = _.options.slidesToScroll * -1;
      max = _.slideCount * 2;
    }

    while (breakPoint < max) {
      indexes.push(breakPoint);
      breakPoint = counter + _.options.slidesToScroll;
      counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
    }

    return indexes;
  };

  Slick.prototype.getSlick = function () {
    return this;
  };

  Slick.prototype.getSlideCount = function () {
    var _ = this,
        slidesTraversed,
        swipedSlide,
        swipeTarget,
        centerOffset;

    centerOffset = _.options.centerMode === true ? Math.floor(_.$list.width() / 2) : 0;
    swipeTarget = _.swipeLeft * -1 + centerOffset;

    if (_.options.swipeToSlide === true) {
      _.$slideTrack.find('.slick-slide').each(function (index, slide) {
        var slideOuterWidth, slideOffset, slideRightBoundary;
        slideOuterWidth = $(slide).outerWidth();
        slideOffset = slide.offsetLeft;

        if (_.options.centerMode !== true) {
          slideOffset += slideOuterWidth / 2;
        }

        slideRightBoundary = slideOffset + slideOuterWidth;

        if (swipeTarget < slideRightBoundary) {
          swipedSlide = slide;
          return false;
        }
      });

      slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;
      return slidesTraversed;
    } else {
      return _.options.slidesToScroll;
    }
  };

  Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'index',
        index: parseInt(slide)
      }
    }, dontAnimate);
  };

  Slick.prototype.init = function (creation) {
    var _ = this;

    if (!$(_.$slider).hasClass('slick-initialized')) {
      $(_.$slider).addClass('slick-initialized');

      _.buildRows();

      _.buildOut();

      _.setProps();

      _.startLoad();

      _.loadSlider();

      _.initializeEvents();

      _.updateArrows();

      _.updateDots();

      _.checkResponsive(true);

      _.focusHandler();
    }

    if (creation) {
      _.$slider.trigger('init', [_]);
    }

    if (_.options.accessibility === true) {
      _.initADA();
    }

    if (_.options.autoplay) {
      _.paused = false;

      _.autoPlay();
    }
  };

  Slick.prototype.initADA = function () {
    var _ = this,
        numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
        tabControlIndexes = _.getNavigableIndexes().filter(function (val) {
      return val >= 0 && val < _.slideCount;
    });

    _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
      'aria-hidden': 'true',
      'tabindex': '-1'
    }).find('a, input, button, select').attr({
      'tabindex': '-1'
    });

    if (_.$dots !== null) {
      _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
        var slideControlIndex = tabControlIndexes.indexOf(i);
        $(this).attr({
          'role': 'tabpanel',
          'id': 'slick-slide' + _.instanceUid + i,
          'tabindex': -1
        });

        if (slideControlIndex !== -1) {
          var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex;

          if ($('#' + ariaButtonControl).length) {
            $(this).attr({
              'aria-describedby': ariaButtonControl
            });
          }
        }
      });

      _.$dots.attr('role', 'tablist').find('li').each(function (i) {
        var mappedSlideIndex = tabControlIndexes[i];
        $(this).attr({
          'role': 'presentation'
        });
        $(this).find('button').first().attr({
          'role': 'tab',
          'id': 'slick-slide-control' + _.instanceUid + i,
          'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
          'aria-label': i + 1 + ' of ' + numDotGroups,
          'aria-selected': null,
          'tabindex': '-1'
        });
      }).eq(_.currentSlide).find('button').attr({
        'aria-selected': 'true',
        'tabindex': '0'
      }).end();
    }

    for (var i = _.currentSlide, max = i + _.options.slidesToShow; i < max; i++) {
      if (_.options.focusOnChange) {
        _.$slides.eq(i).attr({
          'tabindex': '0'
        });
      } else {
        _.$slides.eq(i).removeAttr('tabindex');
      }
    }

    _.activateADA();
  };

  Slick.prototype.initArrowEvents = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.off('click.slick').on('click.slick', {
        message: 'previous'
      }, _.changeSlide);

      _.$nextArrow.off('click.slick').on('click.slick', {
        message: 'next'
      }, _.changeSlide);

      if (_.options.accessibility === true) {
        _.$prevArrow.on('keydown.slick', _.keyHandler);

        _.$nextArrow.on('keydown.slick', _.keyHandler);
      }
    }
  };

  Slick.prototype.initDotEvents = function () {
    var _ = this;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      $('li', _.$dots).on('click.slick', {
        message: 'index'
      }, _.changeSlide);

      if (_.options.accessibility === true) {
        _.$dots.on('keydown.slick', _.keyHandler);
      }
    }

    if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {
      $('li', _.$dots).on('mouseenter.slick', $.proxy(_.interrupt, _, true)).on('mouseleave.slick', $.proxy(_.interrupt, _, false));
    }
  };

  Slick.prototype.initSlideEvents = function () {
    var _ = this;

    if (_.options.pauseOnHover) {
      _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));

      _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
    }
  };

  Slick.prototype.initializeEvents = function () {
    var _ = this;

    _.initArrowEvents();

    _.initDotEvents();

    _.initSlideEvents();

    _.$list.on('touchstart.slick mousedown.slick', {
      action: 'start'
    }, _.swipeHandler);

    _.$list.on('touchmove.slick mousemove.slick', {
      action: 'move'
    }, _.swipeHandler);

    _.$list.on('touchend.slick mouseup.slick', {
      action: 'end'
    }, _.swipeHandler);

    _.$list.on('touchcancel.slick mouseleave.slick', {
      action: 'end'
    }, _.swipeHandler);

    _.$list.on('click.slick', _.clickHandler);

    $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

    if (_.options.accessibility === true) {
      _.$list.on('keydown.slick', _.keyHandler);
    }

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
    }

    $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));
    $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));
    $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);
    $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
    $(_.setPosition);
  };

  Slick.prototype.initUI = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.show();

      _.$nextArrow.show();
    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.show();
    }
  };

  Slick.prototype.keyHandler = function (event) {
    var _ = this; //Dont slide if the cursor is inside the form fields and arrow keys are pressed


    if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
      if (event.keyCode === 37 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? 'next' : 'previous'
          }
        });
      } else if (event.keyCode === 39 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? 'previous' : 'next'
          }
        });
      }
    }
  };

  Slick.prototype.lazyLoad = function () {
    var _ = this,
        loadRange,
        cloneRange,
        rangeStart,
        rangeEnd;

    function loadImages(imagesScope) {
      $('img[data-lazy]', imagesScope).each(function () {
        var image = $(this),
            imageSource = $(this).attr('data-lazy'),
            imageSrcSet = $(this).attr('data-srcset'),
            imageSizes = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
            imageToLoad = document.createElement('img');

        imageToLoad.onload = function () {
          image.animate({
            opacity: 0
          }, 100, function () {
            if (imageSrcSet) {
              image.attr('srcset', imageSrcSet);

              if (imageSizes) {
                image.attr('sizes', imageSizes);
              }
            }

            image.attr('src', imageSource).animate({
              opacity: 1
            }, 200, function () {
              image.removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');
            });

            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
          });
        };

        imageToLoad.onerror = function () {
          image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

          _.$slider.trigger('lazyLoadError', [_, image, imageSource]);
        };

        imageToLoad.src = imageSource;
      });
    }

    if (_.options.centerMode === true) {
      if (_.options.infinite === true) {
        rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
        rangeEnd = rangeStart + _.options.slidesToShow + 2;
      } else {
        rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
        rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
      }
    } else {
      rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
      rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);

      if (_.options.fade === true) {
        if (rangeStart > 0) rangeStart--;
        if (rangeEnd <= _.slideCount) rangeEnd++;
      }
    }

    loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

    if (_.options.lazyLoad === 'anticipated') {
      var prevSlide = rangeStart - 1,
          nextSlide = rangeEnd,
          $slides = _.$slider.find('.slick-slide');

      for (var i = 0; i < _.options.slidesToScroll; i++) {
        if (prevSlide < 0) prevSlide = _.slideCount - 1;
        loadRange = loadRange.add($slides.eq(prevSlide));
        loadRange = loadRange.add($slides.eq(nextSlide));
        prevSlide--;
        nextSlide++;
      }
    }

    loadImages(loadRange);

    if (_.slideCount <= _.options.slidesToShow) {
      cloneRange = _.$slider.find('.slick-slide');
      loadImages(cloneRange);
    } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
      cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
      loadImages(cloneRange);
    } else if (_.currentSlide === 0) {
      cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
      loadImages(cloneRange);
    }
  };

  Slick.prototype.loadSlider = function () {
    var _ = this;

    _.setPosition();

    _.$slideTrack.css({
      opacity: 1
    });

    _.$slider.removeClass('slick-loading');

    _.initUI();

    if (_.options.lazyLoad === 'progressive') {
      _.progressiveLazyLoad();
    }
  };

  Slick.prototype.next = Slick.prototype.slickNext = function () {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'next'
      }
    });
  };

  Slick.prototype.orientationChange = function () {
    var _ = this;

    _.checkResponsive();

    _.setPosition();
  };

  Slick.prototype.pause = Slick.prototype.slickPause = function () {
    var _ = this;

    _.autoPlayClear();

    _.paused = true;
  };

  Slick.prototype.play = Slick.prototype.slickPlay = function () {
    var _ = this;

    _.autoPlay();

    _.options.autoplay = true;
    _.paused = false;
    _.focussed = false;
    _.interrupted = false;
  };

  Slick.prototype.postSlide = function (index) {
    var _ = this;

    if (!_.unslicked) {
      _.$slider.trigger('afterChange', [_, index]);

      _.animating = false;

      if (_.slideCount > _.options.slidesToShow) {
        _.setPosition();
      }

      _.swipeLeft = null;

      if (_.options.autoplay) {
        _.autoPlay();
      }

      if (_.options.accessibility === true) {
        _.initADA();

        if (_.options.focusOnChange) {
          var $currentSlide = $(_.$slides.get(_.currentSlide));
          $currentSlide.attr('tabindex', 0).focus();
        }
      }
    }
  };

  Slick.prototype.prev = Slick.prototype.slickPrev = function () {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'previous'
      }
    });
  };

  Slick.prototype.preventDefault = function (event) {
    event.preventDefault();
  };

  Slick.prototype.progressiveLazyLoad = function (tryCount) {
    tryCount = tryCount || 1;

    var _ = this,
        $imgsToLoad = $('img[data-lazy]', _.$slider),
        image,
        imageSource,
        imageSrcSet,
        imageSizes,
        imageToLoad;

    if ($imgsToLoad.length) {
      image = $imgsToLoad.first();
      imageSource = image.attr('data-lazy');
      imageSrcSet = image.attr('data-srcset');
      imageSizes = image.attr('data-sizes') || _.$slider.attr('data-sizes');
      imageToLoad = document.createElement('img');

      imageToLoad.onload = function () {
        if (imageSrcSet) {
          image.attr('srcset', imageSrcSet);

          if (imageSizes) {
            image.attr('sizes', imageSizes);
          }
        }

        image.attr('src', imageSource).removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');

        if (_.options.adaptiveHeight === true) {
          _.setPosition();
        }

        _.$slider.trigger('lazyLoaded', [_, image, imageSource]);

        _.progressiveLazyLoad();
      };

      imageToLoad.onerror = function () {
        if (tryCount < 3) {
          /**
           * try to load the image 3 times,
           * leave a slight delay so we don't get
           * servers blocking the request.
           */
          setTimeout(function () {
            _.progressiveLazyLoad(tryCount + 1);
          }, 500);
        } else {
          image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

          _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

          _.progressiveLazyLoad();
        }
      };

      imageToLoad.src = imageSource;
    } else {
      _.$slider.trigger('allImagesLoaded', [_]);
    }
  };

  Slick.prototype.refresh = function (initializing) {
    var _ = this,
        currentSlide,
        lastVisibleIndex;

    lastVisibleIndex = _.slideCount - _.options.slidesToShow; // in non-infinite sliders, we don't want to go past the
    // last visible index.

    if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
      _.currentSlide = lastVisibleIndex;
    } // if less slides than to show, go to start.


    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    currentSlide = _.currentSlide;

    _.destroy(true);

    $.extend(_, _.initials, {
      currentSlide: currentSlide
    });

    _.init();

    if (!initializing) {
      _.changeSlide({
        data: {
          message: 'index',
          index: currentSlide
        }
      }, false);
    }
  };

  Slick.prototype.registerBreakpoints = function () {
    var _ = this,
        breakpoint,
        currentBreakpoint,
        l,
        responsiveSettings = _.options.responsive || null;

    if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {
      _.respondTo = _.options.respondTo || 'window';

      for (breakpoint in responsiveSettings) {
        l = _.breakpoints.length - 1;

        if (responsiveSettings.hasOwnProperty(breakpoint)) {
          currentBreakpoint = responsiveSettings[breakpoint].breakpoint; // loop through the breakpoints and cut out any existing
          // ones with the same breakpoint number, we don't want dupes.

          while (l >= 0) {
            if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
              _.breakpoints.splice(l, 1);
            }

            l--;
          }

          _.breakpoints.push(currentBreakpoint);

          _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
        }
      }

      _.breakpoints.sort(function (a, b) {
        return _.options.mobileFirst ? a - b : b - a;
      });
    }
  };

  Slick.prototype.reinit = function () {
    var _ = this;

    _.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide');
    _.slideCount = _.$slides.length;

    if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
      _.currentSlide = _.currentSlide - _.options.slidesToScroll;
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    _.registerBreakpoints();

    _.setProps();

    _.setupInfinite();

    _.buildArrows();

    _.updateArrows();

    _.initArrowEvents();

    _.buildDots();

    _.updateDots();

    _.initDotEvents();

    _.cleanUpSlideEvents();

    _.initSlideEvents();

    _.checkResponsive(false, true);

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
    }

    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

    _.setPosition();

    _.focusHandler();

    _.paused = !_.options.autoplay;

    _.autoPlay();

    _.$slider.trigger('reInit', [_]);
  };

  Slick.prototype.resize = function () {
    var _ = this;

    if ($(window).width() !== _.windowWidth) {
      clearTimeout(_.windowDelay);
      _.windowDelay = window.setTimeout(function () {
        _.windowWidth = $(window).width();

        _.checkResponsive();

        if (!_.unslicked) {
          _.setPosition();
        }
      }, 50);
    }
  };

  Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (index, removeBefore, removeAll) {
    var _ = this;

    if (typeof index === 'boolean') {
      removeBefore = index;
      index = removeBefore === true ? 0 : _.slideCount - 1;
    } else {
      index = removeBefore === true ? --index : index;
    }

    if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
      return false;
    }

    _.unload();

    if (removeAll === true) {
      _.$slideTrack.children().remove();
    } else {
      _.$slideTrack.children(this.options.slide).eq(index).remove();
    }

    _.$slides = _.$slideTrack.children(this.options.slide);

    _.$slideTrack.children(this.options.slide).detach();

    _.$slideTrack.append(_.$slides);

    _.$slidesCache = _.$slides;

    _.reinit();
  };

  Slick.prototype.setCSS = function (position) {
    var _ = this,
        positionProps = {},
        x,
        y;

    if (_.options.rtl === true) {
      position = -position;
    }

    x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
    y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';
    positionProps[_.positionProp] = position;

    if (_.transformsEnabled === false) {
      _.$slideTrack.css(positionProps);
    } else {
      positionProps = {};

      if (_.cssTransitions === false) {
        positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';

        _.$slideTrack.css(positionProps);
      } else {
        positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';

        _.$slideTrack.css(positionProps);
      }
    }
  };

  Slick.prototype.setDimensions = function () {
    var _ = this;

    if (_.options.vertical === false) {
      if (_.options.centerMode === true) {
        _.$list.css({
          padding: '0px ' + _.options.centerPadding
        });
      }
    } else {
      _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);

      if (_.options.centerMode === true) {
        _.$list.css({
          padding: _.options.centerPadding + ' 0px'
        });
      }
    }

    _.listWidth = _.$list.width();
    _.listHeight = _.$list.height();

    if (_.options.vertical === false && _.options.variableWidth === false) {
      _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);

      _.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children('.slick-slide').length));
    } else if (_.options.variableWidth === true) {
      _.$slideTrack.width(5000 * _.slideCount);
    } else {
      _.slideWidth = Math.ceil(_.listWidth);

      _.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length));
    }

    var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();

    if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
  };

  Slick.prototype.setFade = function () {
    var _ = this,
        targetLeft;

    _.$slides.each(function (index, element) {
      targetLeft = _.slideWidth * index * -1;

      if (_.options.rtl === true) {
        $(element).css({
          position: 'relative',
          right: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0
        });
      } else {
        $(element).css({
          position: 'relative',
          left: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0
        });
      }
    });

    _.$slides.eq(_.currentSlide).css({
      zIndex: _.options.zIndex - 1,
      opacity: 1
    });
  };

  Slick.prototype.setHeight = function () {
    var _ = this;

    if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);

      _.$list.css('height', targetHeight);
    }
  };

  Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {
    /**
     * accepts arguments in format of:
     *
     *  - for changing a single option's value:
     *     .slick("setOption", option, value, refresh )
     *
     *  - for changing a set of responsive options:
     *     .slick("setOption", 'responsive', [{}, ...], refresh )
     *
     *  - for updating multiple values at once (not responsive)
     *     .slick("setOption", { 'option': value, ... }, refresh )
     */
    var _ = this,
        l,
        item,
        option,
        value,
        refresh = false,
        type;

    if ($.type(arguments[0]) === 'object') {
      option = arguments[0];
      refresh = arguments[1];
      type = 'multiple';
    } else if ($.type(arguments[0]) === 'string') {
      option = arguments[0];
      value = arguments[1];
      refresh = arguments[2];

      if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {
        type = 'responsive';
      } else if (typeof arguments[1] !== 'undefined') {
        type = 'single';
      }
    }

    if (type === 'single') {
      _.options[option] = value;
    } else if (type === 'multiple') {
      $.each(option, function (opt, val) {
        _.options[opt] = val;
      });
    } else if (type === 'responsive') {
      for (item in value) {
        if ($.type(_.options.responsive) !== 'array') {
          _.options.responsive = [value[item]];
        } else {
          l = _.options.responsive.length - 1; // loop through the responsive object and splice out duplicates.

          while (l >= 0) {
            if (_.options.responsive[l].breakpoint === value[item].breakpoint) {
              _.options.responsive.splice(l, 1);
            }

            l--;
          }

          _.options.responsive.push(value[item]);
        }
      }
    }

    if (refresh) {
      _.unload();

      _.reinit();
    }
  };

  Slick.prototype.setPosition = function () {
    var _ = this;

    _.setDimensions();

    _.setHeight();

    if (_.options.fade === false) {
      _.setCSS(_.getLeft(_.currentSlide));
    } else {
      _.setFade();
    }

    _.$slider.trigger('setPosition', [_]);
  };

  Slick.prototype.setProps = function () {
    var _ = this,
        bodyStyle = document.body.style;

    _.positionProp = _.options.vertical === true ? 'top' : 'left';

    if (_.positionProp === 'top') {
      _.$slider.addClass('slick-vertical');
    } else {
      _.$slider.removeClass('slick-vertical');
    }

    if (bodyStyle.WebkitTransition !== undefined || bodyStyle.MozTransition !== undefined || bodyStyle.msTransition !== undefined) {
      if (_.options.useCSS === true) {
        _.cssTransitions = true;
      }
    }

    if (_.options.fade) {
      if (typeof _.options.zIndex === 'number') {
        if (_.options.zIndex < 3) {
          _.options.zIndex = 3;
        }
      } else {
        _.options.zIndex = _.defaults.zIndex;
      }
    }

    if (bodyStyle.OTransform !== undefined) {
      _.animType = 'OTransform';
      _.transformType = '-o-transform';
      _.transitionType = 'OTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
    }

    if (bodyStyle.MozTransform !== undefined) {
      _.animType = 'MozTransform';
      _.transformType = '-moz-transform';
      _.transitionType = 'MozTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
    }

    if (bodyStyle.webkitTransform !== undefined) {
      _.animType = 'webkitTransform';
      _.transformType = '-webkit-transform';
      _.transitionType = 'webkitTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
    }

    if (bodyStyle.msTransform !== undefined) {
      _.animType = 'msTransform';
      _.transformType = '-ms-transform';
      _.transitionType = 'msTransition';
      if (bodyStyle.msTransform === undefined) _.animType = false;
    }

    if (bodyStyle.transform !== undefined && _.animType !== false) {
      _.animType = 'transform';
      _.transformType = 'transform';
      _.transitionType = 'transition';
    }

    _.transformsEnabled = _.options.useTransform && _.animType !== null && _.animType !== false;
  };

  Slick.prototype.setSlideClasses = function (index) {
    var _ = this,
        centerOffset,
        allSlides,
        indexOffset,
        remainder;

    allSlides = _.$slider.find('.slick-slide').removeClass('slick-active slick-center slick-current').attr('aria-hidden', 'true');

    _.$slides.eq(index).addClass('slick-current');

    if (_.options.centerMode === true) {
      var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;
      centerOffset = Math.floor(_.options.slidesToShow / 2);

      if (_.options.infinite === true) {
        if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset) {
          _.$slides.slice(index - centerOffset + evenCoef, index + centerOffset + 1).addClass('slick-active').attr('aria-hidden', 'false');
        } else {
          indexOffset = _.options.slidesToShow + index;
          allSlides.slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2).addClass('slick-active').attr('aria-hidden', 'false');
        }

        if (index === 0) {
          allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center');
        } else if (index === _.slideCount - 1) {
          allSlides.eq(_.options.slidesToShow).addClass('slick-center');
        }
      }

      _.$slides.eq(index).addClass('slick-center');
    } else {
      if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {
        _.$slides.slice(index, index + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
      } else if (allSlides.length <= _.options.slidesToShow) {
        allSlides.addClass('slick-active').attr('aria-hidden', 'false');
      } else {
        remainder = _.slideCount % _.options.slidesToShow;
        indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

        if (_.options.slidesToShow == _.options.slidesToScroll && _.slideCount - index < _.options.slidesToShow) {
          allSlides.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder).addClass('slick-active').attr('aria-hidden', 'false');
        } else {
          allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
        }
      }
    }

    if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
      _.lazyLoad();
    }
  };

  Slick.prototype.setupInfinite = function () {
    var _ = this,
        i,
        slideIndex,
        infiniteCount;

    if (_.options.fade === true) {
      _.options.centerMode = false;
    }

    if (_.options.infinite === true && _.options.fade === false) {
      slideIndex = null;

      if (_.slideCount > _.options.slidesToShow) {
        if (_.options.centerMode === true) {
          infiniteCount = _.options.slidesToShow + 1;
        } else {
          infiniteCount = _.options.slidesToShow;
        }

        for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
          slideIndex = i - 1;
          $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex - _.slideCount).prependTo(_.$slideTrack).addClass('slick-cloned');
        }

        for (i = 0; i < infiniteCount + _.slideCount; i += 1) {
          slideIndex = i;
          $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex + _.slideCount).appendTo(_.$slideTrack).addClass('slick-cloned');
        }

        _.$slideTrack.find('.slick-cloned').find('[id]').each(function () {
          $(this).attr('id', '');
        });
      }
    }
  };

  Slick.prototype.interrupt = function (toggle) {
    var _ = this;

    if (!toggle) {
      _.autoPlay();
    }

    _.interrupted = toggle;
  };

  Slick.prototype.selectHandler = function (event) {
    var _ = this;

    var targetElement = $(event.target).is('.slick-slide') ? $(event.target) : $(event.target).parents('.slick-slide');
    var index = parseInt(targetElement.attr('data-slick-index'));
    if (!index) index = 0;

    if (_.slideCount <= _.options.slidesToShow) {
      _.slideHandler(index, false, true);

      return;
    }

    _.slideHandler(index);
  };

  Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
    var targetSlide,
        animSlide,
        oldSlide,
        slideLeft,
        targetLeft = null,
        _ = this,
        navTarget;

    sync = sync || false;

    if (_.animating === true && _.options.waitForAnimate === true) {
      return;
    }

    if (_.options.fade === true && _.currentSlide === index) {
      return;
    }

    if (sync === false) {
      _.asNavFor(index);
    }

    targetSlide = index;
    targetLeft = _.getLeft(targetSlide);
    slideLeft = _.getLeft(_.currentSlide);
    _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

    if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide;

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide);
          });
        } else {
          _.postSlide(targetSlide);
        }
      }

      return;
    } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > _.slideCount - _.options.slidesToScroll)) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide;

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide);
          });
        } else {
          _.postSlide(targetSlide);
        }
      }

      return;
    }

    if (_.options.autoplay) {
      clearInterval(_.autoPlayTimer);
    }

    if (targetSlide < 0) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = _.slideCount - _.slideCount % _.options.slidesToScroll;
      } else {
        animSlide = _.slideCount + targetSlide;
      }
    } else if (targetSlide >= _.slideCount) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = 0;
      } else {
        animSlide = targetSlide - _.slideCount;
      }
    } else {
      animSlide = targetSlide;
    }

    _.animating = true;

    _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

    oldSlide = _.currentSlide;
    _.currentSlide = animSlide;

    _.setSlideClasses(_.currentSlide);

    if (_.options.asNavFor) {
      navTarget = _.getNavTarget();
      navTarget = navTarget.slick('getSlick');

      if (navTarget.slideCount <= navTarget.options.slidesToShow) {
        navTarget.setSlideClasses(_.currentSlide);
      }
    }

    _.updateDots();

    _.updateArrows();

    if (_.options.fade === true) {
      if (dontAnimate !== true) {
        _.fadeSlideOut(oldSlide);

        _.fadeSlide(animSlide, function () {
          _.postSlide(animSlide);
        });
      } else {
        _.postSlide(animSlide);
      }

      _.animateHeight();

      return;
    }

    if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
      _.animateSlide(targetLeft, function () {
        _.postSlide(animSlide);
      });
    } else {
      _.postSlide(animSlide);
    }
  };

  Slick.prototype.startLoad = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.hide();

      _.$nextArrow.hide();
    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.hide();
    }

    _.$slider.addClass('slick-loading');
  };

  Slick.prototype.swipeDirection = function () {
    var xDist,
        yDist,
        r,
        swipeAngle,
        _ = this;

    xDist = _.touchObject.startX - _.touchObject.curX;
    yDist = _.touchObject.startY - _.touchObject.curY;
    r = Math.atan2(yDist, xDist);
    swipeAngle = Math.round(r * 180 / Math.PI);

    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }

    if (swipeAngle <= 45 && swipeAngle >= 0) {
      return _.options.rtl === false ? 'left' : 'right';
    }

    if (swipeAngle <= 360 && swipeAngle >= 315) {
      return _.options.rtl === false ? 'left' : 'right';
    }

    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return _.options.rtl === false ? 'right' : 'left';
    }

    if (_.options.verticalSwiping === true) {
      if (swipeAngle >= 35 && swipeAngle <= 135) {
        return 'down';
      } else {
        return 'up';
      }
    }

    return 'vertical';
  };

  Slick.prototype.swipeEnd = function (event) {
    var _ = this,
        slideCount,
        direction;

    _.dragging = false;
    _.swiping = false;

    if (_.scrolling) {
      _.scrolling = false;
      return false;
    }

    _.interrupted = false;
    _.shouldClick = _.touchObject.swipeLength > 10 ? false : true;

    if (_.touchObject.curX === undefined) {
      return false;
    }

    if (_.touchObject.edgeHit === true) {
      _.$slider.trigger('edge', [_, _.swipeDirection()]);
    }

    if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
      direction = _.swipeDirection();

      switch (direction) {
        case 'left':
        case 'down':
          slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount();
          _.currentDirection = 0;
          break;

        case 'right':
        case 'up':
          slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount();
          _.currentDirection = 1;
          break;

        default:
      }

      if (direction != 'vertical') {
        _.slideHandler(slideCount);

        _.touchObject = {};

        _.$slider.trigger('swipe', [_, direction]);
      }
    } else {
      if (_.touchObject.startX !== _.touchObject.curX) {
        _.slideHandler(_.currentSlide);

        _.touchObject = {};
      }
    }
  };

  Slick.prototype.swipeHandler = function (event) {
    var _ = this;

    if (_.options.swipe === false || 'ontouchend' in document && _.options.swipe === false) {
      return;
    } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
      return;
    }

    _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ? event.originalEvent.touches.length : 1;
    _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;

    if (_.options.verticalSwiping === true) {
      _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
    }

    switch (event.data.action) {
      case 'start':
        _.swipeStart(event);

        break;

      case 'move':
        _.swipeMove(event);

        break;

      case 'end':
        _.swipeEnd(event);

        break;
    }
  };

  Slick.prototype.swipeMove = function (event) {
    var _ = this,
        edgeWasHit = false,
        curLeft,
        swipeDirection,
        swipeLength,
        positionOffset,
        touches,
        verticalSwipeLength;

    touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

    if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
      return false;
    }

    curLeft = _.getLeft(_.currentSlide);
    _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
    _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;
    _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));
    verticalSwipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

    if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
      _.scrolling = true;
      return false;
    }

    if (_.options.verticalSwiping === true) {
      _.touchObject.swipeLength = verticalSwipeLength;
    }

    swipeDirection = _.swipeDirection();

    if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
      _.swiping = true;
      event.preventDefault();
    }

    positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);

    if (_.options.verticalSwiping === true) {
      positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
    }

    swipeLength = _.touchObject.swipeLength;
    _.touchObject.edgeHit = false;

    if (_.options.infinite === false) {
      if (_.currentSlide === 0 && swipeDirection === 'right' || _.currentSlide >= _.getDotCount() && swipeDirection === 'left') {
        swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
        _.touchObject.edgeHit = true;
      }
    }

    if (_.options.vertical === false) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    } else {
      _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
    }

    if (_.options.verticalSwiping === true) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    }

    if (_.options.fade === true || _.options.touchMove === false) {
      return false;
    }

    if (_.animating === true) {
      _.swipeLeft = null;
      return false;
    }

    _.setCSS(_.swipeLeft);
  };

  Slick.prototype.swipeStart = function (event) {
    var _ = this,
        touches;

    _.interrupted = true;

    if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
      _.touchObject = {};
      return false;
    }

    if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
      touches = event.originalEvent.touches[0];
    }

    _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
    _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
    _.dragging = true;
  };

  Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {
    var _ = this;

    if (_.$slidesCache !== null) {
      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.appendTo(_.$slideTrack);

      _.reinit();
    }
  };

  Slick.prototype.unload = function () {
    var _ = this;

    $('.slick-cloned', _.$slider).remove();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
      _.$prevArrow.remove();
    }

    if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
      _.$nextArrow.remove();
    }

    _.$slides.removeClass('slick-slide slick-active slick-visible slick-current').attr('aria-hidden', 'true').css('width', '');
  };

  Slick.prototype.unslick = function (fromBreakpoint) {
    var _ = this;

    _.$slider.trigger('unslick', [_, fromBreakpoint]);

    _.destroy();
  };

  Slick.prototype.updateArrows = function () {
    var _ = this,
        centerOffset;

    centerOffset = Math.floor(_.options.slidesToShow / 2);

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow && !_.options.infinite) {
      _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      if (_.currentSlide === 0) {
        _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

        _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {
        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {
        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      }
    }
  };

  Slick.prototype.updateDots = function () {
    var _ = this;

    if (_.$dots !== null) {
      _.$dots.find('li').removeClass('slick-active').end();

      _.$dots.find('li').eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass('slick-active');
    }
  };

  Slick.prototype.visibility = function () {
    var _ = this;

    if (_.options.autoplay) {
      if (document[_.hidden]) {
        _.interrupted = true;
      } else {
        _.interrupted = false;
      }
    }
  };

  $.fn.slick = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (typeof opt == 'object' || typeof opt == 'undefined') _[i].slick = new Slick(_[i], opt);else ret = _[i].slick[opt].apply(_[i].slick, args);
      if (typeof ret != 'undefined') return ret;
    }

    return _;
  };
});
/**
* jquery-match-height master by @liabru
* http://brm.io/jquery-match-height/
* License: MIT
*/
;

(function (factory) {
  // eslint-disable-line no-extra-semi
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Global
    factory(jQuery);
  }
})(function ($) {
  /*
  *  internal
  */
  var _previousResizeWidth = -1,
      _updateTimeout = -1;
  /*
  *  _parse
  *  value parse utility function
  */


  var _parse = function (value) {
    // parse value and convert NaN to 0
    return parseFloat(value) || 0;
  };
  /*
  *  _rows
  *  utility function returns array of jQuery selections representing each row
  *  (as displayed after float wrapping applied by browser)
  */


  var _rows = function (elements) {
    var tolerance = 1,
        $elements = $(elements),
        lastTop = null,
        rows = []; // group elements by their top position

    $elements.each(function () {
      var $that = $(this),
          top = $that.offset().top - _parse($that.css('margin-top')),
          lastRow = rows.length > 0 ? rows[rows.length - 1] : null;

      if (lastRow === null) {
        // first item on the row, so just push it
        rows.push($that);
      } else {
        // if the row top is the same, add to the row group
        if (Math.floor(Math.abs(lastTop - top)) <= tolerance) {
          rows[rows.length - 1] = lastRow.add($that);
        } else {
          // otherwise start a new row group
          rows.push($that);
        }
      } // keep track of the last row top


      lastTop = top;
    });
    return rows;
  };
  /*
  *  _parseOptions
  *  handle plugin options
  */


  var _parseOptions = function (options) {
    var opts = {
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    };

    if (typeof options === 'object') {
      return $.extend(opts, options);
    }

    if (typeof options === 'boolean') {
      opts.byRow = options;
    } else if (options === 'remove') {
      opts.remove = true;
    }

    return opts;
  };
  /*
  *  matchHeight
  *  plugin definition
  */


  var matchHeight = $.fn.matchHeight = function (options) {
    var opts = _parseOptions(options); // handle remove


    if (opts.remove) {
      var that = this; // remove fixed height from all selected elements

      this.css(opts.property, ''); // remove selected elements from all groups

      $.each(matchHeight._groups, function (key, group) {
        group.elements = group.elements.not(that);
      }); // TODO: cleanup empty groups

      return this;
    }

    if (this.length <= 1 && !opts.target) {
      return this;
    } // keep track of this group so we can re-apply later on load and resize events


    matchHeight._groups.push({
      elements: this,
      options: opts
    }); // match each element's height to the tallest element in the selection


    matchHeight._apply(this, opts);

    return this;
  };
  /*
  *  plugin global options
  */


  matchHeight.version = 'master';
  matchHeight._groups = [];
  matchHeight._throttle = 80;
  matchHeight._maintainScroll = false;
  matchHeight._beforeUpdate = null;
  matchHeight._afterUpdate = null;
  matchHeight._rows = _rows;
  matchHeight._parse = _parse;
  matchHeight._parseOptions = _parseOptions;
  /*
  *  matchHeight._apply
  *  apply matchHeight to given elements
  */

  matchHeight._apply = function (elements, options) {
    var opts = _parseOptions(options),
        $elements = $(elements),
        rows = [$elements]; // take note of scroll position


    var scrollTop = $(window).scrollTop(),
        htmlHeight = $('html').outerHeight(true); // get hidden parents

    var $hiddenParents = $elements.parents().filter(':hidden'); // cache the original inline style

    $hiddenParents.each(function () {
      var $that = $(this);
      $that.data('style-cache', $that.attr('style'));
    }); // temporarily must force hidden parents visible

    $hiddenParents.css('display', 'block'); // get rows if using byRow, otherwise assume one row

    if (opts.byRow && !opts.target) {
      // must first force an arbitrary equal height so floating elements break evenly
      $elements.each(function () {
        var $that = $(this),
            display = $that.css('display'); // temporarily force a usable display value

        if (display !== 'inline-block' && display !== 'flex' && display !== 'inline-flex') {
          display = 'block';
        } // cache the original inline style


        $that.data('style-cache', $that.attr('style'));
        $that.css({
          'display': display,
          'padding-top': '0',
          'padding-bottom': '0',
          'margin-top': '0',
          'margin-bottom': '0',
          'border-top-width': '0',
          'border-bottom-width': '0',
          'height': '100px',
          'overflow': 'hidden'
        });
      }); // get the array of rows (based on element top position)

      rows = _rows($elements); // revert original inline styles

      $elements.each(function () {
        var $that = $(this);
        $that.attr('style', $that.data('style-cache') || '');
      });
    }

    $.each(rows, function (key, row) {
      var $row = $(row),
          targetHeight = 0;

      if (!opts.target) {
        // skip apply to rows with only one item
        if (opts.byRow && $row.length <= 1) {
          $row.css(opts.property, '');
          return;
        } // iterate the row and find the max height


        $row.each(function () {
          var $that = $(this),
              style = $that.attr('style'),
              display = $that.css('display'); // temporarily force a usable display value

          if (display !== 'inline-block' && display !== 'flex' && display !== 'inline-flex') {
            display = 'block';
          } // ensure we get the correct actual height (and not a previously set height value)


          var css = {
            'display': display
          };
          css[opts.property] = '';
          $that.css(css); // find the max height (including padding, but not margin)

          if ($that.outerHeight(false) > targetHeight) {
            targetHeight = $that.outerHeight(false);
          } // revert styles


          if (style) {
            $that.attr('style', style);
          } else {
            $that.css('display', '');
          }
        });
      } else {
        // if target set, use the height of the target element
        targetHeight = opts.target.outerHeight(false);
      } // iterate the row and apply the height to all elements


      $row.each(function () {
        var $that = $(this),
            verticalPadding = 0; // don't apply to a target

        if (opts.target && $that.is(opts.target)) {
          return;
        } // handle padding and border correctly (required when not using border-box)


        if ($that.css('box-sizing') !== 'border-box') {
          verticalPadding += _parse($that.css('border-top-width')) + _parse($that.css('border-bottom-width'));
          verticalPadding += _parse($that.css('padding-top')) + _parse($that.css('padding-bottom'));
        } // set the height (accounting for padding and border)


        $that.css(opts.property, targetHeight - verticalPadding + 'px');
      });
    }); // revert hidden parents

    $hiddenParents.each(function () {
      var $that = $(this);
      $that.attr('style', $that.data('style-cache') || null);
    }); // restore scroll position if enabled

    if (matchHeight._maintainScroll) {
      $(window).scrollTop(scrollTop / htmlHeight * $('html').outerHeight(true));
    }

    return this;
  };
  /*
  *  matchHeight._applyDataApi
  *  applies matchHeight to all elements with a data-match-height attribute
  */


  matchHeight._applyDataApi = function () {
    var groups = {}; // generate groups by their groupId set by elements using data-match-height

    $('[data-match-height], [data-mh]').each(function () {
      var $this = $(this),
          groupId = $this.attr('data-mh') || $this.attr('data-match-height');

      if (groupId in groups) {
        groups[groupId] = groups[groupId].add($this);
      } else {
        groups[groupId] = $this;
      }
    }); // apply matchHeight to each group

    $.each(groups, function () {
      this.matchHeight(true);
    });
  };
  /*
  *  matchHeight._update
  *  updates matchHeight on all current groups with their correct options
  */


  var _update = function (event) {
    if (matchHeight._beforeUpdate) {
      matchHeight._beforeUpdate(event, matchHeight._groups);
    }

    $.each(matchHeight._groups, function () {
      matchHeight._apply(this.elements, this.options);
    });

    if (matchHeight._afterUpdate) {
      matchHeight._afterUpdate(event, matchHeight._groups);
    }
  };

  matchHeight._update = function (throttle, event) {
    // prevent update if fired from a resize event
    // where the viewport width hasn't actually changed
    // fixes an event looping bug in IE8
    if (event && event.type === 'resize') {
      var windowWidth = $(window).width();

      if (windowWidth === _previousResizeWidth) {
        return;
      }

      _previousResizeWidth = windowWidth;
    } // throttle updates


    if (!throttle) {
      _update(event);
    } else if (_updateTimeout === -1) {
      _updateTimeout = setTimeout(function () {
        _update(event);

        _updateTimeout = -1;
      }, matchHeight._throttle);
    }
  };
  /*
  *  bind events
  */
  // apply on DOM ready event


  $(matchHeight._applyDataApi); // use on or bind where supported

  var on = $.fn.on ? 'on' : 'bind'; // update heights on load and resize events

  $(window)[on]('load', function (event) {
    matchHeight._update(false, event);
  }); // throttled update heights on resize events

  $(window)[on]('resize orientationchange', function (event) {
    matchHeight._update(true, event);
  });
});
/*! jQuery UI - v1.12.1 - 2021-05-25
* http://jqueryui.com
* Includes: widget.js, position.js, data.js, disable-selection.js, focusable.js, form-reset-mixin.js, jquery-1-7.js, keycode.js, labels.js, scroll-parent.js, tabbable.js, unique-id.js, widgets/resizable.js, widgets/selectable.js, widgets/sortable.js, widgets/accordion.js, widgets/mouse.js, effect.js, effects/effect-blind.js, effects/effect-bounce.js, effects/effect-clip.js, effects/effect-drop.js, effects/effect-explode.js, effects/effect-fade.js, effects/effect-fold.js, effects/effect-highlight.js, effects/effect-puff.js, effects/effect-pulsate.js, effects/effect-scale.js, effects/effect-shake.js, effects/effect-size.js, effects/effect-slide.js, effects/effect-transfer.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["jquery"], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  $.ui = $.ui || {};
  var version = $.ui.version = "1.12.1";
  /*!
   * jQuery UI Widget 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Widget
  //>>group: Core
  //>>description: Provides a factory for creating stateful widgets with a common API.
  //>>docs: http://api.jqueryui.com/jQuery.widget/
  //>>demos: http://jqueryui.com/widget/

  var widgetUuid = 0;
  var widgetSlice = Array.prototype.slice;

  $.cleanData = function (orig) {
    return function (elems) {
      var events, elem, i;

      for (i = 0; (elem = elems[i]) != null; i++) {
        try {
          // Only trigger remove when necessary to save time
          events = $._data(elem, "events");

          if (events && events.remove) {
            $(elem).triggerHandler("remove");
          } // Http://bugs.jquery.com/ticket/8235

        } catch (e) {}
      }

      orig(elems);
    };
  }($.cleanData);

  $.widget = function (name, base, prototype) {
    var existingConstructor, constructor, basePrototype; // ProxiedPrototype allows the provided prototype to remain unmodified
    // so that it can be used as a mixin for multiple widgets (#8876)

    var proxiedPrototype = {};
    var namespace = name.split(".")[0];
    name = name.split(".")[1];
    var fullName = namespace + "-" + name;

    if (!prototype) {
      prototype = base;
      base = $.Widget;
    }

    if ($.isArray(prototype)) {
      prototype = $.extend.apply(null, [{}].concat(prototype));
    } // Create selector for plugin


    $.expr[":"][fullName.toLowerCase()] = function (elem) {
      return !!$.data(elem, fullName);
    };

    $[namespace] = $[namespace] || {};
    existingConstructor = $[namespace][name];

    constructor = $[namespace][name] = function (options, element) {
      // Allow instantiation without "new" keyword
      if (!this._createWidget) {
        return new constructor(options, element);
      } // Allow instantiation without initializing for simple inheritance
      // must use "new" keyword (the code above always passes args)


      if (arguments.length) {
        this._createWidget(options, element);
      }
    }; // Extend with the existing constructor to carry over any static properties


    $.extend(constructor, existingConstructor, {
      version: prototype.version,
      // Copy the object used to create the prototype in case we need to
      // redefine the widget later
      _proto: $.extend({}, prototype),
      // Track widgets that inherit from this widget in case this widget is
      // redefined after a widget inherits from it
      _childConstructors: []
    });
    basePrototype = new base(); // We need to make the options hash a property directly on the new instance
    // otherwise we'll modify the options hash on the prototype that we're
    // inheriting from

    basePrototype.options = $.widget.extend({}, basePrototype.options);
    $.each(prototype, function (prop, value) {
      if (!$.isFunction(value)) {
        proxiedPrototype[prop] = value;
        return;
      }

      proxiedPrototype[prop] = function () {
        function _super() {
          return base.prototype[prop].apply(this, arguments);
        }

        function _superApply(args) {
          return base.prototype[prop].apply(this, args);
        }

        return function () {
          var __super = this._super;
          var __superApply = this._superApply;
          var returnValue;
          this._super = _super;
          this._superApply = _superApply;
          returnValue = value.apply(this, arguments);
          this._super = __super;
          this._superApply = __superApply;
          return returnValue;
        };
      }();
    });
    constructor.prototype = $.widget.extend(basePrototype, {
      // TODO: remove support for widgetEventPrefix
      // always use the name + a colon as the prefix, e.g., draggable:start
      // don't prefix for widgets that aren't DOM-based
      widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix || name : name
    }, proxiedPrototype, {
      constructor: constructor,
      namespace: namespace,
      widgetName: name,
      widgetFullName: fullName
    }); // If this widget is being redefined then we need to find all widgets that
    // are inheriting from it and redefine all of them so that they inherit from
    // the new version of this widget. We're essentially trying to replace one
    // level in the prototype chain.

    if (existingConstructor) {
      $.each(existingConstructor._childConstructors, function (i, child) {
        var childPrototype = child.prototype; // Redefine the child widget using the same prototype that was
        // originally used, but inherit from the new version of the base

        $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
      }); // Remove the list of existing child constructors from the old constructor
      // so the old child constructors can be garbage collected

      delete existingConstructor._childConstructors;
    } else {
      base._childConstructors.push(constructor);
    }

    $.widget.bridge(name, constructor);
    return constructor;
  };

  $.widget.extend = function (target) {
    var input = widgetSlice.call(arguments, 1);
    var inputIndex = 0;
    var inputLength = input.length;
    var key;
    var value;

    for (; inputIndex < inputLength; inputIndex++) {
      for (key in input[inputIndex]) {
        value = input[inputIndex][key];

        if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
          // Clone objects
          if ($.isPlainObject(value)) {
            target[key] = $.isPlainObject(target[key]) ? $.widget.extend({}, target[key], value) : // Don't extend strings, arrays, etc. with objects
            $.widget.extend({}, value); // Copy everything else by reference
          } else {
            target[key] = value;
          }
        }
      }
    }

    return target;
  };

  $.widget.bridge = function (name, object) {
    var fullName = object.prototype.widgetFullName || name;

    $.fn[name] = function (options) {
      var isMethodCall = typeof options === "string";
      var args = widgetSlice.call(arguments, 1);
      var returnValue = this;

      if (isMethodCall) {
        // If this is an empty collection, we need to have the instance method
        // return undefined instead of the jQuery instance
        if (!this.length && options === "instance") {
          returnValue = undefined;
        } else {
          this.each(function () {
            var methodValue;
            var instance = $.data(this, fullName);

            if (options === "instance") {
              returnValue = instance;
              return false;
            }

            if (!instance) {
              return $.error("cannot call methods on " + name + " prior to initialization; " + "attempted to call method '" + options + "'");
            }

            if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
              return $.error("no such method '" + options + "' for " + name + " widget instance");
            }

            methodValue = instance[options].apply(instance, args);

            if (methodValue !== instance && methodValue !== undefined) {
              returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue;
              return false;
            }
          });
        }
      } else {
        // Allow multiple hashes to be passed on init
        if (args.length) {
          options = $.widget.extend.apply(null, [options].concat(args));
        }

        this.each(function () {
          var instance = $.data(this, fullName);

          if (instance) {
            instance.option(options || {});

            if (instance._init) {
              instance._init();
            }
          } else {
            $.data(this, fullName, new object(options, this));
          }
        });
      }

      return returnValue;
    };
  };

  $.Widget = function ()
  /* options, element */
  {};

  $.Widget._childConstructors = [];
  $.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: {
      classes: {},
      disabled: false,
      // Callbacks
      create: null
    },
    _createWidget: function (options, element) {
      element = $(element || this.defaultElement || this)[0];
      this.element = $(element);
      this.uuid = widgetUuid++;
      this.eventNamespace = "." + this.widgetName + this.uuid;
      this.bindings = $();
      this.hoverable = $();
      this.focusable = $();
      this.classesElementLookup = {};

      if (element !== this) {
        $.data(element, this.widgetFullName, this);

        this._on(true, this.element, {
          remove: function (event) {
            if (event.target === element) {
              this.destroy();
            }
          }
        });

        this.document = $(element.style ? // Element within the document
        element.ownerDocument : // Element is window or document
        element.document || element);
        this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
      }

      this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options);

      this._create();

      if (this.options.disabled) {
        this._setOptionDisabled(this.options.disabled);
      }

      this._trigger("create", null, this._getCreateEventData());

      this._init();
    },
    _getCreateOptions: function () {
      return {};
    },
    _getCreateEventData: $.noop,
    _create: $.noop,
    _init: $.noop,
    destroy: function () {
      var that = this;

      this._destroy();

      $.each(this.classesElementLookup, function (key, value) {
        that._removeClass(value, key);
      }); // We can probably remove the unbind calls in 2.0
      // all event bindings should go through this._on()

      this.element.off(this.eventNamespace).removeData(this.widgetFullName);
      this.widget().off(this.eventNamespace).removeAttr("aria-disabled"); // Clean up events and states

      this.bindings.off(this.eventNamespace);
    },
    _destroy: $.noop,
    widget: function () {
      return this.element;
    },
    option: function (key, value) {
      var options = key;
      var parts;
      var curOption;
      var i;

      if (arguments.length === 0) {
        // Don't return a reference to the internal hash
        return $.widget.extend({}, this.options);
      }

      if (typeof key === "string") {
        // Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
        options = {};
        parts = key.split(".");
        key = parts.shift();

        if (parts.length) {
          curOption = options[key] = $.widget.extend({}, this.options[key]);

          for (i = 0; i < parts.length - 1; i++) {
            curOption[parts[i]] = curOption[parts[i]] || {};
            curOption = curOption[parts[i]];
          }

          key = parts.pop();

          if (arguments.length === 1) {
            return curOption[key] === undefined ? null : curOption[key];
          }

          curOption[key] = value;
        } else {
          if (arguments.length === 1) {
            return this.options[key] === undefined ? null : this.options[key];
          }

          options[key] = value;
        }
      }

      this._setOptions(options);

      return this;
    },
    _setOptions: function (options) {
      var key;

      for (key in options) {
        this._setOption(key, options[key]);
      }

      return this;
    },
    _setOption: function (key, value) {
      if (key === "classes") {
        this._setOptionClasses(value);
      }

      this.options[key] = value;

      if (key === "disabled") {
        this._setOptionDisabled(value);
      }

      return this;
    },
    _setOptionClasses: function (value) {
      var classKey, elements, currentElements;

      for (classKey in value) {
        currentElements = this.classesElementLookup[classKey];

        if (value[classKey] === this.options.classes[classKey] || !currentElements || !currentElements.length) {
          continue;
        } // We are doing this to create a new jQuery object because the _removeClass() call
        // on the next line is going to destroy the reference to the current elements being
        // tracked. We need to save a copy of this collection so that we can add the new classes
        // below.


        elements = $(currentElements.get());

        this._removeClass(currentElements, classKey); // We don't use _addClass() here, because that uses this.options.classes
        // for generating the string of classes. We want to use the value passed in from
        // _setOption(), this is the new value of the classes option which was passed to
        // _setOption(). We pass this value directly to _classes().


        elements.addClass(this._classes({
          element: elements,
          keys: classKey,
          classes: value,
          add: true
        }));
      }
    },
    _setOptionDisabled: function (value) {
      this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!value); // If the widget is becoming disabled, then nothing is interactive


      if (value) {
        this._removeClass(this.hoverable, null, "ui-state-hover");

        this._removeClass(this.focusable, null, "ui-state-focus");
      }
    },
    enable: function () {
      return this._setOptions({
        disabled: false
      });
    },
    disable: function () {
      return this._setOptions({
        disabled: true
      });
    },
    _classes: function (options) {
      var full = [];
      var that = this;
      options = $.extend({
        element: this.element,
        classes: this.options.classes || {}
      }, options);

      function processClassString(classes, checkOption) {
        var current, i;

        for (i = 0; i < classes.length; i++) {
          current = that.classesElementLookup[classes[i]] || $();

          if (options.add) {
            current = $($.unique(current.get().concat(options.element.get())));
          } else {
            current = $(current.not(options.element).get());
          }

          that.classesElementLookup[classes[i]] = current;
          full.push(classes[i]);

          if (checkOption && options.classes[classes[i]]) {
            full.push(options.classes[classes[i]]);
          }
        }
      }

      this._on(options.element, {
        "remove": "_untrackClassesElement"
      });

      if (options.keys) {
        processClassString(options.keys.match(/\S+/g) || [], true);
      }

      if (options.extra) {
        processClassString(options.extra.match(/\S+/g) || []);
      }

      return full.join(" ");
    },
    _untrackClassesElement: function (event) {
      var that = this;
      $.each(that.classesElementLookup, function (key, value) {
        if ($.inArray(event.target, value) !== -1) {
          that.classesElementLookup[key] = $(value.not(event.target).get());
        }
      });
    },
    _removeClass: function (element, keys, extra) {
      return this._toggleClass(element, keys, extra, false);
    },
    _addClass: function (element, keys, extra) {
      return this._toggleClass(element, keys, extra, true);
    },
    _toggleClass: function (element, keys, extra, add) {
      add = typeof add === "boolean" ? add : extra;
      var shift = typeof element === "string" || element === null,
          options = {
        extra: shift ? keys : extra,
        keys: shift ? element : keys,
        element: shift ? this.element : element,
        add: add
      };
      options.element.toggleClass(this._classes(options), add);
      return this;
    },
    _on: function (suppressDisabledCheck, element, handlers) {
      var delegateElement;
      var instance = this; // No suppressDisabledCheck flag, shuffle arguments

      if (typeof suppressDisabledCheck !== "boolean") {
        handlers = element;
        element = suppressDisabledCheck;
        suppressDisabledCheck = false;
      } // No element argument, shuffle and use this.element


      if (!handlers) {
        handlers = element;
        element = this.element;
        delegateElement = this.widget();
      } else {
        element = delegateElement = $(element);
        this.bindings = this.bindings.add(element);
      }

      $.each(handlers, function (event, handler) {
        function handlerProxy() {
          // Allow widgets to customize the disabled handling
          // - disabled as an array instead of boolean
          // - disabled class as method for disabling individual parts
          if (!suppressDisabledCheck && (instance.options.disabled === true || $(this).hasClass("ui-state-disabled"))) {
            return;
          }

          return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
        } // Copy the guid so direct unbinding works


        if (typeof handler !== "string") {
          handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || $.guid++;
        }

        var match = event.match(/^([\w:-]*)\s*(.*)$/);
        var eventName = match[1] + instance.eventNamespace;
        var selector = match[2];

        if (selector) {
          delegateElement.on(eventName, selector, handlerProxy);
        } else {
          element.on(eventName, handlerProxy);
        }
      });
    },
    _off: function (element, eventName) {
      eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
      element.off(eventName).off(eventName); // Clear the stack to avoid memory leaks (#10056)

      this.bindings = $(this.bindings.not(element).get());
      this.focusable = $(this.focusable.not(element).get());
      this.hoverable = $(this.hoverable.not(element).get());
    },
    _delay: function (handler, delay) {
      function handlerProxy() {
        return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
      }

      var instance = this;
      return setTimeout(handlerProxy, delay || 0);
    },
    _hoverable: function (element) {
      this.hoverable = this.hoverable.add(element);

      this._on(element, {
        mouseenter: function (event) {
          this._addClass($(event.currentTarget), null, "ui-state-hover");
        },
        mouseleave: function (event) {
          this._removeClass($(event.currentTarget), null, "ui-state-hover");
        }
      });
    },
    _focusable: function (element) {
      this.focusable = this.focusable.add(element);

      this._on(element, {
        focusin: function (event) {
          this._addClass($(event.currentTarget), null, "ui-state-focus");
        },
        focusout: function (event) {
          this._removeClass($(event.currentTarget), null, "ui-state-focus");
        }
      });
    },
    _trigger: function (type, event, data) {
      var prop, orig;
      var callback = this.options[type];
      data = data || {};
      event = $.Event(event);
      event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase(); // The original event may come from any element
      // so we need to reset the target on the new event

      event.target = this.element[0]; // Copy original event properties over to the new event

      orig = event.originalEvent;

      if (orig) {
        for (prop in orig) {
          if (!(prop in event)) {
            event[prop] = orig[prop];
          }
        }
      }

      this.element.trigger(event, data);
      return !($.isFunction(callback) && callback.apply(this.element[0], [event].concat(data)) === false || event.isDefaultPrevented());
    }
  };
  $.each({
    show: "fadeIn",
    hide: "fadeOut"
  }, function (method, defaultEffect) {
    $.Widget.prototype["_" + method] = function (element, options, callback) {
      if (typeof options === "string") {
        options = {
          effect: options
        };
      }

      var hasOptions;
      var effectName = !options ? method : options === true || typeof options === "number" ? defaultEffect : options.effect || defaultEffect;
      options = options || {};

      if (typeof options === "number") {
        options = {
          duration: options
        };
      }

      hasOptions = !$.isEmptyObject(options);
      options.complete = callback;

      if (options.delay) {
        element.delay(options.delay);
      }

      if (hasOptions && $.effects && $.effects.effect[effectName]) {
        element[method](options);
      } else if (effectName !== method && element[effectName]) {
        element[effectName](options.duration, options.easing, callback);
      } else {
        element.queue(function (next) {
          $(this)[method]();

          if (callback) {
            callback.call(element[0]);
          }

          next();
        });
      }
    };
  });
  var widget = $.widget;
  /*!
   * jQuery UI Position 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   *
   * http://api.jqueryui.com/position/
   */
  //>>label: Position
  //>>group: Core
  //>>description: Positions elements relative to other elements.
  //>>docs: http://api.jqueryui.com/position/
  //>>demos: http://jqueryui.com/position/

  (function () {
    var cachedScrollbarWidth,
        max = Math.max,
        abs = Math.abs,
        rhorizontal = /left|center|right/,
        rvertical = /top|center|bottom/,
        roffset = /[\+\-]\d+(\.[\d]+)?%?/,
        rposition = /^\w+/,
        rpercent = /%$/,
        _position = $.fn.position;

    function getOffsets(offsets, width, height) {
      return [parseFloat(offsets[0]) * (rpercent.test(offsets[0]) ? width / 100 : 1), parseFloat(offsets[1]) * (rpercent.test(offsets[1]) ? height / 100 : 1)];
    }

    function parseCss(element, property) {
      return parseInt($.css(element, property), 10) || 0;
    }

    function getDimensions(elem) {
      var raw = elem[0];

      if (raw.nodeType === 9) {
        return {
          width: elem.width(),
          height: elem.height(),
          offset: {
            top: 0,
            left: 0
          }
        };
      }

      if ($.isWindow(raw)) {
        return {
          width: elem.width(),
          height: elem.height(),
          offset: {
            top: elem.scrollTop(),
            left: elem.scrollLeft()
          }
        };
      }

      if (raw.preventDefault) {
        return {
          width: 0,
          height: 0,
          offset: {
            top: raw.pageY,
            left: raw.pageX
          }
        };
      }

      return {
        width: elem.outerWidth(),
        height: elem.outerHeight(),
        offset: elem.offset()
      };
    }

    $.position = {
      scrollbarWidth: function () {
        if (cachedScrollbarWidth !== undefined) {
          return cachedScrollbarWidth;
        }

        var w1,
            w2,
            div = $("<div " + "style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'>" + "<div style='height:100px;width:auto;'></div></div>"),
            innerDiv = div.children()[0];
        $("body").append(div);
        w1 = innerDiv.offsetWidth;
        div.css("overflow", "scroll");
        w2 = innerDiv.offsetWidth;

        if (w1 === w2) {
          w2 = div[0].clientWidth;
        }

        div.remove();
        return cachedScrollbarWidth = w1 - w2;
      },
      getScrollInfo: function (within) {
        var overflowX = within.isWindow || within.isDocument ? "" : within.element.css("overflow-x"),
            overflowY = within.isWindow || within.isDocument ? "" : within.element.css("overflow-y"),
            hasOverflowX = overflowX === "scroll" || overflowX === "auto" && within.width < within.element[0].scrollWidth,
            hasOverflowY = overflowY === "scroll" || overflowY === "auto" && within.height < within.element[0].scrollHeight;
        return {
          width: hasOverflowY ? $.position.scrollbarWidth() : 0,
          height: hasOverflowX ? $.position.scrollbarWidth() : 0
        };
      },
      getWithinInfo: function (element) {
        var withinElement = $(element || window),
            isWindow = $.isWindow(withinElement[0]),
            isDocument = !!withinElement[0] && withinElement[0].nodeType === 9,
            hasOffset = !isWindow && !isDocument;
        return {
          element: withinElement,
          isWindow: isWindow,
          isDocument: isDocument,
          offset: hasOffset ? $(element).offset() : {
            left: 0,
            top: 0
          },
          scrollLeft: withinElement.scrollLeft(),
          scrollTop: withinElement.scrollTop(),
          width: withinElement.outerWidth(),
          height: withinElement.outerHeight()
        };
      }
    };

    $.fn.position = function (options) {
      if (!options || !options.of) {
        return _position.apply(this, arguments);
      } // Make a copy, we don't want to modify arguments


      options = $.extend({}, options);
      var atOffset,
          targetWidth,
          targetHeight,
          targetOffset,
          basePosition,
          dimensions,
          target = $(options.of),
          within = $.position.getWithinInfo(options.within),
          scrollInfo = $.position.getScrollInfo(within),
          collision = (options.collision || "flip").split(" "),
          offsets = {};
      dimensions = getDimensions(target);

      if (target[0].preventDefault) {
        // Force left top to allow flipping
        options.at = "left top";
      }

      targetWidth = dimensions.width;
      targetHeight = dimensions.height;
      targetOffset = dimensions.offset; // Clone to reuse original targetOffset later

      basePosition = $.extend({}, targetOffset); // Force my and at to have valid horizontal and vertical positions
      // if a value is missing or invalid, it will be converted to center

      $.each(["my", "at"], function () {
        var pos = (options[this] || "").split(" "),
            horizontalOffset,
            verticalOffset;

        if (pos.length === 1) {
          pos = rhorizontal.test(pos[0]) ? pos.concat(["center"]) : rvertical.test(pos[0]) ? ["center"].concat(pos) : ["center", "center"];
        }

        pos[0] = rhorizontal.test(pos[0]) ? pos[0] : "center";
        pos[1] = rvertical.test(pos[1]) ? pos[1] : "center"; // Calculate offsets

        horizontalOffset = roffset.exec(pos[0]);
        verticalOffset = roffset.exec(pos[1]);
        offsets[this] = [horizontalOffset ? horizontalOffset[0] : 0, verticalOffset ? verticalOffset[0] : 0]; // Reduce to just the positions without the offsets

        options[this] = [rposition.exec(pos[0])[0], rposition.exec(pos[1])[0]];
      }); // Normalize collision option

      if (collision.length === 1) {
        collision[1] = collision[0];
      }

      if (options.at[0] === "right") {
        basePosition.left += targetWidth;
      } else if (options.at[0] === "center") {
        basePosition.left += targetWidth / 2;
      }

      if (options.at[1] === "bottom") {
        basePosition.top += targetHeight;
      } else if (options.at[1] === "center") {
        basePosition.top += targetHeight / 2;
      }

      atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
      basePosition.left += atOffset[0];
      basePosition.top += atOffset[1];
      return this.each(function () {
        var collisionPosition,
            using,
            elem = $(this),
            elemWidth = elem.outerWidth(),
            elemHeight = elem.outerHeight(),
            marginLeft = parseCss(this, "marginLeft"),
            marginTop = parseCss(this, "marginTop"),
            collisionWidth = elemWidth + marginLeft + parseCss(this, "marginRight") + scrollInfo.width,
            collisionHeight = elemHeight + marginTop + parseCss(this, "marginBottom") + scrollInfo.height,
            position = $.extend({}, basePosition),
            myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());

        if (options.my[0] === "right") {
          position.left -= elemWidth;
        } else if (options.my[0] === "center") {
          position.left -= elemWidth / 2;
        }

        if (options.my[1] === "bottom") {
          position.top -= elemHeight;
        } else if (options.my[1] === "center") {
          position.top -= elemHeight / 2;
        }

        position.left += myOffset[0];
        position.top += myOffset[1];
        collisionPosition = {
          marginLeft: marginLeft,
          marginTop: marginTop
        };
        $.each(["left", "top"], function (i, dir) {
          if ($.ui.position[collision[i]]) {
            $.ui.position[collision[i]][dir](position, {
              targetWidth: targetWidth,
              targetHeight: targetHeight,
              elemWidth: elemWidth,
              elemHeight: elemHeight,
              collisionPosition: collisionPosition,
              collisionWidth: collisionWidth,
              collisionHeight: collisionHeight,
              offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
              my: options.my,
              at: options.at,
              within: within,
              elem: elem
            });
          }
        });

        if (options.using) {
          // Adds feedback as second argument to using callback, if present
          using = function (props) {
            var left = targetOffset.left - position.left,
                right = left + targetWidth - elemWidth,
                top = targetOffset.top - position.top,
                bottom = top + targetHeight - elemHeight,
                feedback = {
              target: {
                element: target,
                left: targetOffset.left,
                top: targetOffset.top,
                width: targetWidth,
                height: targetHeight
              },
              element: {
                element: elem,
                left: position.left,
                top: position.top,
                width: elemWidth,
                height: elemHeight
              },
              horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
              vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
            };

            if (targetWidth < elemWidth && abs(left + right) < targetWidth) {
              feedback.horizontal = "center";
            }

            if (targetHeight < elemHeight && abs(top + bottom) < targetHeight) {
              feedback.vertical = "middle";
            }

            if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
              feedback.important = "horizontal";
            } else {
              feedback.important = "vertical";
            }

            options.using.call(this, props, feedback);
          };
        }

        elem.offset($.extend(position, {
          using: using
        }));
      });
    };

    $.ui.position = {
      fit: {
        left: function (position, data) {
          var within = data.within,
              withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
              outerWidth = within.width,
              collisionPosLeft = position.left - data.collisionPosition.marginLeft,
              overLeft = withinOffset - collisionPosLeft,
              overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
              newOverRight; // Element is wider than within

          if (data.collisionWidth > outerWidth) {
            // Element is initially over the left side of within
            if (overLeft > 0 && overRight <= 0) {
              newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
              position.left += overLeft - newOverRight; // Element is initially over right side of within
            } else if (overRight > 0 && overLeft <= 0) {
              position.left = withinOffset; // Element is initially over both left and right sides of within
            } else {
              if (overLeft > overRight) {
                position.left = withinOffset + outerWidth - data.collisionWidth;
              } else {
                position.left = withinOffset;
              }
            } // Too far left -> align with left edge

          } else if (overLeft > 0) {
            position.left += overLeft; // Too far right -> align with right edge
          } else if (overRight > 0) {
            position.left -= overRight; // Adjust based on position and margin
          } else {
            position.left = max(position.left - collisionPosLeft, position.left);
          }
        },
        top: function (position, data) {
          var within = data.within,
              withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
              outerHeight = data.within.height,
              collisionPosTop = position.top - data.collisionPosition.marginTop,
              overTop = withinOffset - collisionPosTop,
              overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
              newOverBottom; // Element is taller than within

          if (data.collisionHeight > outerHeight) {
            // Element is initially over the top of within
            if (overTop > 0 && overBottom <= 0) {
              newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
              position.top += overTop - newOverBottom; // Element is initially over bottom of within
            } else if (overBottom > 0 && overTop <= 0) {
              position.top = withinOffset; // Element is initially over both top and bottom of within
            } else {
              if (overTop > overBottom) {
                position.top = withinOffset + outerHeight - data.collisionHeight;
              } else {
                position.top = withinOffset;
              }
            } // Too far up -> align with top

          } else if (overTop > 0) {
            position.top += overTop; // Too far down -> align with bottom edge
          } else if (overBottom > 0) {
            position.top -= overBottom; // Adjust based on position and margin
          } else {
            position.top = max(position.top - collisionPosTop, position.top);
          }
        }
      },
      flip: {
        left: function (position, data) {
          var within = data.within,
              withinOffset = within.offset.left + within.scrollLeft,
              outerWidth = within.width,
              offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
              collisionPosLeft = position.left - data.collisionPosition.marginLeft,
              overLeft = collisionPosLeft - offsetLeft,
              overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
              myOffset = data.my[0] === "left" ? -data.elemWidth : data.my[0] === "right" ? data.elemWidth : 0,
              atOffset = data.at[0] === "left" ? data.targetWidth : data.at[0] === "right" ? -data.targetWidth : 0,
              offset = -2 * data.offset[0],
              newOverRight,
              newOverLeft;

          if (overLeft < 0) {
            newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;

            if (newOverRight < 0 || newOverRight < abs(overLeft)) {
              position.left += myOffset + atOffset + offset;
            }
          } else if (overRight > 0) {
            newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;

            if (newOverLeft > 0 || abs(newOverLeft) < overRight) {
              position.left += myOffset + atOffset + offset;
            }
          }
        },
        top: function (position, data) {
          var within = data.within,
              withinOffset = within.offset.top + within.scrollTop,
              outerHeight = within.height,
              offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
              collisionPosTop = position.top - data.collisionPosition.marginTop,
              overTop = collisionPosTop - offsetTop,
              overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
              top = data.my[1] === "top",
              myOffset = top ? -data.elemHeight : data.my[1] === "bottom" ? data.elemHeight : 0,
              atOffset = data.at[1] === "top" ? data.targetHeight : data.at[1] === "bottom" ? -data.targetHeight : 0,
              offset = -2 * data.offset[1],
              newOverTop,
              newOverBottom;

          if (overTop < 0) {
            newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;

            if (newOverBottom < 0 || newOverBottom < abs(overTop)) {
              position.top += myOffset + atOffset + offset;
            }
          } else if (overBottom > 0) {
            newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;

            if (newOverTop > 0 || abs(newOverTop) < overBottom) {
              position.top += myOffset + atOffset + offset;
            }
          }
        }
      },
      flipfit: {
        left: function () {
          $.ui.position.flip.left.apply(this, arguments);
          $.ui.position.fit.left.apply(this, arguments);
        },
        top: function () {
          $.ui.position.flip.top.apply(this, arguments);
          $.ui.position.fit.top.apply(this, arguments);
        }
      }
    };
  })();

  var position = $.ui.position;
  /*!
   * jQuery UI :data 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: :data Selector
  //>>group: Core
  //>>description: Selects elements which have data stored under the specified key.
  //>>docs: http://api.jqueryui.com/data-selector/

  var data = $.extend($.expr[":"], {
    data: $.expr.createPseudo ? $.expr.createPseudo(function (dataName) {
      return function (elem) {
        return !!$.data(elem, dataName);
      };
    }) : // Support: jQuery <1.8
    function (elem, i, match) {
      return !!$.data(elem, match[3]);
    }
  });
  /*!
   * jQuery UI Disable Selection 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: disableSelection
  //>>group: Core
  //>>description: Disable selection of text content within the set of matched elements.
  //>>docs: http://api.jqueryui.com/disableSelection/
  // This file is deprecated

  var disableSelection = $.fn.extend({
    disableSelection: function () {
      var eventType = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";
      return function () {
        return this.on(eventType + ".ui-disableSelection", function (event) {
          event.preventDefault();
        });
      };
    }(),
    enableSelection: function () {
      return this.off(".ui-disableSelection");
    }
  });
  /*!
   * jQuery UI Focusable 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: :focusable Selector
  //>>group: Core
  //>>description: Selects elements which can be focused.
  //>>docs: http://api.jqueryui.com/focusable-selector/
  // Selectors

  $.ui.focusable = function (element, hasTabindex) {
    var map,
        mapName,
        img,
        focusableIfVisible,
        fieldset,
        nodeName = element.nodeName.toLowerCase();

    if ("area" === nodeName) {
      map = element.parentNode;
      mapName = map.name;

      if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
        return false;
      }

      img = $("img[usemap='#" + mapName + "']");
      return img.length > 0 && img.is(":visible");
    }

    if (/^(input|select|textarea|button|object)$/.test(nodeName)) {
      focusableIfVisible = !element.disabled;

      if (focusableIfVisible) {
        // Form controls within a disabled fieldset are disabled.
        // However, controls within the fieldset's legend do not get disabled.
        // Since controls generally aren't placed inside legends, we skip
        // this portion of the check.
        fieldset = $(element).closest("fieldset")[0];

        if (fieldset) {
          focusableIfVisible = !fieldset.disabled;
        }
      }
    } else if ("a" === nodeName) {
      focusableIfVisible = element.href || hasTabindex;
    } else {
      focusableIfVisible = hasTabindex;
    }

    return focusableIfVisible && $(element).is(":visible") && visible($(element));
  }; // Support: IE 8 only
  // IE 8 doesn't resolve inherit to visible/hidden for computed values


  function visible(element) {
    var visibility = element.css("visibility");

    while (visibility === "inherit") {
      element = element.parent();
      visibility = element.css("visibility");
    }

    return visibility !== "hidden";
  }

  $.extend($.expr[":"], {
    focusable: function (element) {
      return $.ui.focusable(element, $.attr(element, "tabindex") != null);
    }
  });
  var focusable = $.ui.focusable; // Support: IE8 Only
  // IE8 does not support the form attribute and when it is supplied. It overwrites the form prop
  // with a string, so we need to find the proper form.

  var form = $.fn.form = function () {
    return typeof this[0].form === "string" ? this.closest("form") : $(this[0].form);
  };
  /*!
   * jQuery UI Form Reset Mixin 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Form Reset Mixin
  //>>group: Core
  //>>description: Refresh input widgets when their form is reset
  //>>docs: http://api.jqueryui.com/form-reset-mixin/


  var formResetMixin = $.ui.formResetMixin = {
    _formResetHandler: function () {
      var form = $(this); // Wait for the form reset to actually happen before refreshing

      setTimeout(function () {
        var instances = form.data("ui-form-reset-instances");
        $.each(instances, function () {
          this.refresh();
        });
      });
    },
    _bindFormResetHandler: function () {
      this.form = this.element.form();

      if (!this.form.length) {
        return;
      }

      var instances = this.form.data("ui-form-reset-instances") || [];

      if (!instances.length) {
        // We don't use _on() here because we use a single event handler per form
        this.form.on("reset.ui-form-reset", this._formResetHandler);
      }

      instances.push(this);
      this.form.data("ui-form-reset-instances", instances);
    },
    _unbindFormResetHandler: function () {
      if (!this.form.length) {
        return;
      }

      var instances = this.form.data("ui-form-reset-instances");
      instances.splice($.inArray(this, instances), 1);

      if (instances.length) {
        this.form.data("ui-form-reset-instances", instances);
      } else {
        this.form.removeData("ui-form-reset-instances").off("reset.ui-form-reset");
      }
    }
  };
  /*!
   * jQuery UI Support for jQuery core 1.7.x 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   *
   */
  //>>label: jQuery 1.7 Support
  //>>group: Core
  //>>description: Support version 1.7.x of jQuery core
  // Support: jQuery 1.7 only
  // Not a great way to check versions, but since we only support 1.7+ and only
  // need to detect <1.8, this is a simple check that should suffice. Checking
  // for "1.7." would be a bit safer, but the version string is 1.7, not 1.7.0
  // and we'll never reach 1.70.0 (if we do, we certainly won't be supporting
  // 1.7 anymore). See #11197 for why we're not using feature detection.

  if ($.fn.jquery.substring(0, 3) === "1.7") {
    // Setters for .innerWidth(), .innerHeight(), .outerWidth(), .outerHeight()
    // Unlike jQuery Core 1.8+, these only support numeric values to set the
    // dimensions in pixels
    $.each(["Width", "Height"], function (i, name) {
      var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
          type = name.toLowerCase(),
          orig = {
        innerWidth: $.fn.innerWidth,
        innerHeight: $.fn.innerHeight,
        outerWidth: $.fn.outerWidth,
        outerHeight: $.fn.outerHeight
      };

      function reduce(elem, size, border, margin) {
        $.each(side, function () {
          size -= parseFloat($.css(elem, "padding" + this)) || 0;

          if (border) {
            size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
          }

          if (margin) {
            size -= parseFloat($.css(elem, "margin" + this)) || 0;
          }
        });
        return size;
      }

      $.fn["inner" + name] = function (size) {
        if (size === undefined) {
          return orig["inner" + name].call(this);
        }

        return this.each(function () {
          $(this).css(type, reduce(this, size) + "px");
        });
      };

      $.fn["outer" + name] = function (size, margin) {
        if (typeof size !== "number") {
          return orig["outer" + name].call(this, size);
        }

        return this.each(function () {
          $(this).css(type, reduce(this, size, true, margin) + "px");
        });
      };
    });

    $.fn.addBack = function (selector) {
      return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
    };
  }

  ;
  /*!
   * jQuery UI Keycode 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Keycode
  //>>group: Core
  //>>description: Provide keycodes as keynames
  //>>docs: http://api.jqueryui.com/jQuery.ui.keyCode/

  var keycode = $.ui.keyCode = {
    BACKSPACE: 8,
    COMMA: 188,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SPACE: 32,
    TAB: 9,
    UP: 38
  }; // Internal use only

  var escapeSelector = $.ui.escapeSelector = function () {
    var selectorEscape = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;
    return function (selector) {
      return selector.replace(selectorEscape, "\\$1");
    };
  }();
  /*!
   * jQuery UI Labels 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: labels
  //>>group: Core
  //>>description: Find all the labels associated with a given input
  //>>docs: http://api.jqueryui.com/labels/


  var labels = $.fn.labels = function () {
    var ancestor, selector, id, labels, ancestors; // Check control.labels first

    if (this[0].labels && this[0].labels.length) {
      return this.pushStack(this[0].labels);
    } // Support: IE <= 11, FF <= 37, Android <= 2.3 only
    // Above browsers do not support control.labels. Everything below is to support them
    // as well as document fragments. control.labels does not work on document fragments


    labels = this.eq(0).parents("label"); // Look for the label based on the id

    id = this.attr("id");

    if (id) {
      // We don't search against the document in case the element
      // is disconnected from the DOM
      ancestor = this.eq(0).parents().last(); // Get a full set of top level ancestors

      ancestors = ancestor.add(ancestor.length ? ancestor.siblings() : this.siblings()); // Create a selector for the label based on the id

      selector = "label[for='" + $.ui.escapeSelector(id) + "']";
      labels = labels.add(ancestors.find(selector).addBack(selector));
    } // Return whatever we have found for labels


    return this.pushStack(labels);
  };
  /*!
   * jQuery UI Scroll Parent 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: scrollParent
  //>>group: Core
  //>>description: Get the closest ancestor element that is scrollable.
  //>>docs: http://api.jqueryui.com/scrollParent/


  var scrollParent = $.fn.scrollParent = function (includeHidden) {
    var position = this.css("position"),
        excludeStaticParent = position === "absolute",
        overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
        scrollParent = this.parents().filter(function () {
      var parent = $(this);

      if (excludeStaticParent && parent.css("position") === "static") {
        return false;
      }

      return overflowRegex.test(parent.css("overflow") + parent.css("overflow-y") + parent.css("overflow-x"));
    }).eq(0);
    return position === "fixed" || !scrollParent.length ? $(this[0].ownerDocument || document) : scrollParent;
  };
  /*!
   * jQuery UI Tabbable 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: :tabbable Selector
  //>>group: Core
  //>>description: Selects elements which can be tabbed to.
  //>>docs: http://api.jqueryui.com/tabbable-selector/


  var tabbable = $.extend($.expr[":"], {
    tabbable: function (element) {
      var tabIndex = $.attr(element, "tabindex"),
          hasTabindex = tabIndex != null;
      return (!hasTabindex || tabIndex >= 0) && $.ui.focusable(element, hasTabindex);
    }
  });
  /*!
   * jQuery UI Unique ID 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: uniqueId
  //>>group: Core
  //>>description: Functions to generate and remove uniqueId's
  //>>docs: http://api.jqueryui.com/uniqueId/

  var uniqueId = $.fn.extend({
    uniqueId: function () {
      var uuid = 0;
      return function () {
        return this.each(function () {
          if (!this.id) {
            this.id = "ui-id-" + ++uuid;
          }
        });
      };
    }(),
    removeUniqueId: function () {
      return this.each(function () {
        if (/^ui-id-\d+$/.test(this.id)) {
          $(this).removeAttr("id");
        }
      });
    }
  }); // This file is deprecated

  var ie = $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
  /*!
   * jQuery UI Mouse 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Mouse
  //>>group: Widgets
  //>>description: Abstracts mouse-based interactions to assist in creating certain widgets.
  //>>docs: http://api.jqueryui.com/mouse/

  var mouseHandled = false;
  $(document).on("mouseup", function () {
    mouseHandled = false;
  });
  var widgetsMouse = $.widget("ui.mouse", {
    version: "1.12.1",
    options: {
      cancel: "input, textarea, button, select, option",
      distance: 1,
      delay: 0
    },
    _mouseInit: function () {
      var that = this;
      this.element.on("mousedown." + this.widgetName, function (event) {
        return that._mouseDown(event);
      }).on("click." + this.widgetName, function (event) {
        if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
          $.removeData(event.target, that.widgetName + ".preventClickEvent");
          event.stopImmediatePropagation();
          return false;
        }
      });
      this.started = false;
    },
    // TODO: make sure destroying one instance of mouse doesn't mess with
    // other instances of mouse
    _mouseDestroy: function () {
      this.element.off("." + this.widgetName);

      if (this._mouseMoveDelegate) {
        this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate);
      }
    },
    _mouseDown: function (event) {
      // don't let more than one widget handle mouseStart
      if (mouseHandled) {
        return;
      }

      this._mouseMoved = false; // We may have missed mouseup (out of window)

      this._mouseStarted && this._mouseUp(event);
      this._mouseDownEvent = event;
      var that = this,
          btnIsLeft = event.which === 1,
          // event.target.nodeName works around a bug in IE 8 with
      // disabled inputs (#7620)
      elIsCancel = typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false;

      if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
        return true;
      }

      this.mouseDelayMet = !this.options.delay;

      if (!this.mouseDelayMet) {
        this._mouseDelayTimer = setTimeout(function () {
          that.mouseDelayMet = true;
        }, this.options.delay);
      }

      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted = this._mouseStart(event) !== false;

        if (!this._mouseStarted) {
          event.preventDefault();
          return true;
        }
      } // Click event may never have fired (Gecko & Opera)


      if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
        $.removeData(event.target, this.widgetName + ".preventClickEvent");
      } // These delegates are required to keep context


      this._mouseMoveDelegate = function (event) {
        return that._mouseMove(event);
      };

      this._mouseUpDelegate = function (event) {
        return that._mouseUp(event);
      };

      this.document.on("mousemove." + this.widgetName, this._mouseMoveDelegate).on("mouseup." + this.widgetName, this._mouseUpDelegate);
      event.preventDefault();
      mouseHandled = true;
      return true;
    },
    _mouseMove: function (event) {
      // Only check for mouseups outside the document if you've moved inside the document
      // at least once. This prevents the firing of mouseup in the case of IE<9, which will
      // fire a mousemove event if content is placed under the cursor. See #7778
      // Support: IE <9
      if (this._mouseMoved) {
        // IE mouseup check - mouseup happened when mouse was out of window
        if ($.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) {
          return this._mouseUp(event); // Iframe mouseup check - mouseup occurred in another document
        } else if (!event.which) {
          // Support: Safari <=8 - 9
          // Safari sets which to 0 if you press any of the following keys
          // during a drag (#14461)
          if (event.originalEvent.altKey || event.originalEvent.ctrlKey || event.originalEvent.metaKey || event.originalEvent.shiftKey) {
            this.ignoreMissingWhich = true;
          } else if (!this.ignoreMissingWhich) {
            return this._mouseUp(event);
          }
        }
      }

      if (event.which || event.button) {
        this._mouseMoved = true;
      }

      if (this._mouseStarted) {
        this._mouseDrag(event);

        return event.preventDefault();
      }

      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted = this._mouseStart(this._mouseDownEvent, event) !== false;
        this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event);
      }

      return !this._mouseStarted;
    },
    _mouseUp: function (event) {
      this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate);

      if (this._mouseStarted) {
        this._mouseStarted = false;

        if (event.target === this._mouseDownEvent.target) {
          $.data(event.target, this.widgetName + ".preventClickEvent", true);
        }

        this._mouseStop(event);
      }

      if (this._mouseDelayTimer) {
        clearTimeout(this._mouseDelayTimer);
        delete this._mouseDelayTimer;
      }

      this.ignoreMissingWhich = false;
      mouseHandled = false;
      event.preventDefault();
    },
    _mouseDistanceMet: function (event) {
      return Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance;
    },
    _mouseDelayMet: function ()
    /* event */
    {
      return this.mouseDelayMet;
    },
    // These are placeholder methods, to be overriden by extending plugin
    _mouseStart: function ()
    /* event */
    {},
    _mouseDrag: function ()
    /* event */
    {},
    _mouseStop: function ()
    /* event */
    {},
    _mouseCapture: function ()
    /* event */
    {
      return true;
    }
  }); // $.ui.plugin is deprecated. Use $.widget() extensions instead.

  var plugin = $.ui.plugin = {
    add: function (module, option, set) {
      var i,
          proto = $.ui[module].prototype;

      for (i in set) {
        proto.plugins[i] = proto.plugins[i] || [];
        proto.plugins[i].push([option, set[i]]);
      }
    },
    call: function (instance, name, args, allowDisconnected) {
      var i,
          set = instance.plugins[name];

      if (!set) {
        return;
      }

      if (!allowDisconnected && (!instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11)) {
        return;
      }

      for (i = 0; i < set.length; i++) {
        if (instance.options[set[i][0]]) {
          set[i][1].apply(instance.element, args);
        }
      }
    }
  };
  /*!
   * jQuery UI Resizable 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Resizable
  //>>group: Interactions
  //>>description: Enables resize functionality for any element.
  //>>docs: http://api.jqueryui.com/resizable/
  //>>demos: http://jqueryui.com/resizable/
  //>>css.structure: ../../themes/base/core.css
  //>>css.structure: ../../themes/base/resizable.css
  //>>css.theme: ../../themes/base/theme.css

  $.widget("ui.resizable", $.ui.mouse, {
    version: "1.12.1",
    widgetEventPrefix: "resize",
    options: {
      alsoResize: false,
      animate: false,
      animateDuration: "slow",
      animateEasing: "swing",
      aspectRatio: false,
      autoHide: false,
      classes: {
        "ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
      },
      containment: false,
      ghost: false,
      grid: false,
      handles: "e,s,se",
      helper: false,
      maxHeight: null,
      maxWidth: null,
      minHeight: 10,
      minWidth: 10,
      // See #7960
      zIndex: 90,
      // Callbacks
      resize: null,
      start: null,
      stop: null
    },
    _num: function (value) {
      return parseFloat(value) || 0;
    },
    _isNumber: function (value) {
      return !isNaN(parseFloat(value));
    },
    _hasScroll: function (el, a) {
      if ($(el).css("overflow") === "hidden") {
        return false;
      }

      var scroll = a && a === "left" ? "scrollLeft" : "scrollTop",
          has = false;

      if (el[scroll] > 0) {
        return true;
      } // TODO: determine which cases actually cause this to happen
      // if the element doesn't have the scroll set, see if it's possible to
      // set the scroll


      el[scroll] = 1;
      has = el[scroll] > 0;
      el[scroll] = 0;
      return has;
    },
    _create: function () {
      var margins,
          o = this.options,
          that = this;

      this._addClass("ui-resizable");

      $.extend(this, {
        _aspectRatio: !!o.aspectRatio,
        aspectRatio: o.aspectRatio,
        originalElement: this.element,
        _proportionallyResizeElements: [],
        _helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
      }); // Wrap the element if it cannot hold child nodes

      if (this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)) {
        this.element.wrap($("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
          position: this.element.css("position"),
          width: this.element.outerWidth(),
          height: this.element.outerHeight(),
          top: this.element.css("top"),
          left: this.element.css("left")
        }));
        this.element = this.element.parent().data("ui-resizable", this.element.resizable("instance"));
        this.elementIsWrapper = true;
        margins = {
          marginTop: this.originalElement.css("marginTop"),
          marginRight: this.originalElement.css("marginRight"),
          marginBottom: this.originalElement.css("marginBottom"),
          marginLeft: this.originalElement.css("marginLeft")
        };
        this.element.css(margins);
        this.originalElement.css("margin", 0); // support: Safari
        // Prevent Safari textarea resize

        this.originalResizeStyle = this.originalElement.css("resize");
        this.originalElement.css("resize", "none");

        this._proportionallyResizeElements.push(this.originalElement.css({
          position: "static",
          zoom: 1,
          display: "block"
        })); // Support: IE9
        // avoid IE jump (hard set the margin)


        this.originalElement.css(margins);

        this._proportionallyResize();
      }

      this._setupHandles();

      if (o.autoHide) {
        $(this.element).on("mouseenter", function () {
          if (o.disabled) {
            return;
          }

          that._removeClass("ui-resizable-autohide");

          that._handles.show();
        }).on("mouseleave", function () {
          if (o.disabled) {
            return;
          }

          if (!that.resizing) {
            that._addClass("ui-resizable-autohide");

            that._handles.hide();
          }
        });
      }

      this._mouseInit();
    },
    _destroy: function () {
      this._mouseDestroy();

      var wrapper,
          _destroy = function (exp) {
        $(exp).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove();
      }; // TODO: Unwrap at same DOM position


      if (this.elementIsWrapper) {
        _destroy(this.element);

        wrapper = this.element;
        this.originalElement.css({
          position: wrapper.css("position"),
          width: wrapper.outerWidth(),
          height: wrapper.outerHeight(),
          top: wrapper.css("top"),
          left: wrapper.css("left")
        }).insertAfter(wrapper);
        wrapper.remove();
      }

      this.originalElement.css("resize", this.originalResizeStyle);

      _destroy(this.originalElement);

      return this;
    },
    _setOption: function (key, value) {
      this._super(key, value);

      switch (key) {
        case "handles":
          this._removeHandles();

          this._setupHandles();

          break;

        default:
          break;
      }
    },
    _setupHandles: function () {
      var o = this.options,
          handle,
          i,
          n,
          hname,
          axis,
          that = this;
      this.handles = o.handles || (!$(".ui-resizable-handle", this.element).length ? "e,s,se" : {
        n: ".ui-resizable-n",
        e: ".ui-resizable-e",
        s: ".ui-resizable-s",
        w: ".ui-resizable-w",
        se: ".ui-resizable-se",
        sw: ".ui-resizable-sw",
        ne: ".ui-resizable-ne",
        nw: ".ui-resizable-nw"
      });
      this._handles = $();

      if (this.handles.constructor === String) {
        if (this.handles === "all") {
          this.handles = "n,e,s,w,se,sw,ne,nw";
        }

        n = this.handles.split(",");
        this.handles = {};

        for (i = 0; i < n.length; i++) {
          handle = $.trim(n[i]);
          hname = "ui-resizable-" + handle;
          axis = $("<div>");

          this._addClass(axis, "ui-resizable-handle " + hname);

          axis.css({
            zIndex: o.zIndex
          });
          this.handles[handle] = ".ui-resizable-" + handle;
          this.element.append(axis);
        }
      }

      this._renderAxis = function (target) {
        var i, axis, padPos, padWrapper;
        target = target || this.element;

        for (i in this.handles) {
          if (this.handles[i].constructor === String) {
            this.handles[i] = this.element.children(this.handles[i]).first().show();
          } else if (this.handles[i].jquery || this.handles[i].nodeType) {
            this.handles[i] = $(this.handles[i]);

            this._on(this.handles[i], {
              "mousedown": that._mouseDown
            });
          }

          if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)) {
            axis = $(this.handles[i], this.element);
            padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();
            padPos = ["padding", /ne|nw|n/.test(i) ? "Top" : /se|sw|s/.test(i) ? "Bottom" : /^e$/.test(i) ? "Right" : "Left"].join("");
            target.css(padPos, padWrapper);

            this._proportionallyResize();
          }

          this._handles = this._handles.add(this.handles[i]);
        }
      }; // TODO: make renderAxis a prototype function


      this._renderAxis(this.element);

      this._handles = this._handles.add(this.element.find(".ui-resizable-handle"));

      this._handles.disableSelection();

      this._handles.on("mouseover", function () {
        if (!that.resizing) {
          if (this.className) {
            axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
          }

          that.axis = axis && axis[1] ? axis[1] : "se";
        }
      });

      if (o.autoHide) {
        this._handles.hide();

        this._addClass("ui-resizable-autohide");
      }
    },
    _removeHandles: function () {
      this._handles.remove();
    },
    _mouseCapture: function (event) {
      var i,
          handle,
          capture = false;

      for (i in this.handles) {
        handle = $(this.handles[i])[0];

        if (handle === event.target || $.contains(handle, event.target)) {
          capture = true;
        }
      }

      return !this.options.disabled && capture;
    },
    _mouseStart: function (event) {
      var curleft,
          curtop,
          cursor,
          o = this.options,
          el = this.element;
      this.resizing = true;

      this._renderProxy();

      curleft = this._num(this.helper.css("left"));
      curtop = this._num(this.helper.css("top"));

      if (o.containment) {
        curleft += $(o.containment).scrollLeft() || 0;
        curtop += $(o.containment).scrollTop() || 0;
      }

      this.offset = this.helper.offset();
      this.position = {
        left: curleft,
        top: curtop
      };
      this.size = this._helper ? {
        width: this.helper.width(),
        height: this.helper.height()
      } : {
        width: el.width(),
        height: el.height()
      };
      this.originalSize = this._helper ? {
        width: el.outerWidth(),
        height: el.outerHeight()
      } : {
        width: el.width(),
        height: el.height()
      };
      this.sizeDiff = {
        width: el.outerWidth() - el.width(),
        height: el.outerHeight() - el.height()
      };
      this.originalPosition = {
        left: curleft,
        top: curtop
      };
      this.originalMousePosition = {
        left: event.pageX,
        top: event.pageY
      };
      this.aspectRatio = typeof o.aspectRatio === "number" ? o.aspectRatio : this.originalSize.width / this.originalSize.height || 1;
      cursor = $(".ui-resizable-" + this.axis).css("cursor");
      $("body").css("cursor", cursor === "auto" ? this.axis + "-resize" : cursor);

      this._addClass("ui-resizable-resizing");

      this._propagate("start", event);

      return true;
    },
    _mouseDrag: function (event) {
      var data,
          props,
          smp = this.originalMousePosition,
          a = this.axis,
          dx = event.pageX - smp.left || 0,
          dy = event.pageY - smp.top || 0,
          trigger = this._change[a];

      this._updatePrevProperties();

      if (!trigger) {
        return false;
      }

      data = trigger.apply(this, [event, dx, dy]);

      this._updateVirtualBoundaries(event.shiftKey);

      if (this._aspectRatio || event.shiftKey) {
        data = this._updateRatio(data, event);
      }

      data = this._respectSize(data, event);

      this._updateCache(data);

      this._propagate("resize", event);

      props = this._applyChanges();

      if (!this._helper && this._proportionallyResizeElements.length) {
        this._proportionallyResize();
      }

      if (!$.isEmptyObject(props)) {
        this._updatePrevProperties();

        this._trigger("resize", event, this.ui());

        this._applyChanges();
      }

      return false;
    },
    _mouseStop: function (event) {
      this.resizing = false;
      var pr,
          ista,
          soffseth,
          soffsetw,
          s,
          left,
          top,
          o = this.options,
          that = this;

      if (this._helper) {
        pr = this._proportionallyResizeElements;
        ista = pr.length && /textarea/i.test(pr[0].nodeName);
        soffseth = ista && this._hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height;
        soffsetw = ista ? 0 : that.sizeDiff.width;
        s = {
          width: that.helper.width() - soffsetw,
          height: that.helper.height() - soffseth
        };
        left = parseFloat(that.element.css("left")) + (that.position.left - that.originalPosition.left) || null;
        top = parseFloat(that.element.css("top")) + (that.position.top - that.originalPosition.top) || null;

        if (!o.animate) {
          this.element.css($.extend(s, {
            top: top,
            left: left
          }));
        }

        that.helper.height(that.size.height);
        that.helper.width(that.size.width);

        if (this._helper && !o.animate) {
          this._proportionallyResize();
        }
      }

      $("body").css("cursor", "auto");

      this._removeClass("ui-resizable-resizing");

      this._propagate("stop", event);

      if (this._helper) {
        this.helper.remove();
      }

      return false;
    },
    _updatePrevProperties: function () {
      this.prevPosition = {
        top: this.position.top,
        left: this.position.left
      };
      this.prevSize = {
        width: this.size.width,
        height: this.size.height
      };
    },
    _applyChanges: function () {
      var props = {};

      if (this.position.top !== this.prevPosition.top) {
        props.top = this.position.top + "px";
      }

      if (this.position.left !== this.prevPosition.left) {
        props.left = this.position.left + "px";
      }

      if (this.size.width !== this.prevSize.width) {
        props.width = this.size.width + "px";
      }

      if (this.size.height !== this.prevSize.height) {
        props.height = this.size.height + "px";
      }

      this.helper.css(props);
      return props;
    },
    _updateVirtualBoundaries: function (forceAspectRatio) {
      var pMinWidth,
          pMaxWidth,
          pMinHeight,
          pMaxHeight,
          b,
          o = this.options;
      b = {
        minWidth: this._isNumber(o.minWidth) ? o.minWidth : 0,
        maxWidth: this._isNumber(o.maxWidth) ? o.maxWidth : Infinity,
        minHeight: this._isNumber(o.minHeight) ? o.minHeight : 0,
        maxHeight: this._isNumber(o.maxHeight) ? o.maxHeight : Infinity
      };

      if (this._aspectRatio || forceAspectRatio) {
        pMinWidth = b.minHeight * this.aspectRatio;
        pMinHeight = b.minWidth / this.aspectRatio;
        pMaxWidth = b.maxHeight * this.aspectRatio;
        pMaxHeight = b.maxWidth / this.aspectRatio;

        if (pMinWidth > b.minWidth) {
          b.minWidth = pMinWidth;
        }

        if (pMinHeight > b.minHeight) {
          b.minHeight = pMinHeight;
        }

        if (pMaxWidth < b.maxWidth) {
          b.maxWidth = pMaxWidth;
        }

        if (pMaxHeight < b.maxHeight) {
          b.maxHeight = pMaxHeight;
        }
      }

      this._vBoundaries = b;
    },
    _updateCache: function (data) {
      this.offset = this.helper.offset();

      if (this._isNumber(data.left)) {
        this.position.left = data.left;
      }

      if (this._isNumber(data.top)) {
        this.position.top = data.top;
      }

      if (this._isNumber(data.height)) {
        this.size.height = data.height;
      }

      if (this._isNumber(data.width)) {
        this.size.width = data.width;
      }
    },
    _updateRatio: function (data) {
      var cpos = this.position,
          csize = this.size,
          a = this.axis;

      if (this._isNumber(data.height)) {
        data.width = data.height * this.aspectRatio;
      } else if (this._isNumber(data.width)) {
        data.height = data.width / this.aspectRatio;
      }

      if (a === "sw") {
        data.left = cpos.left + (csize.width - data.width);
        data.top = null;
      }

      if (a === "nw") {
        data.top = cpos.top + (csize.height - data.height);
        data.left = cpos.left + (csize.width - data.width);
      }

      return data;
    },
    _respectSize: function (data) {
      var o = this._vBoundaries,
          a = this.axis,
          ismaxw = this._isNumber(data.width) && o.maxWidth && o.maxWidth < data.width,
          ismaxh = this._isNumber(data.height) && o.maxHeight && o.maxHeight < data.height,
          isminw = this._isNumber(data.width) && o.minWidth && o.minWidth > data.width,
          isminh = this._isNumber(data.height) && o.minHeight && o.minHeight > data.height,
          dw = this.originalPosition.left + this.originalSize.width,
          dh = this.originalPosition.top + this.originalSize.height,
          cw = /sw|nw|w/.test(a),
          ch = /nw|ne|n/.test(a);

      if (isminw) {
        data.width = o.minWidth;
      }

      if (isminh) {
        data.height = o.minHeight;
      }

      if (ismaxw) {
        data.width = o.maxWidth;
      }

      if (ismaxh) {
        data.height = o.maxHeight;
      }

      if (isminw && cw) {
        data.left = dw - o.minWidth;
      }

      if (ismaxw && cw) {
        data.left = dw - o.maxWidth;
      }

      if (isminh && ch) {
        data.top = dh - o.minHeight;
      }

      if (ismaxh && ch) {
        data.top = dh - o.maxHeight;
      } // Fixing jump error on top/left - bug #2330


      if (!data.width && !data.height && !data.left && data.top) {
        data.top = null;
      } else if (!data.width && !data.height && !data.top && data.left) {
        data.left = null;
      }

      return data;
    },
    _getPaddingPlusBorderDimensions: function (element) {
      var i = 0,
          widths = [],
          borders = [element.css("borderTopWidth"), element.css("borderRightWidth"), element.css("borderBottomWidth"), element.css("borderLeftWidth")],
          paddings = [element.css("paddingTop"), element.css("paddingRight"), element.css("paddingBottom"), element.css("paddingLeft")];

      for (; i < 4; i++) {
        widths[i] = parseFloat(borders[i]) || 0;
        widths[i] += parseFloat(paddings[i]) || 0;
      }

      return {
        height: widths[0] + widths[2],
        width: widths[1] + widths[3]
      };
    },
    _proportionallyResize: function () {
      if (!this._proportionallyResizeElements.length) {
        return;
      }

      var prel,
          i = 0,
          element = this.helper || this.element;

      for (; i < this._proportionallyResizeElements.length; i++) {
        prel = this._proportionallyResizeElements[i]; // TODO: Seems like a bug to cache this.outerDimensions
        // considering that we are in a loop.

        if (!this.outerDimensions) {
          this.outerDimensions = this._getPaddingPlusBorderDimensions(prel);
        }

        prel.css({
          height: element.height() - this.outerDimensions.height || 0,
          width: element.width() - this.outerDimensions.width || 0
        });
      }
    },
    _renderProxy: function () {
      var el = this.element,
          o = this.options;
      this.elementOffset = el.offset();

      if (this._helper) {
        this.helper = this.helper || $("<div style='overflow:hidden;'></div>");

        this._addClass(this.helper, this._helper);

        this.helper.css({
          width: this.element.outerWidth(),
          height: this.element.outerHeight(),
          position: "absolute",
          left: this.elementOffset.left + "px",
          top: this.elementOffset.top + "px",
          zIndex: ++o.zIndex //TODO: Don't modify option

        });
        this.helper.appendTo("body").disableSelection();
      } else {
        this.helper = this.element;
      }
    },
    _change: {
      e: function (event, dx) {
        return {
          width: this.originalSize.width + dx
        };
      },
      w: function (event, dx) {
        var cs = this.originalSize,
            sp = this.originalPosition;
        return {
          left: sp.left + dx,
          width: cs.width - dx
        };
      },
      n: function (event, dx, dy) {
        var cs = this.originalSize,
            sp = this.originalPosition;
        return {
          top: sp.top + dy,
          height: cs.height - dy
        };
      },
      s: function (event, dx, dy) {
        return {
          height: this.originalSize.height + dy
        };
      },
      se: function (event, dx, dy) {
        return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
      },
      sw: function (event, dx, dy) {
        return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
      },
      ne: function (event, dx, dy) {
        return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
      },
      nw: function (event, dx, dy) {
        return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
      }
    },
    _propagate: function (n, event) {
      $.ui.plugin.call(this, n, [event, this.ui()]);
      n !== "resize" && this._trigger(n, event, this.ui());
    },
    plugins: {},
    ui: function () {
      return {
        originalElement: this.originalElement,
        element: this.element,
        helper: this.helper,
        position: this.position,
        size: this.size,
        originalSize: this.originalSize,
        originalPosition: this.originalPosition
      };
    }
  });
  /*
   * Resizable Extensions
   */

  $.ui.plugin.add("resizable", "animate", {
    stop: function (event) {
      var that = $(this).resizable("instance"),
          o = that.options,
          pr = that._proportionallyResizeElements,
          ista = pr.length && /textarea/i.test(pr[0].nodeName),
          soffseth = ista && that._hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height,
          soffsetw = ista ? 0 : that.sizeDiff.width,
          style = {
        width: that.size.width - soffsetw,
        height: that.size.height - soffseth
      },
          left = parseFloat(that.element.css("left")) + (that.position.left - that.originalPosition.left) || null,
          top = parseFloat(that.element.css("top")) + (that.position.top - that.originalPosition.top) || null;
      that.element.animate($.extend(style, top && left ? {
        top: top,
        left: left
      } : {}), {
        duration: o.animateDuration,
        easing: o.animateEasing,
        step: function () {
          var data = {
            width: parseFloat(that.element.css("width")),
            height: parseFloat(that.element.css("height")),
            top: parseFloat(that.element.css("top")),
            left: parseFloat(that.element.css("left"))
          };

          if (pr && pr.length) {
            $(pr[0]).css({
              width: data.width,
              height: data.height
            });
          } // Propagating resize, and updating values for each animation step


          that._updateCache(data);

          that._propagate("resize", event);
        }
      });
    }
  });
  $.ui.plugin.add("resizable", "containment", {
    start: function () {
      var element,
          p,
          co,
          ch,
          cw,
          width,
          height,
          that = $(this).resizable("instance"),
          o = that.options,
          el = that.element,
          oc = o.containment,
          ce = oc instanceof $ ? oc.get(0) : /parent/.test(oc) ? el.parent().get(0) : oc;

      if (!ce) {
        return;
      }

      that.containerElement = $(ce);

      if (/document/.test(oc) || oc === document) {
        that.containerOffset = {
          left: 0,
          top: 0
        };
        that.containerPosition = {
          left: 0,
          top: 0
        };
        that.parentData = {
          element: $(document),
          left: 0,
          top: 0,
          width: $(document).width(),
          height: $(document).height() || document.body.parentNode.scrollHeight
        };
      } else {
        element = $(ce);
        p = [];
        $(["Top", "Right", "Left", "Bottom"]).each(function (i, name) {
          p[i] = that._num(element.css("padding" + name));
        });
        that.containerOffset = element.offset();
        that.containerPosition = element.position();
        that.containerSize = {
          height: element.innerHeight() - p[3],
          width: element.innerWidth() - p[1]
        };
        co = that.containerOffset;
        ch = that.containerSize.height;
        cw = that.containerSize.width;
        width = that._hasScroll(ce, "left") ? ce.scrollWidth : cw;
        height = that._hasScroll(ce) ? ce.scrollHeight : ch;
        that.parentData = {
          element: ce,
          left: co.left,
          top: co.top,
          width: width,
          height: height
        };
      }
    },
    resize: function (event) {
      var woset,
          hoset,
          isParent,
          isOffsetRelative,
          that = $(this).resizable("instance"),
          o = that.options,
          co = that.containerOffset,
          cp = that.position,
          pRatio = that._aspectRatio || event.shiftKey,
          cop = {
        top: 0,
        left: 0
      },
          ce = that.containerElement,
          continueResize = true;

      if (ce[0] !== document && /static/.test(ce.css("position"))) {
        cop = co;
      }

      if (cp.left < (that._helper ? co.left : 0)) {
        that.size.width = that.size.width + (that._helper ? that.position.left - co.left : that.position.left - cop.left);

        if (pRatio) {
          that.size.height = that.size.width / that.aspectRatio;
          continueResize = false;
        }

        that.position.left = o.helper ? co.left : 0;
      }

      if (cp.top < (that._helper ? co.top : 0)) {
        that.size.height = that.size.height + (that._helper ? that.position.top - co.top : that.position.top);

        if (pRatio) {
          that.size.width = that.size.height * that.aspectRatio;
          continueResize = false;
        }

        that.position.top = that._helper ? co.top : 0;
      }

      isParent = that.containerElement.get(0) === that.element.parent().get(0);
      isOffsetRelative = /relative|absolute/.test(that.containerElement.css("position"));

      if (isParent && isOffsetRelative) {
        that.offset.left = that.parentData.left + that.position.left;
        that.offset.top = that.parentData.top + that.position.top;
      } else {
        that.offset.left = that.element.offset().left;
        that.offset.top = that.element.offset().top;
      }

      woset = Math.abs(that.sizeDiff.width + (that._helper ? that.offset.left - cop.left : that.offset.left - co.left));
      hoset = Math.abs(that.sizeDiff.height + (that._helper ? that.offset.top - cop.top : that.offset.top - co.top));

      if (woset + that.size.width >= that.parentData.width) {
        that.size.width = that.parentData.width - woset;

        if (pRatio) {
          that.size.height = that.size.width / that.aspectRatio;
          continueResize = false;
        }
      }

      if (hoset + that.size.height >= that.parentData.height) {
        that.size.height = that.parentData.height - hoset;

        if (pRatio) {
          that.size.width = that.size.height * that.aspectRatio;
          continueResize = false;
        }
      }

      if (!continueResize) {
        that.position.left = that.prevPosition.left;
        that.position.top = that.prevPosition.top;
        that.size.width = that.prevSize.width;
        that.size.height = that.prevSize.height;
      }
    },
    stop: function () {
      var that = $(this).resizable("instance"),
          o = that.options,
          co = that.containerOffset,
          cop = that.containerPosition,
          ce = that.containerElement,
          helper = $(that.helper),
          ho = helper.offset(),
          w = helper.outerWidth() - that.sizeDiff.width,
          h = helper.outerHeight() - that.sizeDiff.height;

      if (that._helper && !o.animate && /relative/.test(ce.css("position"))) {
        $(this).css({
          left: ho.left - cop.left - co.left,
          width: w,
          height: h
        });
      }

      if (that._helper && !o.animate && /static/.test(ce.css("position"))) {
        $(this).css({
          left: ho.left - cop.left - co.left,
          width: w,
          height: h
        });
      }
    }
  });
  $.ui.plugin.add("resizable", "alsoResize", {
    start: function () {
      var that = $(this).resizable("instance"),
          o = that.options;
      $(o.alsoResize).each(function () {
        var el = $(this);
        el.data("ui-resizable-alsoresize", {
          width: parseFloat(el.width()),
          height: parseFloat(el.height()),
          left: parseFloat(el.css("left")),
          top: parseFloat(el.css("top"))
        });
      });
    },
    resize: function (event, ui) {
      var that = $(this).resizable("instance"),
          o = that.options,
          os = that.originalSize,
          op = that.originalPosition,
          delta = {
        height: that.size.height - os.height || 0,
        width: that.size.width - os.width || 0,
        top: that.position.top - op.top || 0,
        left: that.position.left - op.left || 0
      };
      $(o.alsoResize).each(function () {
        var el = $(this),
            start = $(this).data("ui-resizable-alsoresize"),
            style = {},
            css = el.parents(ui.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
        $.each(css, function (i, prop) {
          var sum = (start[prop] || 0) + (delta[prop] || 0);

          if (sum && sum >= 0) {
            style[prop] = sum || null;
          }
        });
        el.css(style);
      });
    },
    stop: function () {
      $(this).removeData("ui-resizable-alsoresize");
    }
  });
  $.ui.plugin.add("resizable", "ghost", {
    start: function () {
      var that = $(this).resizable("instance"),
          cs = that.size;
      that.ghost = that.originalElement.clone();
      that.ghost.css({
        opacity: 0.25,
        display: "block",
        position: "relative",
        height: cs.height,
        width: cs.width,
        margin: 0,
        left: 0,
        top: 0
      });

      that._addClass(that.ghost, "ui-resizable-ghost"); // DEPRECATED
      // TODO: remove after 1.12


      if ($.uiBackCompat !== false && typeof that.options.ghost === "string") {
        // Ghost option
        that.ghost.addClass(this.options.ghost);
      }

      that.ghost.appendTo(that.helper);
    },
    resize: function () {
      var that = $(this).resizable("instance");

      if (that.ghost) {
        that.ghost.css({
          position: "relative",
          height: that.size.height,
          width: that.size.width
        });
      }
    },
    stop: function () {
      var that = $(this).resizable("instance");

      if (that.ghost && that.helper) {
        that.helper.get(0).removeChild(that.ghost.get(0));
      }
    }
  });
  $.ui.plugin.add("resizable", "grid", {
    resize: function () {
      var outerDimensions,
          that = $(this).resizable("instance"),
          o = that.options,
          cs = that.size,
          os = that.originalSize,
          op = that.originalPosition,
          a = that.axis,
          grid = typeof o.grid === "number" ? [o.grid, o.grid] : o.grid,
          gridX = grid[0] || 1,
          gridY = grid[1] || 1,
          ox = Math.round((cs.width - os.width) / gridX) * gridX,
          oy = Math.round((cs.height - os.height) / gridY) * gridY,
          newWidth = os.width + ox,
          newHeight = os.height + oy,
          isMaxWidth = o.maxWidth && o.maxWidth < newWidth,
          isMaxHeight = o.maxHeight && o.maxHeight < newHeight,
          isMinWidth = o.minWidth && o.minWidth > newWidth,
          isMinHeight = o.minHeight && o.minHeight > newHeight;
      o.grid = grid;

      if (isMinWidth) {
        newWidth += gridX;
      }

      if (isMinHeight) {
        newHeight += gridY;
      }

      if (isMaxWidth) {
        newWidth -= gridX;
      }

      if (isMaxHeight) {
        newHeight -= gridY;
      }

      if (/^(se|s|e)$/.test(a)) {
        that.size.width = newWidth;
        that.size.height = newHeight;
      } else if (/^(ne)$/.test(a)) {
        that.size.width = newWidth;
        that.size.height = newHeight;
        that.position.top = op.top - oy;
      } else if (/^(sw)$/.test(a)) {
        that.size.width = newWidth;
        that.size.height = newHeight;
        that.position.left = op.left - ox;
      } else {
        if (newHeight - gridY <= 0 || newWidth - gridX <= 0) {
          outerDimensions = that._getPaddingPlusBorderDimensions(this);
        }

        if (newHeight - gridY > 0) {
          that.size.height = newHeight;
          that.position.top = op.top - oy;
        } else {
          newHeight = gridY - outerDimensions.height;
          that.size.height = newHeight;
          that.position.top = op.top + os.height - newHeight;
        }

        if (newWidth - gridX > 0) {
          that.size.width = newWidth;
          that.position.left = op.left - ox;
        } else {
          newWidth = gridX - outerDimensions.width;
          that.size.width = newWidth;
          that.position.left = op.left + os.width - newWidth;
        }
      }
    }
  });
  var widgetsResizable = $.ui.resizable;
  /*!
   * jQuery UI Selectable 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Selectable
  //>>group: Interactions
  //>>description: Allows groups of elements to be selected with the mouse.
  //>>docs: http://api.jqueryui.com/selectable/
  //>>demos: http://jqueryui.com/selectable/
  //>>css.structure: ../../themes/base/selectable.css

  var widgetsSelectable = $.widget("ui.selectable", $.ui.mouse, {
    version: "1.12.1",
    options: {
      appendTo: "body",
      autoRefresh: true,
      distance: 0,
      filter: "*",
      tolerance: "touch",
      // Callbacks
      selected: null,
      selecting: null,
      start: null,
      stop: null,
      unselected: null,
      unselecting: null
    },
    _create: function () {
      var that = this;

      this._addClass("ui-selectable");

      this.dragged = false; // Cache selectee children based on filter

      this.refresh = function () {
        that.elementPos = $(that.element[0]).offset();
        that.selectees = $(that.options.filter, that.element[0]);

        that._addClass(that.selectees, "ui-selectee");

        that.selectees.each(function () {
          var $this = $(this),
              selecteeOffset = $this.offset(),
              pos = {
            left: selecteeOffset.left - that.elementPos.left,
            top: selecteeOffset.top - that.elementPos.top
          };
          $.data(this, "selectable-item", {
            element: this,
            $element: $this,
            left: pos.left,
            top: pos.top,
            right: pos.left + $this.outerWidth(),
            bottom: pos.top + $this.outerHeight(),
            startselected: false,
            selected: $this.hasClass("ui-selected"),
            selecting: $this.hasClass("ui-selecting"),
            unselecting: $this.hasClass("ui-unselecting")
          });
        });
      };

      this.refresh();

      this._mouseInit();

      this.helper = $("<div>");

      this._addClass(this.helper, "ui-selectable-helper");
    },
    _destroy: function () {
      this.selectees.removeData("selectable-item");

      this._mouseDestroy();
    },
    _mouseStart: function (event) {
      var that = this,
          options = this.options;
      this.opos = [event.pageX, event.pageY];
      this.elementPos = $(this.element[0]).offset();

      if (this.options.disabled) {
        return;
      }

      this.selectees = $(options.filter, this.element[0]);

      this._trigger("start", event);

      $(options.appendTo).append(this.helper); // position helper (lasso)

      this.helper.css({
        "left": event.pageX,
        "top": event.pageY,
        "width": 0,
        "height": 0
      });

      if (options.autoRefresh) {
        this.refresh();
      }

      this.selectees.filter(".ui-selected").each(function () {
        var selectee = $.data(this, "selectable-item");
        selectee.startselected = true;

        if (!event.metaKey && !event.ctrlKey) {
          that._removeClass(selectee.$element, "ui-selected");

          selectee.selected = false;

          that._addClass(selectee.$element, "ui-unselecting");

          selectee.unselecting = true; // selectable UNSELECTING callback

          that._trigger("unselecting", event, {
            unselecting: selectee.element
          });
        }
      });
      $(event.target).parents().addBack().each(function () {
        var doSelect,
            selectee = $.data(this, "selectable-item");

        if (selectee) {
          doSelect = !event.metaKey && !event.ctrlKey || !selectee.$element.hasClass("ui-selected");

          that._removeClass(selectee.$element, doSelect ? "ui-unselecting" : "ui-selected")._addClass(selectee.$element, doSelect ? "ui-selecting" : "ui-unselecting");

          selectee.unselecting = !doSelect;
          selectee.selecting = doSelect;
          selectee.selected = doSelect; // selectable (UN)SELECTING callback

          if (doSelect) {
            that._trigger("selecting", event, {
              selecting: selectee.element
            });
          } else {
            that._trigger("unselecting", event, {
              unselecting: selectee.element
            });
          }

          return false;
        }
      });
    },
    _mouseDrag: function (event) {
      this.dragged = true;

      if (this.options.disabled) {
        return;
      }

      var tmp,
          that = this,
          options = this.options,
          x1 = this.opos[0],
          y1 = this.opos[1],
          x2 = event.pageX,
          y2 = event.pageY;

      if (x1 > x2) {
        tmp = x2;
        x2 = x1;
        x1 = tmp;
      }

      if (y1 > y2) {
        tmp = y2;
        y2 = y1;
        y1 = tmp;
      }

      this.helper.css({
        left: x1,
        top: y1,
        width: x2 - x1,
        height: y2 - y1
      });
      this.selectees.each(function () {
        var selectee = $.data(this, "selectable-item"),
            hit = false,
            offset = {}; //prevent helper from being selected if appendTo: selectable

        if (!selectee || selectee.element === that.element[0]) {
          return;
        }

        offset.left = selectee.left + that.elementPos.left;
        offset.right = selectee.right + that.elementPos.left;
        offset.top = selectee.top + that.elementPos.top;
        offset.bottom = selectee.bottom + that.elementPos.top;

        if (options.tolerance === "touch") {
          hit = !(offset.left > x2 || offset.right < x1 || offset.top > y2 || offset.bottom < y1);
        } else if (options.tolerance === "fit") {
          hit = offset.left > x1 && offset.right < x2 && offset.top > y1 && offset.bottom < y2;
        }

        if (hit) {
          // SELECT
          if (selectee.selected) {
            that._removeClass(selectee.$element, "ui-selected");

            selectee.selected = false;
          }

          if (selectee.unselecting) {
            that._removeClass(selectee.$element, "ui-unselecting");

            selectee.unselecting = false;
          }

          if (!selectee.selecting) {
            that._addClass(selectee.$element, "ui-selecting");

            selectee.selecting = true; // selectable SELECTING callback

            that._trigger("selecting", event, {
              selecting: selectee.element
            });
          }
        } else {
          // UNSELECT
          if (selectee.selecting) {
            if ((event.metaKey || event.ctrlKey) && selectee.startselected) {
              that._removeClass(selectee.$element, "ui-selecting");

              selectee.selecting = false;

              that._addClass(selectee.$element, "ui-selected");

              selectee.selected = true;
            } else {
              that._removeClass(selectee.$element, "ui-selecting");

              selectee.selecting = false;

              if (selectee.startselected) {
                that._addClass(selectee.$element, "ui-unselecting");

                selectee.unselecting = true;
              } // selectable UNSELECTING callback


              that._trigger("unselecting", event, {
                unselecting: selectee.element
              });
            }
          }

          if (selectee.selected) {
            if (!event.metaKey && !event.ctrlKey && !selectee.startselected) {
              that._removeClass(selectee.$element, "ui-selected");

              selectee.selected = false;

              that._addClass(selectee.$element, "ui-unselecting");

              selectee.unselecting = true; // selectable UNSELECTING callback

              that._trigger("unselecting", event, {
                unselecting: selectee.element
              });
            }
          }
        }
      });
      return false;
    },
    _mouseStop: function (event) {
      var that = this;
      this.dragged = false;
      $(".ui-unselecting", this.element[0]).each(function () {
        var selectee = $.data(this, "selectable-item");

        that._removeClass(selectee.$element, "ui-unselecting");

        selectee.unselecting = false;
        selectee.startselected = false;

        that._trigger("unselected", event, {
          unselected: selectee.element
        });
      });
      $(".ui-selecting", this.element[0]).each(function () {
        var selectee = $.data(this, "selectable-item");

        that._removeClass(selectee.$element, "ui-selecting")._addClass(selectee.$element, "ui-selected");

        selectee.selecting = false;
        selectee.selected = true;
        selectee.startselected = true;

        that._trigger("selected", event, {
          selected: selectee.element
        });
      });

      this._trigger("stop", event);

      this.helper.remove();
      return false;
    }
  });
  /*!
   * jQuery UI Sortable 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Sortable
  //>>group: Interactions
  //>>description: Enables items in a list to be sorted using the mouse.
  //>>docs: http://api.jqueryui.com/sortable/
  //>>demos: http://jqueryui.com/sortable/
  //>>css.structure: ../../themes/base/sortable.css

  var widgetsSortable = $.widget("ui.sortable", $.ui.mouse, {
    version: "1.12.1",
    widgetEventPrefix: "sort",
    ready: false,
    options: {
      appendTo: "parent",
      axis: false,
      connectWith: false,
      containment: false,
      cursor: "auto",
      cursorAt: false,
      dropOnEmpty: true,
      forcePlaceholderSize: false,
      forceHelperSize: false,
      grid: false,
      handle: false,
      helper: "original",
      items: "> *",
      opacity: false,
      placeholder: false,
      revert: false,
      scroll: true,
      scrollSensitivity: 20,
      scrollSpeed: 20,
      scope: "default",
      tolerance: "intersect",
      zIndex: 1000,
      // Callbacks
      activate: null,
      beforeStop: null,
      change: null,
      deactivate: null,
      out: null,
      over: null,
      receive: null,
      remove: null,
      sort: null,
      start: null,
      stop: null,
      update: null
    },
    _isOverAxis: function (x, reference, size) {
      return x >= reference && x < reference + size;
    },
    _isFloating: function (item) {
      return /left|right/.test(item.css("float")) || /inline|table-cell/.test(item.css("display"));
    },
    _create: function () {
      this.containerCache = {};

      this._addClass("ui-sortable"); //Get the items


      this.refresh(); //Let's determine the parent's offset

      this.offset = this.element.offset(); //Initialize mouse events for interaction

      this._mouseInit();

      this._setHandleClassName(); //We're ready to go


      this.ready = true;
    },
    _setOption: function (key, value) {
      this._super(key, value);

      if (key === "handle") {
        this._setHandleClassName();
      }
    },
    _setHandleClassName: function () {
      var that = this;

      this._removeClass(this.element.find(".ui-sortable-handle"), "ui-sortable-handle");

      $.each(this.items, function () {
        that._addClass(this.instance.options.handle ? this.item.find(this.instance.options.handle) : this.item, "ui-sortable-handle");
      });
    },
    _destroy: function () {
      this._mouseDestroy();

      for (var i = this.items.length - 1; i >= 0; i--) {
        this.items[i].item.removeData(this.widgetName + "-item");
      }

      return this;
    },
    _mouseCapture: function (event, overrideHandle) {
      var currentItem = null,
          validHandle = false,
          that = this;

      if (this.reverting) {
        return false;
      }

      if (this.options.disabled || this.options.type === "static") {
        return false;
      } //We have to refresh the items data once first


      this._refreshItems(event); //Find out if the clicked node (or one of its parents) is a actual item in this.items


      $(event.target).parents().each(function () {
        if ($.data(this, that.widgetName + "-item") === that) {
          currentItem = $(this);
          return false;
        }
      });

      if ($.data(event.target, that.widgetName + "-item") === that) {
        currentItem = $(event.target);
      }

      if (!currentItem) {
        return false;
      }

      if (this.options.handle && !overrideHandle) {
        $(this.options.handle, currentItem).find("*").addBack().each(function () {
          if (this === event.target) {
            validHandle = true;
          }
        });

        if (!validHandle) {
          return false;
        }
      }

      this.currentItem = currentItem;

      this._removeCurrentsFromItems();

      return true;
    },
    _mouseStart: function (event, overrideHandle, noActivation) {
      var i,
          body,
          o = this.options;
      this.currentContainer = this; //We only need to call refreshPositions, because the refreshItems call has been moved to
      // mouseCapture

      this.refreshPositions(); //Create and append the visible helper

      this.helper = this._createHelper(event); //Cache the helper size

      this._cacheHelperProportions();
      /*
       * - Position generation -
       * This block generates everything position related - it's the core of draggables.
       */
      //Cache the margins of the original element


      this._cacheMargins(); //Get the next scrolling parent


      this.scrollParent = this.helper.scrollParent(); //The element's absolute position on the page minus margins

      this.offset = this.currentItem.offset();
      this.offset = {
        top: this.offset.top - this.margins.top,
        left: this.offset.left - this.margins.left
      };
      $.extend(this.offset, {
        click: {
          //Where the click happened, relative to the element
          left: event.pageX - this.offset.left,
          top: event.pageY - this.offset.top
        },
        parent: this._getParentOffset(),
        // This is a relative to absolute position minus the actual position calculation -
        // only used for relative positioned helper
        relative: this._getRelativeOffset()
      }); // Only after we got the offset, we can change the helper's position to absolute
      // TODO: Still need to figure out a way to make relative sorting possible

      this.helper.css("position", "absolute");
      this.cssPosition = this.helper.css("position"); //Generate the original position

      this.originalPosition = this._generatePosition(event);
      this.originalPageX = event.pageX;
      this.originalPageY = event.pageY; //Adjust the mouse offset relative to the helper if "cursorAt" is supplied

      o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt); //Cache the former DOM position

      this.domPosition = {
        prev: this.currentItem.prev()[0],
        parent: this.currentItem.parent()[0]
      }; // If the helper is not the original, hide the original so it's not playing any role during
      // the drag, won't cause anything bad this way

      if (this.helper[0] !== this.currentItem[0]) {
        this.currentItem.hide();
      } //Create the placeholder


      this._createPlaceholder(); //Set a containment if given in the options


      if (o.containment) {
        this._setContainment();
      }

      if (o.cursor && o.cursor !== "auto") {
        // cursor option
        body = this.document.find("body"); // Support: IE

        this.storedCursor = body.css("cursor");
        body.css("cursor", o.cursor);
        this.storedStylesheet = $("<style>*{ cursor: " + o.cursor + " !important; }</style>").appendTo(body);
      }

      if (o.opacity) {
        // opacity option
        if (this.helper.css("opacity")) {
          this._storedOpacity = this.helper.css("opacity");
        }

        this.helper.css("opacity", o.opacity);
      }

      if (o.zIndex) {
        // zIndex option
        if (this.helper.css("zIndex")) {
          this._storedZIndex = this.helper.css("zIndex");
        }

        this.helper.css("zIndex", o.zIndex);
      } //Prepare scrolling


      if (this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML") {
        this.overflowOffset = this.scrollParent.offset();
      } //Call callbacks


      this._trigger("start", event, this._uiHash()); //Recache the helper size


      if (!this._preserveHelperProportions) {
        this._cacheHelperProportions();
      } //Post "activate" events to possible containers


      if (!noActivation) {
        for (i = this.containers.length - 1; i >= 0; i--) {
          this.containers[i]._trigger("activate", event, this._uiHash(this));
        }
      } //Prepare possible droppables


      if ($.ui.ddmanager) {
        $.ui.ddmanager.current = this;
      }

      if ($.ui.ddmanager && !o.dropBehaviour) {
        $.ui.ddmanager.prepareOffsets(this, event);
      }

      this.dragging = true;

      this._addClass(this.helper, "ui-sortable-helper"); // Execute the drag once - this causes the helper not to be visiblebefore getting its
      // correct position


      this._mouseDrag(event);

      return true;
    },
    _mouseDrag: function (event) {
      var i,
          item,
          itemElement,
          intersection,
          o = this.options,
          scrolled = false; //Compute the helpers position

      this.position = this._generatePosition(event);
      this.positionAbs = this._convertPositionTo("absolute");

      if (!this.lastPositionAbs) {
        this.lastPositionAbs = this.positionAbs;
      } //Do scrolling


      if (this.options.scroll) {
        if (this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML") {
          if (this.overflowOffset.top + this.scrollParent[0].offsetHeight - event.pageY < o.scrollSensitivity) {
            this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
          } else if (event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
            this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
          }

          if (this.overflowOffset.left + this.scrollParent[0].offsetWidth - event.pageX < o.scrollSensitivity) {
            this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
          } else if (event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
            this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
          }
        } else {
          if (event.pageY - this.document.scrollTop() < o.scrollSensitivity) {
            scrolled = this.document.scrollTop(this.document.scrollTop() - o.scrollSpeed);
          } else if (this.window.height() - (event.pageY - this.document.scrollTop()) < o.scrollSensitivity) {
            scrolled = this.document.scrollTop(this.document.scrollTop() + o.scrollSpeed);
          }

          if (event.pageX - this.document.scrollLeft() < o.scrollSensitivity) {
            scrolled = this.document.scrollLeft(this.document.scrollLeft() - o.scrollSpeed);
          } else if (this.window.width() - (event.pageX - this.document.scrollLeft()) < o.scrollSensitivity) {
            scrolled = this.document.scrollLeft(this.document.scrollLeft() + o.scrollSpeed);
          }
        }

        if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
          $.ui.ddmanager.prepareOffsets(this, event);
        }
      } //Regenerate the absolute position used for position checks


      this.positionAbs = this._convertPositionTo("absolute"); //Set the helper position

      if (!this.options.axis || this.options.axis !== "y") {
        this.helper[0].style.left = this.position.left + "px";
      }

      if (!this.options.axis || this.options.axis !== "x") {
        this.helper[0].style.top = this.position.top + "px";
      } //Rearrange


      for (i = this.items.length - 1; i >= 0; i--) {
        //Cache variables and intersection, continue if no intersection
        item = this.items[i];
        itemElement = item.item[0];
        intersection = this._intersectsWithPointer(item);

        if (!intersection) {
          continue;
        } // Only put the placeholder inside the current Container, skip all
        // items from other containers. This works because when moving
        // an item from one container to another the
        // currentContainer is switched before the placeholder is moved.
        //
        // Without this, moving items in "sub-sortables" can cause
        // the placeholder to jitter between the outer and inner container.


        if (item.instance !== this.currentContainer) {
          continue;
        } // Cannot intersect with itself
        // no useless actions that have been done before
        // no action if the item moved is the parent of the item checked


        if (itemElement !== this.currentItem[0] && this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement && !$.contains(this.placeholder[0], itemElement) && (this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)) {
          this.direction = intersection === 1 ? "down" : "up";

          if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
            this._rearrange(event, item);
          } else {
            break;
          }

          this._trigger("change", event, this._uiHash());

          break;
        }
      } //Post events to containers


      this._contactContainers(event); //Interconnect with droppables


      if ($.ui.ddmanager) {
        $.ui.ddmanager.drag(this, event);
      } //Call callbacks


      this._trigger("sort", event, this._uiHash());

      this.lastPositionAbs = this.positionAbs;
      return false;
    },
    _mouseStop: function (event, noPropagation) {
      if (!event) {
        return;
      } //If we are using droppables, inform the manager about the drop


      if ($.ui.ddmanager && !this.options.dropBehaviour) {
        $.ui.ddmanager.drop(this, event);
      }

      if (this.options.revert) {
        var that = this,
            cur = this.placeholder.offset(),
            axis = this.options.axis,
            animation = {};

        if (!axis || axis === "x") {
          animation.left = cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollLeft);
        }

        if (!axis || axis === "y") {
          animation.top = cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollTop);
        }

        this.reverting = true;
        $(this.helper).animate(animation, parseInt(this.options.revert, 10) || 500, function () {
          that._clear(event);
        });
      } else {
        this._clear(event, noPropagation);
      }

      return false;
    },
    cancel: function () {
      if (this.dragging) {
        this._mouseUp(new $.Event("mouseup", {
          target: null
        }));

        if (this.options.helper === "original") {
          this.currentItem.css(this._storedCSS);

          this._removeClass(this.currentItem, "ui-sortable-helper");
        } else {
          this.currentItem.show();
        } //Post deactivating events to containers


        for (var i = this.containers.length - 1; i >= 0; i--) {
          this.containers[i]._trigger("deactivate", null, this._uiHash(this));

          if (this.containers[i].containerCache.over) {
            this.containers[i]._trigger("out", null, this._uiHash(this));

            this.containers[i].containerCache.over = 0;
          }
        }
      }

      if (this.placeholder) {
        //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately,
        // it unbinds ALL events from the original node!
        if (this.placeholder[0].parentNode) {
          this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
        }

        if (this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
          this.helper.remove();
        }

        $.extend(this, {
          helper: null,
          dragging: false,
          reverting: false,
          _noFinalSort: null
        });

        if (this.domPosition.prev) {
          $(this.domPosition.prev).after(this.currentItem);
        } else {
          $(this.domPosition.parent).prepend(this.currentItem);
        }
      }

      return this;
    },
    serialize: function (o) {
      var items = this._getItemsAsjQuery(o && o.connected),
          str = [];

      o = o || {};
      $(items).each(function () {
        var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || /(.+)[\-=_](.+)/);

        if (res) {
          str.push((o.key || res[1] + "[]") + "=" + (o.key && o.expression ? res[1] : res[2]));
        }
      });

      if (!str.length && o.key) {
        str.push(o.key + "=");
      }

      return str.join("&");
    },
    toArray: function (o) {
      var items = this._getItemsAsjQuery(o && o.connected),
          ret = [];

      o = o || {};
      items.each(function () {
        ret.push($(o.item || this).attr(o.attribute || "id") || "");
      });
      return ret;
    },

    /* Be careful with the following core functions */
    _intersectsWith: function (item) {
      var x1 = this.positionAbs.left,
          x2 = x1 + this.helperProportions.width,
          y1 = this.positionAbs.top,
          y2 = y1 + this.helperProportions.height,
          l = item.left,
          r = l + item.width,
          t = item.top,
          b = t + item.height,
          dyClick = this.offset.click.top,
          dxClick = this.offset.click.left,
          isOverElementHeight = this.options.axis === "x" || y1 + dyClick > t && y1 + dyClick < b,
          isOverElementWidth = this.options.axis === "y" || x1 + dxClick > l && x1 + dxClick < r,
          isOverElement = isOverElementHeight && isOverElementWidth;

      if (this.options.tolerance === "pointer" || this.options.forcePointerForContainers || this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"]) {
        return isOverElement;
      } else {
        return l < x1 + this.helperProportions.width / 2 && // Right Half
        x2 - this.helperProportions.width / 2 < r && // Left Half
        t < y1 + this.helperProportions.height / 2 && // Bottom Half
        y2 - this.helperProportions.height / 2 < b; // Top Half
      }
    },
    _intersectsWithPointer: function (item) {
      var verticalDirection,
          horizontalDirection,
          isOverElementHeight = this.options.axis === "x" || this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
          isOverElementWidth = this.options.axis === "y" || this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
          isOverElement = isOverElementHeight && isOverElementWidth;

      if (!isOverElement) {
        return false;
      }

      verticalDirection = this._getDragVerticalDirection();
      horizontalDirection = this._getDragHorizontalDirection();
      return this.floating ? horizontalDirection === "right" || verticalDirection === "down" ? 2 : 1 : verticalDirection && (verticalDirection === "down" ? 2 : 1);
    },
    _intersectsWithSides: function (item) {
      var isOverBottomHalf = this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + item.height / 2, item.height),
          isOverRightHalf = this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + item.width / 2, item.width),
          verticalDirection = this._getDragVerticalDirection(),
          horizontalDirection = this._getDragHorizontalDirection();

      if (this.floating && horizontalDirection) {
        return horizontalDirection === "right" && isOverRightHalf || horizontalDirection === "left" && !isOverRightHalf;
      } else {
        return verticalDirection && (verticalDirection === "down" && isOverBottomHalf || verticalDirection === "up" && !isOverBottomHalf);
      }
    },
    _getDragVerticalDirection: function () {
      var delta = this.positionAbs.top - this.lastPositionAbs.top;
      return delta !== 0 && (delta > 0 ? "down" : "up");
    },
    _getDragHorizontalDirection: function () {
      var delta = this.positionAbs.left - this.lastPositionAbs.left;
      return delta !== 0 && (delta > 0 ? "right" : "left");
    },
    refresh: function (event) {
      this._refreshItems(event);

      this._setHandleClassName();

      this.refreshPositions();
      return this;
    },
    _connectWith: function () {
      var options = this.options;
      return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
    },
    _getItemsAsjQuery: function (connected) {
      var i,
          j,
          cur,
          inst,
          items = [],
          queries = [],
          connectWith = this._connectWith();

      if (connectWith && connected) {
        for (i = connectWith.length - 1; i >= 0; i--) {
          cur = $(connectWith[i], this.document[0]);

          for (j = cur.length - 1; j >= 0; j--) {
            inst = $.data(cur[j], this.widgetFullName);

            if (inst && inst !== this && !inst.options.disabled) {
              queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
            }
          }
        }
      }

      queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
        options: this.options,
        item: this.currentItem
      }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

      function addItems() {
        items.push(this);
      }

      for (i = queries.length - 1; i >= 0; i--) {
        queries[i][0].each(addItems);
      }

      return $(items);
    },
    _removeCurrentsFromItems: function () {
      var list = this.currentItem.find(":data(" + this.widgetName + "-item)");
      this.items = $.grep(this.items, function (item) {
        for (var j = 0; j < list.length; j++) {
          if (list[j] === item.item[0]) {
            return false;
          }
        }

        return true;
      });
    },
    _refreshItems: function (event) {
      this.items = [];
      this.containers = [this];

      var i,
          j,
          cur,
          inst,
          targetData,
          _queries,
          item,
          queriesLength,
          items = this.items,
          queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, {
        item: this.currentItem
      }) : $(this.options.items, this.element), this]],
          connectWith = this._connectWith(); //Shouldn't be run the first time through due to massive slow-down


      if (connectWith && this.ready) {
        for (i = connectWith.length - 1; i >= 0; i--) {
          cur = $(connectWith[i], this.document[0]);

          for (j = cur.length - 1; j >= 0; j--) {
            inst = $.data(cur[j], this.widgetFullName);

            if (inst && inst !== this && !inst.options.disabled) {
              queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, {
                item: this.currentItem
              }) : $(inst.options.items, inst.element), inst]);
              this.containers.push(inst);
            }
          }
        }
      }

      for (i = queries.length - 1; i >= 0; i--) {
        targetData = queries[i][1];
        _queries = queries[i][0];

        for (j = 0, queriesLength = _queries.length; j < queriesLength; j++) {
          item = $(_queries[j]); // Data for target checking (mouse manager)

          item.data(this.widgetName + "-item", targetData);
          items.push({
            item: item,
            instance: targetData,
            width: 0,
            height: 0,
            left: 0,
            top: 0
          });
        }
      }
    },
    refreshPositions: function (fast) {
      // Determine whether items are being displayed horizontally
      this.floating = this.items.length ? this.options.axis === "x" || this._isFloating(this.items[0].item) : false; //This has to be redone because due to the item being moved out/into the offsetParent,
      // the offsetParent's position will change

      if (this.offsetParent && this.helper) {
        this.offset.parent = this._getParentOffset();
      }

      var i, item, t, p;

      for (i = this.items.length - 1; i >= 0; i--) {
        item = this.items[i]; //We ignore calculating positions of all connected containers when we're not over them

        if (item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
          continue;
        }

        t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

        if (!fast) {
          item.width = t.outerWidth();
          item.height = t.outerHeight();
        }

        p = t.offset();
        item.left = p.left;
        item.top = p.top;
      }

      if (this.options.custom && this.options.custom.refreshContainers) {
        this.options.custom.refreshContainers.call(this);
      } else {
        for (i = this.containers.length - 1; i >= 0; i--) {
          p = this.containers[i].element.offset();
          this.containers[i].containerCache.left = p.left;
          this.containers[i].containerCache.top = p.top;
          this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
          this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
        }
      }

      return this;
    },
    _createPlaceholder: function (that) {
      that = that || this;
      var className,
          o = that.options;

      if (!o.placeholder || o.placeholder.constructor === String) {
        className = o.placeholder;
        o.placeholder = {
          element: function () {
            var nodeName = that.currentItem[0].nodeName.toLowerCase(),
                element = $("<" + nodeName + ">", that.document[0]);

            that._addClass(element, "ui-sortable-placeholder", className || that.currentItem[0].className)._removeClass(element, "ui-sortable-helper");

            if (nodeName === "tbody") {
              that._createTrPlaceholder(that.currentItem.find("tr").eq(0), $("<tr>", that.document[0]).appendTo(element));
            } else if (nodeName === "tr") {
              that._createTrPlaceholder(that.currentItem, element);
            } else if (nodeName === "img") {
              element.attr("src", that.currentItem.attr("src"));
            }

            if (!className) {
              element.css("visibility", "hidden");
            }

            return element;
          },
          update: function (container, p) {
            // 1. If a className is set as 'placeholder option, we don't force sizes -
            // the class is responsible for that
            // 2. The option 'forcePlaceholderSize can be enabled to force it even if a
            // class name is specified
            if (className && !o.forcePlaceholderSize) {
              return;
            } //If the element doesn't have a actual height by itself (without styles coming
            // from a stylesheet), it receives the inline height from the dragged item


            if (!p.height()) {
              p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop") || 0, 10) - parseInt(that.currentItem.css("paddingBottom") || 0, 10));
            }

            if (!p.width()) {
              p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft") || 0, 10) - parseInt(that.currentItem.css("paddingRight") || 0, 10));
            }
          }
        };
      } //Create the placeholder


      that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem)); //Append it after the actual current item

      that.currentItem.after(that.placeholder); //Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)

      o.placeholder.update(that, that.placeholder);
    },
    _createTrPlaceholder: function (sourceTr, targetTr) {
      var that = this;
      sourceTr.children().each(function () {
        $("<td>&#160;</td>", that.document[0]).attr("colspan", $(this).attr("colspan") || 1).appendTo(targetTr);
      });
    },
    _contactContainers: function (event) {
      var i,
          j,
          dist,
          itemWithLeastDistance,
          posProperty,
          sizeProperty,
          cur,
          nearBottom,
          floating,
          axis,
          innermostContainer = null,
          innermostIndex = null; // Get innermost container that intersects with item

      for (i = this.containers.length - 1; i >= 0; i--) {
        // Never consider a container that's located within the item itself
        if ($.contains(this.currentItem[0], this.containers[i].element[0])) {
          continue;
        }

        if (this._intersectsWith(this.containers[i].containerCache)) {
          // If we've already found a container and it's more "inner" than this, then continue
          if (innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
            continue;
          }

          innermostContainer = this.containers[i];
          innermostIndex = i;
        } else {
          // container doesn't intersect. trigger "out" event if necessary
          if (this.containers[i].containerCache.over) {
            this.containers[i]._trigger("out", event, this._uiHash(this));

            this.containers[i].containerCache.over = 0;
          }
        }
      } // If no intersecting containers found, return


      if (!innermostContainer) {
        return;
      } // Move the item into the container if it's not there already


      if (this.containers.length === 1) {
        if (!this.containers[innermostIndex].containerCache.over) {
          this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));

          this.containers[innermostIndex].containerCache.over = 1;
        }
      } else {
        // When entering a new container, we will find the item with the least distance and
        // append our item near it
        dist = 10000;
        itemWithLeastDistance = null;
        floating = innermostContainer.floating || this._isFloating(this.currentItem);
        posProperty = floating ? "left" : "top";
        sizeProperty = floating ? "width" : "height";
        axis = floating ? "pageX" : "pageY";

        for (j = this.items.length - 1; j >= 0; j--) {
          if (!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
            continue;
          }

          if (this.items[j].item[0] === this.currentItem[0]) {
            continue;
          }

          cur = this.items[j].item.offset()[posProperty];
          nearBottom = false;

          if (event[axis] - cur > this.items[j][sizeProperty] / 2) {
            nearBottom = true;
          }

          if (Math.abs(event[axis] - cur) < dist) {
            dist = Math.abs(event[axis] - cur);
            itemWithLeastDistance = this.items[j];
            this.direction = nearBottom ? "up" : "down";
          }
        } //Check if dropOnEmpty is enabled


        if (!itemWithLeastDistance && !this.options.dropOnEmpty) {
          return;
        }

        if (this.currentContainer === this.containers[innermostIndex]) {
          if (!this.currentContainer.containerCache.over) {
            this.containers[innermostIndex]._trigger("over", event, this._uiHash());

            this.currentContainer.containerCache.over = 1;
          }

          return;
        }

        itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);

        this._trigger("change", event, this._uiHash());

        this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));

        this.currentContainer = this.containers[innermostIndex]; //Update the placeholder

        this.options.placeholder.update(this.currentContainer, this.placeholder);

        this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));

        this.containers[innermostIndex].containerCache.over = 1;
      }
    },
    _createHelper: function (event) {
      var o = this.options,
          helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : o.helper === "clone" ? this.currentItem.clone() : this.currentItem; //Add the helper to the DOM if that didn't happen already

      if (!helper.parents("body").length) {
        $(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
      }

      if (helper[0] === this.currentItem[0]) {
        this._storedCSS = {
          width: this.currentItem[0].style.width,
          height: this.currentItem[0].style.height,
          position: this.currentItem.css("position"),
          top: this.currentItem.css("top"),
          left: this.currentItem.css("left")
        };
      }

      if (!helper[0].style.width || o.forceHelperSize) {
        helper.width(this.currentItem.width());
      }

      if (!helper[0].style.height || o.forceHelperSize) {
        helper.height(this.currentItem.height());
      }

      return helper;
    },
    _adjustOffsetFromHelper: function (obj) {
      if (typeof obj === "string") {
        obj = obj.split(" ");
      }

      if ($.isArray(obj)) {
        obj = {
          left: +obj[0],
          top: +obj[1] || 0
        };
      }

      if ("left" in obj) {
        this.offset.click.left = obj.left + this.margins.left;
      }

      if ("right" in obj) {
        this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
      }

      if ("top" in obj) {
        this.offset.click.top = obj.top + this.margins.top;
      }

      if ("bottom" in obj) {
        this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
      }
    },
    _getParentOffset: function () {
      //Get the offsetParent and cache its position
      this.offsetParent = this.helper.offsetParent();
      var po = this.offsetParent.offset(); // This is a special case where we need to modify a offset calculated on start, since the
      // following happened:
      // 1. The position of the helper is absolute, so it's position is calculated based on the
      // next positioned parent
      // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't
      // the document, which means that the scroll is included in the initial calculation of the
      // offset of the parent, and never recalculated upon drag

      if (this.cssPosition === "absolute" && this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) {
        po.left += this.scrollParent.scrollLeft();
        po.top += this.scrollParent.scrollTop();
      } // This needs to be actually done for all browsers, since pageX/pageY includes this
      // information with an ugly IE fix


      if (this.offsetParent[0] === this.document[0].body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie) {
        po = {
          top: 0,
          left: 0
        };
      }

      return {
        top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
        left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
      };
    },
    _getRelativeOffset: function () {
      if (this.cssPosition === "relative") {
        var p = this.currentItem.position();
        return {
          top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
          left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
        };
      } else {
        return {
          top: 0,
          left: 0
        };
      }
    },
    _cacheMargins: function () {
      this.margins = {
        left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
        top: parseInt(this.currentItem.css("marginTop"), 10) || 0
      };
    },
    _cacheHelperProportions: function () {
      this.helperProportions = {
        width: this.helper.outerWidth(),
        height: this.helper.outerHeight()
      };
    },
    _setContainment: function () {
      var ce,
          co,
          over,
          o = this.options;

      if (o.containment === "parent") {
        o.containment = this.helper[0].parentNode;
      }

      if (o.containment === "document" || o.containment === "window") {
        this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, o.containment === "document" ? this.document.width() : this.window.width() - this.helperProportions.width - this.margins.left, (o.containment === "document" ? this.document.height() || document.body.parentNode.scrollHeight : this.window.height() || this.document[0].body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
      }

      if (!/^(document|window|parent)$/.test(o.containment)) {
        ce = $(o.containment)[0];
        co = $(o.containment).offset();
        over = $(ce).css("overflow") !== "hidden";
        this.containment = [co.left + (parseInt($(ce).css("borderLeftWidth"), 10) || 0) + (parseInt($(ce).css("paddingLeft"), 10) || 0) - this.margins.left, co.top + (parseInt($(ce).css("borderTopWidth"), 10) || 0) + (parseInt($(ce).css("paddingTop"), 10) || 0) - this.margins.top, co.left + (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"), 10) || 0) - (parseInt($(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, co.top + (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"), 10) || 0) - (parseInt($(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top];
      }
    },
    _convertPositionTo: function (d, pos) {
      if (!pos) {
        pos = this.position;
      }

      var mod = d === "absolute" ? 1 : -1,
          scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
          scrollIsRootNode = /(html|body)/i.test(scroll[0].tagName);
      return {
        top: // The absolute mouse position
        pos.top + // Only for relative positioned nodes: Relative offset from element to offset parent
        this.offset.relative.top * mod + // The offsetParent's offset without borders (offset + border)
        this.offset.parent.top * mod - (this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : scrollIsRootNode ? 0 : scroll.scrollTop()) * mod,
        left: // The absolute mouse position
        pos.left + // Only for relative positioned nodes: Relative offset from element to offset parent
        this.offset.relative.left * mod + // The offsetParent's offset without borders (offset + border)
        this.offset.parent.left * mod - (this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod
      };
    },
    _generatePosition: function (event) {
      var top,
          left,
          o = this.options,
          pageX = event.pageX,
          pageY = event.pageY,
          scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
          scrollIsRootNode = /(html|body)/i.test(scroll[0].tagName); // This is another very weird special case that only happens for relative elements:
      // 1. If the css position is relative
      // 2. and the scroll parent is the document or similar to the offset parent
      // we have to refresh the relative offset during the scroll so there are no jumps

      if (this.cssPosition === "relative" && !(this.scrollParent[0] !== this.document[0] && this.scrollParent[0] !== this.offsetParent[0])) {
        this.offset.relative = this._getRelativeOffset();
      }
      /*
       * - Position constraining -
       * Constrain the position to a mix of grid, containment.
       */


      if (this.originalPosition) {
        //If we are not dragging yet, we won't check for options
        if (this.containment) {
          if (event.pageX - this.offset.click.left < this.containment[0]) {
            pageX = this.containment[0] + this.offset.click.left;
          }

          if (event.pageY - this.offset.click.top < this.containment[1]) {
            pageY = this.containment[1] + this.offset.click.top;
          }

          if (event.pageX - this.offset.click.left > this.containment[2]) {
            pageX = this.containment[2] + this.offset.click.left;
          }

          if (event.pageY - this.offset.click.top > this.containment[3]) {
            pageY = this.containment[3] + this.offset.click.top;
          }
        }

        if (o.grid) {
          top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
          pageY = this.containment ? top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3] ? top : top - this.offset.click.top >= this.containment[1] ? top - o.grid[1] : top + o.grid[1] : top;
          left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
          pageX = this.containment ? left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2] ? left : left - this.offset.click.left >= this.containment[0] ? left - o.grid[0] : left + o.grid[0] : left;
        }
      }

      return {
        top: // The absolute mouse position
        pageY - // Click offset (relative to the element)
        this.offset.click.top - // Only for relative positioned nodes: Relative offset from element to offset parent
        this.offset.relative.top - // The offsetParent's offset without borders (offset + border)
        this.offset.parent.top + (this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : scrollIsRootNode ? 0 : scroll.scrollTop()),
        left: // The absolute mouse position
        pageX - // Click offset (relative to the element)
        this.offset.click.left - // Only for relative positioned nodes: Relative offset from element to offset parent
        this.offset.relative.left - // The offsetParent's offset without borders (offset + border)
        this.offset.parent.left + (this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft())
      };
    },
    _rearrange: function (event, i, a, hardRefresh) {
      a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], this.direction === "down" ? i.item[0] : i.item[0].nextSibling); //Various things done here to improve the performance:
      // 1. we create a setTimeout, that calls refreshPositions
      // 2. on the instance, we have a counter variable, that get's higher after every append
      // 3. on the local scope, we copy the counter variable, and check in the timeout,
      // if it's still the same
      // 4. this lets only the last addition to the timeout stack through

      this.counter = this.counter ? ++this.counter : 1;
      var counter = this.counter;

      this._delay(function () {
        if (counter === this.counter) {
          //Precompute after each DOM insertion, NOT on mousemove
          this.refreshPositions(!hardRefresh);
        }
      });
    },
    _clear: function (event, noPropagation) {
      this.reverting = false; // We delay all events that have to be triggered to after the point where the placeholder
      // has been removed and everything else normalized again

      var i,
          delayedTriggers = []; // We first have to update the dom position of the actual currentItem
      // Note: don't do it if the current item is already removed (by a user), or it gets
      // reappended (see #4088)

      if (!this._noFinalSort && this.currentItem.parent().length) {
        this.placeholder.before(this.currentItem);
      }

      this._noFinalSort = null;

      if (this.helper[0] === this.currentItem[0]) {
        for (i in this._storedCSS) {
          if (this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
            this._storedCSS[i] = "";
          }
        }

        this.currentItem.css(this._storedCSS);

        this._removeClass(this.currentItem, "ui-sortable-helper");
      } else {
        this.currentItem.show();
      }

      if (this.fromOutside && !noPropagation) {
        delayedTriggers.push(function (event) {
          this._trigger("receive", event, this._uiHash(this.fromOutside));
        });
      }

      if ((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
        // Trigger update callback if the DOM position has changed
        delayedTriggers.push(function (event) {
          this._trigger("update", event, this._uiHash());
        });
      } // Check if the items Container has Changed and trigger appropriate
      // events.


      if (this !== this.currentContainer) {
        if (!noPropagation) {
          delayedTriggers.push(function (event) {
            this._trigger("remove", event, this._uiHash());
          });
          delayedTriggers.push(function (c) {
            return function (event) {
              c._trigger("receive", event, this._uiHash(this));
            };
          }.call(this, this.currentContainer));
          delayedTriggers.push(function (c) {
            return function (event) {
              c._trigger("update", event, this._uiHash(this));
            };
          }.call(this, this.currentContainer));
        }
      } //Post events to containers


      function delayEvent(type, instance, container) {
        return function (event) {
          container._trigger(type, event, instance._uiHash(instance));
        };
      }

      for (i = this.containers.length - 1; i >= 0; i--) {
        if (!noPropagation) {
          delayedTriggers.push(delayEvent("deactivate", this, this.containers[i]));
        }

        if (this.containers[i].containerCache.over) {
          delayedTriggers.push(delayEvent("out", this, this.containers[i]));
          this.containers[i].containerCache.over = 0;
        }
      } //Do what was originally in plugins


      if (this.storedCursor) {
        this.document.find("body").css("cursor", this.storedCursor);
        this.storedStylesheet.remove();
      }

      if (this._storedOpacity) {
        this.helper.css("opacity", this._storedOpacity);
      }

      if (this._storedZIndex) {
        this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
      }

      this.dragging = false;

      if (!noPropagation) {
        this._trigger("beforeStop", event, this._uiHash());
      } //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately,
      // it unbinds ALL events from the original node!


      this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

      if (!this.cancelHelperRemoval) {
        if (this.helper[0] !== this.currentItem[0]) {
          this.helper.remove();
        }

        this.helper = null;
      }

      if (!noPropagation) {
        for (i = 0; i < delayedTriggers.length; i++) {
          // Trigger all delayed events
          delayedTriggers[i].call(this, event);
        }

        this._trigger("stop", event, this._uiHash());
      }

      this.fromOutside = false;
      return !this.cancelHelperRemoval;
    },
    _trigger: function () {
      if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
        this.cancel();
      }
    },
    _uiHash: function (_inst) {
      var inst = _inst || this;
      return {
        helper: inst.helper,
        placeholder: inst.placeholder || $([]),
        position: inst.position,
        originalPosition: inst.originalPosition,
        offset: inst.positionAbs,
        item: inst.currentItem,
        sender: _inst ? _inst.element : null
      };
    }
  });
  /*!
   * jQuery UI Accordion 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Accordion
  //>>group: Widgets
  // jscs:disable maximumLineLength
  //>>description: Displays collapsible content panels for presenting information in a limited amount of space.
  // jscs:enable maximumLineLength
  //>>docs: http://api.jqueryui.com/accordion/
  //>>demos: http://jqueryui.com/accordion/
  //>>css.structure: ../../themes/base/core.css
  //>>css.structure: ../../themes/base/accordion.css
  //>>css.theme: ../../themes/base/theme.css

  var widgetsAccordion = $.widget("ui.accordion", {
    version: "1.12.1",
    options: {
      active: 0,
      animate: {},
      classes: {
        "ui-accordion-header": "ui-corner-top",
        "ui-accordion-header-collapsed": "ui-corner-all",
        "ui-accordion-content": "ui-corner-bottom"
      },
      collapsible: false,
      event: "click",
      header: "> li > :first-child, > :not(li):even",
      heightStyle: "auto",
      icons: {
        activeHeader: "ui-icon-triangle-1-s",
        header: "ui-icon-triangle-1-e"
      },
      // Callbacks
      activate: null,
      beforeActivate: null
    },
    hideProps: {
      borderTopWidth: "hide",
      borderBottomWidth: "hide",
      paddingTop: "hide",
      paddingBottom: "hide",
      height: "hide"
    },
    showProps: {
      borderTopWidth: "show",
      borderBottomWidth: "show",
      paddingTop: "show",
      paddingBottom: "show",
      height: "show"
    },
    _create: function () {
      var options = this.options;
      this.prevShow = this.prevHide = $();

      this._addClass("ui-accordion", "ui-widget ui-helper-reset");

      this.element.attr("role", "tablist"); // Don't allow collapsible: false and active: false / null

      if (!options.collapsible && (options.active === false || options.active == null)) {
        options.active = 0;
      }

      this._processPanels(); // handle negative values


      if (options.active < 0) {
        options.active += this.headers.length;
      }

      this._refresh();
    },
    _getCreateEventData: function () {
      return {
        header: this.active,
        panel: !this.active.length ? $() : this.active.next()
      };
    },
    _createIcons: function () {
      var icon,
          children,
          icons = this.options.icons;

      if (icons) {
        icon = $("<span>");

        this._addClass(icon, "ui-accordion-header-icon", "ui-icon " + icons.header);

        icon.prependTo(this.headers);
        children = this.active.children(".ui-accordion-header-icon");

        this._removeClass(children, icons.header)._addClass(children, null, icons.activeHeader)._addClass(this.headers, "ui-accordion-icons");
      }
    },
    _destroyIcons: function () {
      this._removeClass(this.headers, "ui-accordion-icons");

      this.headers.children(".ui-accordion-header-icon").remove();
    },
    _destroy: function () {
      var contents; // Clean up main element

      this.element.removeAttr("role"); // Clean up headers

      this.headers.removeAttr("role aria-expanded aria-selected aria-controls tabIndex").removeUniqueId();

      this._destroyIcons(); // Clean up content panels


      contents = this.headers.next().css("display", "").removeAttr("role aria-hidden aria-labelledby").removeUniqueId();

      if (this.options.heightStyle !== "content") {
        contents.css("height", "");
      }
    },
    _setOption: function (key, value) {
      if (key === "active") {
        // _activate() will handle invalid values and update this.options
        this._activate(value);

        return;
      }

      if (key === "event") {
        if (this.options.event) {
          this._off(this.headers, this.options.event);
        }

        this._setupEvents(value);
      }

      this._super(key, value); // Setting collapsible: false while collapsed; open first panel


      if (key === "collapsible" && !value && this.options.active === false) {
        this._activate(0);
      }

      if (key === "icons") {
        this._destroyIcons();

        if (value) {
          this._createIcons();
        }
      }
    },
    _setOptionDisabled: function (value) {
      this._super(value);

      this.element.attr("aria-disabled", value); // Support: IE8 Only
      // #5332 / #6059 - opacity doesn't cascade to positioned elements in IE
      // so we need to add the disabled class to the headers and panels

      this._toggleClass(null, "ui-state-disabled", !!value);

      this._toggleClass(this.headers.add(this.headers.next()), null, "ui-state-disabled", !!value);
    },
    _keydown: function (event) {
      if (event.altKey || event.ctrlKey) {
        return;
      }

      var keyCode = $.ui.keyCode,
          length = this.headers.length,
          currentIndex = this.headers.index(event.target),
          toFocus = false;

      switch (event.keyCode) {
        case keyCode.RIGHT:
        case keyCode.DOWN:
          toFocus = this.headers[(currentIndex + 1) % length];
          break;

        case keyCode.LEFT:
        case keyCode.UP:
          toFocus = this.headers[(currentIndex - 1 + length) % length];
          break;

        case keyCode.SPACE:
        case keyCode.ENTER:
          this._eventHandler(event);

          break;

        case keyCode.HOME:
          toFocus = this.headers[0];
          break;

        case keyCode.END:
          toFocus = this.headers[length - 1];
          break;
      }

      if (toFocus) {
        $(event.target).attr("tabIndex", -1);
        $(toFocus).attr("tabIndex", 0);
        $(toFocus).trigger("focus");
        event.preventDefault();
      }
    },
    _panelKeyDown: function (event) {
      if (event.keyCode === $.ui.keyCode.UP && event.ctrlKey) {
        $(event.currentTarget).prev().trigger("focus");
      }
    },
    refresh: function () {
      var options = this.options;

      this._processPanels(); // Was collapsed or no panel


      if (options.active === false && options.collapsible === true || !this.headers.length) {
        options.active = false;
        this.active = $(); // active false only when collapsible is true
      } else if (options.active === false) {
        this._activate(0); // was active, but active panel is gone

      } else if (this.active.length && !$.contains(this.element[0], this.active[0])) {
        // all remaining panel are disabled
        if (this.headers.length === this.headers.find(".ui-state-disabled").length) {
          options.active = false;
          this.active = $(); // activate previous panel
        } else {
          this._activate(Math.max(0, options.active - 1));
        } // was active, active panel still exists

      } else {
        // make sure active index is correct
        options.active = this.headers.index(this.active);
      }

      this._destroyIcons();

      this._refresh();
    },
    _processPanels: function () {
      var prevHeaders = this.headers,
          prevPanels = this.panels;
      this.headers = this.element.find(this.options.header);

      this._addClass(this.headers, "ui-accordion-header ui-accordion-header-collapsed", "ui-state-default");

      this.panels = this.headers.next().filter(":not(.ui-accordion-content-active)").hide();

      this._addClass(this.panels, "ui-accordion-content", "ui-helper-reset ui-widget-content"); // Avoid memory leaks (#10056)


      if (prevPanels) {
        this._off(prevHeaders.not(this.headers));

        this._off(prevPanels.not(this.panels));
      }
    },
    _refresh: function () {
      var maxHeight,
          options = this.options,
          heightStyle = options.heightStyle,
          parent = this.element.parent();
      this.active = this._findActive(options.active);

      this._addClass(this.active, "ui-accordion-header-active", "ui-state-active")._removeClass(this.active, "ui-accordion-header-collapsed");

      this._addClass(this.active.next(), "ui-accordion-content-active");

      this.active.next().show();
      this.headers.attr("role", "tab").each(function () {
        var header = $(this),
            headerId = header.uniqueId().attr("id"),
            panel = header.next(),
            panelId = panel.uniqueId().attr("id");
        header.attr("aria-controls", panelId);
        panel.attr("aria-labelledby", headerId);
      }).next().attr("role", "tabpanel");
      this.headers.not(this.active).attr({
        "aria-selected": "false",
        "aria-expanded": "false",
        tabIndex: -1
      }).next().attr({
        "aria-hidden": "true"
      }).hide(); // Make sure at least one header is in the tab order

      if (!this.active.length) {
        this.headers.eq(0).attr("tabIndex", 0);
      } else {
        this.active.attr({
          "aria-selected": "true",
          "aria-expanded": "true",
          tabIndex: 0
        }).next().attr({
          "aria-hidden": "false"
        });
      }

      this._createIcons();

      this._setupEvents(options.event);

      if (heightStyle === "fill") {
        maxHeight = parent.height();
        this.element.siblings(":visible").each(function () {
          var elem = $(this),
              position = elem.css("position");

          if (position === "absolute" || position === "fixed") {
            return;
          }

          maxHeight -= elem.outerHeight(true);
        });
        this.headers.each(function () {
          maxHeight -= $(this).outerHeight(true);
        });
        this.headers.next().each(function () {
          $(this).height(Math.max(0, maxHeight - $(this).innerHeight() + $(this).height()));
        }).css("overflow", "auto");
      } else if (heightStyle === "auto") {
        maxHeight = 0;
        this.headers.next().each(function () {
          var isVisible = $(this).is(":visible");

          if (!isVisible) {
            $(this).show();
          }

          maxHeight = Math.max(maxHeight, $(this).css("height", "").height());

          if (!isVisible) {
            $(this).hide();
          }
        }).height(maxHeight);
      }
    },
    _activate: function (index) {
      var active = this._findActive(index)[0]; // Trying to activate the already active panel


      if (active === this.active[0]) {
        return;
      } // Trying to collapse, simulate a click on the currently active header


      active = active || this.active[0];

      this._eventHandler({
        target: active,
        currentTarget: active,
        preventDefault: $.noop
      });
    },
    _findActive: function (selector) {
      return typeof selector === "number" ? this.headers.eq(selector) : $();
    },
    _setupEvents: function (event) {
      var events = {
        keydown: "_keydown"
      };

      if (event) {
        $.each(event.split(" "), function (index, eventName) {
          events[eventName] = "_eventHandler";
        });
      }

      this._off(this.headers.add(this.headers.next()));

      this._on(this.headers, events);

      this._on(this.headers.next(), {
        keydown: "_panelKeyDown"
      });

      this._hoverable(this.headers);

      this._focusable(this.headers);
    },
    _eventHandler: function (event) {
      var activeChildren,
          clickedChildren,
          options = this.options,
          active = this.active,
          clicked = $(event.currentTarget),
          clickedIsActive = clicked[0] === active[0],
          collapsing = clickedIsActive && options.collapsible,
          toShow = collapsing ? $() : clicked.next(),
          toHide = active.next(),
          eventData = {
        oldHeader: active,
        oldPanel: toHide,
        newHeader: collapsing ? $() : clicked,
        newPanel: toShow
      };
      event.preventDefault();

      if ( // click on active header, but not collapsible
      clickedIsActive && !options.collapsible || // allow canceling activation
      this._trigger("beforeActivate", event, eventData) === false) {
        return;
      }

      options.active = collapsing ? false : this.headers.index(clicked); // When the call to ._toggle() comes after the class changes
      // it causes a very odd bug in IE 8 (see #6720)

      this.active = clickedIsActive ? $() : clicked;

      this._toggle(eventData); // Switch classes
      // corner classes on the previously active header stay after the animation


      this._removeClass(active, "ui-accordion-header-active", "ui-state-active");

      if (options.icons) {
        activeChildren = active.children(".ui-accordion-header-icon");

        this._removeClass(activeChildren, null, options.icons.activeHeader)._addClass(activeChildren, null, options.icons.header);
      }

      if (!clickedIsActive) {
        this._removeClass(clicked, "ui-accordion-header-collapsed")._addClass(clicked, "ui-accordion-header-active", "ui-state-active");

        if (options.icons) {
          clickedChildren = clicked.children(".ui-accordion-header-icon");

          this._removeClass(clickedChildren, null, options.icons.header)._addClass(clickedChildren, null, options.icons.activeHeader);
        }

        this._addClass(clicked.next(), "ui-accordion-content-active");
      }
    },
    _toggle: function (data) {
      var toShow = data.newPanel,
          toHide = this.prevShow.length ? this.prevShow : data.oldPanel; // Handle activating a panel during the animation for another activation

      this.prevShow.add(this.prevHide).stop(true, true);
      this.prevShow = toShow;
      this.prevHide = toHide;

      if (this.options.animate) {
        this._animate(toShow, toHide, data);
      } else {
        toHide.hide();
        toShow.show();

        this._toggleComplete(data);
      }

      toHide.attr({
        "aria-hidden": "true"
      });
      toHide.prev().attr({
        "aria-selected": "false",
        "aria-expanded": "false"
      }); // if we're switching panels, remove the old header from the tab order
      // if we're opening from collapsed state, remove the previous header from the tab order
      // if we're collapsing, then keep the collapsing header in the tab order

      if (toShow.length && toHide.length) {
        toHide.prev().attr({
          "tabIndex": -1,
          "aria-expanded": "false"
        });
      } else if (toShow.length) {
        this.headers.filter(function () {
          return parseInt($(this).attr("tabIndex"), 10) === 0;
        }).attr("tabIndex", -1);
      }

      toShow.attr("aria-hidden", "false").prev().attr({
        "aria-selected": "true",
        "aria-expanded": "true",
        tabIndex: 0
      });
    },
    _animate: function (toShow, toHide, data) {
      var total,
          easing,
          duration,
          that = this,
          adjust = 0,
          boxSizing = toShow.css("box-sizing"),
          down = toShow.length && (!toHide.length || toShow.index() < toHide.index()),
          animate = this.options.animate || {},
          options = down && animate.down || animate,
          complete = function () {
        that._toggleComplete(data);
      };

      if (typeof options === "number") {
        duration = options;
      }

      if (typeof options === "string") {
        easing = options;
      } // fall back from options to animation in case of partial down settings


      easing = easing || options.easing || animate.easing;
      duration = duration || options.duration || animate.duration;

      if (!toHide.length) {
        return toShow.animate(this.showProps, duration, easing, complete);
      }

      if (!toShow.length) {
        return toHide.animate(this.hideProps, duration, easing, complete);
      }

      total = toShow.show().outerHeight();
      toHide.animate(this.hideProps, {
        duration: duration,
        easing: easing,
        step: function (now, fx) {
          fx.now = Math.round(now);
        }
      });
      toShow.hide().animate(this.showProps, {
        duration: duration,
        easing: easing,
        complete: complete,
        step: function (now, fx) {
          fx.now = Math.round(now);

          if (fx.prop !== "height") {
            if (boxSizing === "content-box") {
              adjust += fx.now;
            }
          } else if (that.options.heightStyle !== "content") {
            fx.now = Math.round(total - toHide.outerHeight() - adjust);
            adjust = 0;
          }
        }
      });
    },
    _toggleComplete: function (data) {
      var toHide = data.oldPanel,
          prev = toHide.prev();

      this._removeClass(toHide, "ui-accordion-content-active");

      this._removeClass(prev, "ui-accordion-header-active")._addClass(prev, "ui-accordion-header-collapsed"); // Work around for rendering bug in IE (#5421)


      if (toHide.length) {
        toHide.parent()[0].className = toHide.parent()[0].className;
      }

      this._trigger("activate", null, data);
    }
  });
  /*!
   * jQuery UI Effects 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Effects Core
  //>>group: Effects
  // jscs:disable maximumLineLength
  //>>description: Extends the internal jQuery effects. Includes morphing and easing. Required by all other effects.
  // jscs:enable maximumLineLength
  //>>docs: http://api.jqueryui.com/category/effects-core/
  //>>demos: http://jqueryui.com/effect/

  var dataSpace = "ui-effects-",
      dataSpaceStyle = "ui-effects-style",
      dataSpaceAnimated = "ui-effects-animated",
      // Create a local jQuery because jQuery Color relies on it and the
  // global may not exist with AMD and a custom build (#10199)
  jQuery = $;
  $.effects = {
    effect: {}
  };
  /*!
   * jQuery Color Animations v2.1.2
   * https://github.com/jquery/jquery-color
   *
   * Copyright 2014 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   *
   * Date: Wed Jan 16 08:47:09 2013 -0600
   */

  (function (jQuery, undefined) {
    var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor " + "borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
        // Plusequals test for += 100 -= 100
    rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
        // A set of RE's that can match strings and generate color tuples.
    stringParsers = [{
      re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
      parse: function (execResult) {
        return [execResult[1], execResult[2], execResult[3], execResult[4]];
      }
    }, {
      re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
      parse: function (execResult) {
        return [execResult[1] * 2.55, execResult[2] * 2.55, execResult[3] * 2.55, execResult[4]];
      }
    }, {
      // This regex ignores A-F because it's compared against an already lowercased string
      re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
      parse: function (execResult) {
        return [parseInt(execResult[1], 16), parseInt(execResult[2], 16), parseInt(execResult[3], 16)];
      }
    }, {
      // This regex ignores A-F because it's compared against an already lowercased string
      re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
      parse: function (execResult) {
        return [parseInt(execResult[1] + execResult[1], 16), parseInt(execResult[2] + execResult[2], 16), parseInt(execResult[3] + execResult[3], 16)];
      }
    }, {
      re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
      space: "hsla",
      parse: function (execResult) {
        return [execResult[1], execResult[2] / 100, execResult[3] / 100, execResult[4]];
      }
    }],
        // JQuery.Color( )
    color = jQuery.Color = function (color, green, blue, alpha) {
      return new jQuery.Color.fn.parse(color, green, blue, alpha);
    },
        spaces = {
      rgba: {
        props: {
          red: {
            idx: 0,
            type: "byte"
          },
          green: {
            idx: 1,
            type: "byte"
          },
          blue: {
            idx: 2,
            type: "byte"
          }
        }
      },
      hsla: {
        props: {
          hue: {
            idx: 0,
            type: "degrees"
          },
          saturation: {
            idx: 1,
            type: "percent"
          },
          lightness: {
            idx: 2,
            type: "percent"
          }
        }
      }
    },
        propTypes = {
      "byte": {
        floor: true,
        max: 255
      },
      "percent": {
        max: 1
      },
      "degrees": {
        mod: 360,
        floor: true
      }
    },
        support = color.support = {},
        // Element for support tests
    supportElem = jQuery("<p>")[0],
        // Colors = jQuery.Color.names
    colors,
        // Local aliases of functions called often
    each = jQuery.each; // Determine rgba support immediately


    supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
    support.rgba = supportElem.style.backgroundColor.indexOf("rgba") > -1; // Define cache name and alpha properties
    // for rgba and hsla spaces

    each(spaces, function (spaceName, space) {
      space.cache = "_" + spaceName;
      space.props.alpha = {
        idx: 3,
        type: "percent",
        def: 1
      };
    });

    function clamp(value, prop, allowEmpty) {
      var type = propTypes[prop.type] || {};

      if (value == null) {
        return allowEmpty || !prop.def ? null : prop.def;
      } // ~~ is an short way of doing floor for positive numbers


      value = type.floor ? ~~value : parseFloat(value); // IE will pass in empty strings as value for alpha,
      // which will hit this case

      if (isNaN(value)) {
        return prop.def;
      }

      if (type.mod) {
        // We add mod before modding to make sure that negatives values
        // get converted properly: -10 -> 350
        return (value + type.mod) % type.mod;
      } // For now all property types without mod have min and max


      return 0 > value ? 0 : type.max < value ? type.max : value;
    }

    function stringParse(string) {
      var inst = color(),
          rgba = inst._rgba = [];
      string = string.toLowerCase();
      each(stringParsers, function (i, parser) {
        var parsed,
            match = parser.re.exec(string),
            values = match && parser.parse(match),
            spaceName = parser.space || "rgba";

        if (values) {
          parsed = inst[spaceName](values); // If this was an rgba parse the assignment might happen twice
          // oh well....

          inst[spaces[spaceName].cache] = parsed[spaces[spaceName].cache];
          rgba = inst._rgba = parsed._rgba; // Exit each( stringParsers ) here because we matched

          return false;
        }
      }); // Found a stringParser that handled it

      if (rgba.length) {
        // If this came from a parsed string, force "transparent" when alpha is 0
        // chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
        if (rgba.join() === "0,0,0,0") {
          jQuery.extend(rgba, colors.transparent);
        }

        return inst;
      } // Named colors


      return colors[string];
    }

    color.fn = jQuery.extend(color.prototype, {
      parse: function (red, green, blue, alpha) {
        if (red === undefined) {
          this._rgba = [null, null, null, null];
          return this;
        }

        if (red.jquery || red.nodeType) {
          red = jQuery(red).css(green);
          green = undefined;
        }

        var inst = this,
            type = jQuery.type(red),
            rgba = this._rgba = []; // More than 1 argument specified - assume ( red, green, blue, alpha )

        if (green !== undefined) {
          red = [red, green, blue, alpha];
          type = "array";
        }

        if (type === "string") {
          return this.parse(stringParse(red) || colors._default);
        }

        if (type === "array") {
          each(spaces.rgba.props, function (key, prop) {
            rgba[prop.idx] = clamp(red[prop.idx], prop);
          });
          return this;
        }

        if (type === "object") {
          if (red instanceof color) {
            each(spaces, function (spaceName, space) {
              if (red[space.cache]) {
                inst[space.cache] = red[space.cache].slice();
              }
            });
          } else {
            each(spaces, function (spaceName, space) {
              var cache = space.cache;
              each(space.props, function (key, prop) {
                // If the cache doesn't exist, and we know how to convert
                if (!inst[cache] && space.to) {
                  // If the value was null, we don't need to copy it
                  // if the key was alpha, we don't need to copy it either
                  if (key === "alpha" || red[key] == null) {
                    return;
                  }

                  inst[cache] = space.to(inst._rgba);
                } // This is the only case where we allow nulls for ALL properties.
                // call clamp with alwaysAllowEmpty


                inst[cache][prop.idx] = clamp(red[key], prop, true);
              }); // Everything defined but alpha?

              if (inst[cache] && jQuery.inArray(null, inst[cache].slice(0, 3)) < 0) {
                // Use the default of 1
                inst[cache][3] = 1;

                if (space.from) {
                  inst._rgba = space.from(inst[cache]);
                }
              }
            });
          }

          return this;
        }
      },
      is: function (compare) {
        var is = color(compare),
            same = true,
            inst = this;
        each(spaces, function (_, space) {
          var localCache,
              isCache = is[space.cache];

          if (isCache) {
            localCache = inst[space.cache] || space.to && space.to(inst._rgba) || [];
            each(space.props, function (_, prop) {
              if (isCache[prop.idx] != null) {
                same = isCache[prop.idx] === localCache[prop.idx];
                return same;
              }
            });
          }

          return same;
        });
        return same;
      },
      _space: function () {
        var used = [],
            inst = this;
        each(spaces, function (spaceName, space) {
          if (inst[space.cache]) {
            used.push(spaceName);
          }
        });
        return used.pop();
      },
      transition: function (other, distance) {
        var end = color(other),
            spaceName = end._space(),
            space = spaces[spaceName],
            startColor = this.alpha() === 0 ? color("transparent") : this,
            start = startColor[space.cache] || space.to(startColor._rgba),
            result = start.slice();

        end = end[space.cache];
        each(space.props, function (key, prop) {
          var index = prop.idx,
              startValue = start[index],
              endValue = end[index],
              type = propTypes[prop.type] || {}; // If null, don't override start value

          if (endValue === null) {
            return;
          } // If null - use end


          if (startValue === null) {
            result[index] = endValue;
          } else {
            if (type.mod) {
              if (endValue - startValue > type.mod / 2) {
                startValue += type.mod;
              } else if (startValue - endValue > type.mod / 2) {
                startValue -= type.mod;
              }
            }

            result[index] = clamp((endValue - startValue) * distance + startValue, prop);
          }
        });
        return this[spaceName](result);
      },
      blend: function (opaque) {
        // If we are already opaque - return ourself
        if (this._rgba[3] === 1) {
          return this;
        }

        var rgb = this._rgba.slice(),
            a = rgb.pop(),
            blend = color(opaque)._rgba;

        return color(jQuery.map(rgb, function (v, i) {
          return (1 - a) * blend[i] + a * v;
        }));
      },
      toRgbaString: function () {
        var prefix = "rgba(",
            rgba = jQuery.map(this._rgba, function (v, i) {
          return v == null ? i > 2 ? 1 : 0 : v;
        });

        if (rgba[3] === 1) {
          rgba.pop();
          prefix = "rgb(";
        }

        return prefix + rgba.join() + ")";
      },
      toHslaString: function () {
        var prefix = "hsla(",
            hsla = jQuery.map(this.hsla(), function (v, i) {
          if (v == null) {
            v = i > 2 ? 1 : 0;
          } // Catch 1 and 2


          if (i && i < 3) {
            v = Math.round(v * 100) + "%";
          }

          return v;
        });

        if (hsla[3] === 1) {
          hsla.pop();
          prefix = "hsl(";
        }

        return prefix + hsla.join() + ")";
      },
      toHexString: function (includeAlpha) {
        var rgba = this._rgba.slice(),
            alpha = rgba.pop();

        if (includeAlpha) {
          rgba.push(~~(alpha * 255));
        }

        return "#" + jQuery.map(rgba, function (v) {
          // Default to 0 when nulls exist
          v = (v || 0).toString(16);
          return v.length === 1 ? "0" + v : v;
        }).join("");
      },
      toString: function () {
        return this._rgba[3] === 0 ? "transparent" : this.toRgbaString();
      }
    });
    color.fn.parse.prototype = color.fn; // Hsla conversions adapted from:
    // https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

    function hue2rgb(p, q, h) {
      h = (h + 1) % 1;

      if (h * 6 < 1) {
        return p + (q - p) * h * 6;
      }

      if (h * 2 < 1) {
        return q;
      }

      if (h * 3 < 2) {
        return p + (q - p) * (2 / 3 - h) * 6;
      }

      return p;
    }

    spaces.hsla.to = function (rgba) {
      if (rgba[0] == null || rgba[1] == null || rgba[2] == null) {
        return [null, null, null, rgba[3]];
      }

      var r = rgba[0] / 255,
          g = rgba[1] / 255,
          b = rgba[2] / 255,
          a = rgba[3],
          max = Math.max(r, g, b),
          min = Math.min(r, g, b),
          diff = max - min,
          add = max + min,
          l = add * 0.5,
          h,
          s;

      if (min === max) {
        h = 0;
      } else if (r === max) {
        h = 60 * (g - b) / diff + 360;
      } else if (g === max) {
        h = 60 * (b - r) / diff + 120;
      } else {
        h = 60 * (r - g) / diff + 240;
      } // Chroma (diff) == 0 means greyscale which, by definition, saturation = 0%
      // otherwise, saturation is based on the ratio of chroma (diff) to lightness (add)


      if (diff === 0) {
        s = 0;
      } else if (l <= 0.5) {
        s = diff / add;
      } else {
        s = diff / (2 - add);
      }

      return [Math.round(h) % 360, s, l, a == null ? 1 : a];
    };

    spaces.hsla.from = function (hsla) {
      if (hsla[0] == null || hsla[1] == null || hsla[2] == null) {
        return [null, null, null, hsla[3]];
      }

      var h = hsla[0] / 360,
          s = hsla[1],
          l = hsla[2],
          a = hsla[3],
          q = l <= 0.5 ? l * (1 + s) : l + s - l * s,
          p = 2 * l - q;
      return [Math.round(hue2rgb(p, q, h + 1 / 3) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - 1 / 3) * 255), a];
    };

    each(spaces, function (spaceName, space) {
      var props = space.props,
          cache = space.cache,
          to = space.to,
          from = space.from; // Makes rgba() and hsla()

      color.fn[spaceName] = function (value) {
        // Generate a cache for this space if it doesn't exist
        if (to && !this[cache]) {
          this[cache] = to(this._rgba);
        }

        if (value === undefined) {
          return this[cache].slice();
        }

        var ret,
            type = jQuery.type(value),
            arr = type === "array" || type === "object" ? value : arguments,
            local = this[cache].slice();
        each(props, function (key, prop) {
          var val = arr[type === "object" ? key : prop.idx];

          if (val == null) {
            val = local[prop.idx];
          }

          local[prop.idx] = clamp(val, prop);
        });

        if (from) {
          ret = color(from(local));
          ret[cache] = local;
          return ret;
        } else {
          return color(local);
        }
      }; // Makes red() green() blue() alpha() hue() saturation() lightness()


      each(props, function (key, prop) {
        // Alpha is included in more than one space
        if (color.fn[key]) {
          return;
        }

        color.fn[key] = function (value) {
          var vtype = jQuery.type(value),
              fn = key === "alpha" ? this._hsla ? "hsla" : "rgba" : spaceName,
              local = this[fn](),
              cur = local[prop.idx],
              match;

          if (vtype === "undefined") {
            return cur;
          }

          if (vtype === "function") {
            value = value.call(this, cur);
            vtype = jQuery.type(value);
          }

          if (value == null && prop.empty) {
            return this;
          }

          if (vtype === "string") {
            match = rplusequals.exec(value);

            if (match) {
              value = cur + parseFloat(match[2]) * (match[1] === "+" ? 1 : -1);
            }
          }

          local[prop.idx] = value;
          return this[fn](local);
        };
      });
    }); // Add cssHook and .fx.step function for each named hook.
    // accept a space separated string of properties

    color.hook = function (hook) {
      var hooks = hook.split(" ");
      each(hooks, function (i, hook) {
        jQuery.cssHooks[hook] = {
          set: function (elem, value) {
            var parsed,
                curElem,
                backgroundColor = "";

            if (value !== "transparent" && (jQuery.type(value) !== "string" || (parsed = stringParse(value)))) {
              value = color(parsed || value);

              if (!support.rgba && value._rgba[3] !== 1) {
                curElem = hook === "backgroundColor" ? elem.parentNode : elem;

                while ((backgroundColor === "" || backgroundColor === "transparent") && curElem && curElem.style) {
                  try {
                    backgroundColor = jQuery.css(curElem, "backgroundColor");
                    curElem = curElem.parentNode;
                  } catch (e) {}
                }

                value = value.blend(backgroundColor && backgroundColor !== "transparent" ? backgroundColor : "_default");
              }

              value = value.toRgbaString();
            }

            try {
              elem.style[hook] = value;
            } catch (e) {// Wrapped to prevent IE from throwing errors on "invalid" values like
              // 'auto' or 'inherit'
            }
          }
        };

        jQuery.fx.step[hook] = function (fx) {
          if (!fx.colorInit) {
            fx.start = color(fx.elem, hook);
            fx.end = color(fx.end);
            fx.colorInit = true;
          }

          jQuery.cssHooks[hook].set(fx.elem, fx.start.transition(fx.end, fx.pos));
        };
      });
    };

    color.hook(stepHooks);
    jQuery.cssHooks.borderColor = {
      expand: function (value) {
        var expanded = {};
        each(["Top", "Right", "Bottom", "Left"], function (i, part) {
          expanded["border" + part + "Color"] = value;
        });
        return expanded;
      }
    }; // Basic color names only.
    // Usage of any of the other color names requires adding yourself or including
    // jquery.color.svg-names.js.

    colors = jQuery.Color.names = {
      // 4.1. Basic color keywords
      aqua: "#00ffff",
      black: "#000000",
      blue: "#0000ff",
      fuchsia: "#ff00ff",
      gray: "#808080",
      green: "#008000",
      lime: "#00ff00",
      maroon: "#800000",
      navy: "#000080",
      olive: "#808000",
      purple: "#800080",
      red: "#ff0000",
      silver: "#c0c0c0",
      teal: "#008080",
      white: "#ffffff",
      yellow: "#ffff00",
      // 4.2.3. "transparent" color keyword
      transparent: [null, null, null, 0],
      _default: "#ffffff"
    };
  })(jQuery);
  /******************************************************************************/

  /****************************** CLASS ANIMATIONS ******************************/

  /******************************************************************************/


  (function () {
    var classAnimationActions = ["add", "remove", "toggle"],
        shorthandStyles = {
      border: 1,
      borderBottom: 1,
      borderColor: 1,
      borderLeft: 1,
      borderRight: 1,
      borderTop: 1,
      borderWidth: 1,
      margin: 1,
      padding: 1
    };
    $.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (_, prop) {
      $.fx.step[prop] = function (fx) {
        if (fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr) {
          jQuery.style(fx.elem, prop, fx.end);
          fx.setAttr = true;
        }
      };
    });

    function getElementStyles(elem) {
      var key,
          len,
          style = elem.ownerDocument.defaultView ? elem.ownerDocument.defaultView.getComputedStyle(elem, null) : elem.currentStyle,
          styles = {};

      if (style && style.length && style[0] && style[style[0]]) {
        len = style.length;

        while (len--) {
          key = style[len];

          if (typeof style[key] === "string") {
            styles[$.camelCase(key)] = style[key];
          }
        } // Support: Opera, IE <9

      } else {
        for (key in style) {
          if (typeof style[key] === "string") {
            styles[key] = style[key];
          }
        }
      }

      return styles;
    }

    function styleDifference(oldStyle, newStyle) {
      var diff = {},
          name,
          value;

      for (name in newStyle) {
        value = newStyle[name];

        if (oldStyle[name] !== value) {
          if (!shorthandStyles[name]) {
            if ($.fx.step[name] || !isNaN(parseFloat(value))) {
              diff[name] = value;
            }
          }
        }
      }

      return diff;
    } // Support: jQuery <1.8


    if (!$.fn.addBack) {
      $.fn.addBack = function (selector) {
        return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
      };
    }

    $.effects.animateClass = function (value, duration, easing, callback) {
      var o = $.speed(duration, easing, callback);
      return this.queue(function () {
        var animated = $(this),
            baseClass = animated.attr("class") || "",
            applyClassChange,
            allAnimations = o.children ? animated.find("*").addBack() : animated; // Map the animated objects to store the original styles.

        allAnimations = allAnimations.map(function () {
          var el = $(this);
          return {
            el: el,
            start: getElementStyles(this)
          };
        }); // Apply class change

        applyClassChange = function () {
          $.each(classAnimationActions, function (i, action) {
            if (value[action]) {
              animated[action + "Class"](value[action]);
            }
          });
        };

        applyClassChange(); // Map all animated objects again - calculate new styles and diff

        allAnimations = allAnimations.map(function () {
          this.end = getElementStyles(this.el[0]);
          this.diff = styleDifference(this.start, this.end);
          return this;
        }); // Apply original class

        animated.attr("class", baseClass); // Map all animated objects again - this time collecting a promise

        allAnimations = allAnimations.map(function () {
          var styleInfo = this,
              dfd = $.Deferred(),
              opts = $.extend({}, o, {
            queue: false,
            complete: function () {
              dfd.resolve(styleInfo);
            }
          });
          this.el.animate(this.diff, opts);
          return dfd.promise();
        }); // Once all animations have completed:

        $.when.apply($, allAnimations.get()).done(function () {
          // Set the final class
          applyClassChange(); // For each animated element,
          // clear all css properties that were animated

          $.each(arguments, function () {
            var el = this.el;
            $.each(this.diff, function (key) {
              el.css(key, "");
            });
          }); // This is guarnteed to be there if you use jQuery.speed()
          // it also handles dequeuing the next anim...

          o.complete.call(animated[0]);
        });
      });
    };

    $.fn.extend({
      addClass: function (orig) {
        return function (classNames, speed, easing, callback) {
          return speed ? $.effects.animateClass.call(this, {
            add: classNames
          }, speed, easing, callback) : orig.apply(this, arguments);
        };
      }($.fn.addClass),
      removeClass: function (orig) {
        return function (classNames, speed, easing, callback) {
          return arguments.length > 1 ? $.effects.animateClass.call(this, {
            remove: classNames
          }, speed, easing, callback) : orig.apply(this, arguments);
        };
      }($.fn.removeClass),
      toggleClass: function (orig) {
        return function (classNames, force, speed, easing, callback) {
          if (typeof force === "boolean" || force === undefined) {
            if (!speed) {
              // Without speed parameter
              return orig.apply(this, arguments);
            } else {
              return $.effects.animateClass.call(this, force ? {
                add: classNames
              } : {
                remove: classNames
              }, speed, easing, callback);
            }
          } else {
            // Without force parameter
            return $.effects.animateClass.call(this, {
              toggle: classNames
            }, force, speed, easing);
          }
        };
      }($.fn.toggleClass),
      switchClass: function (remove, add, speed, easing, callback) {
        return $.effects.animateClass.call(this, {
          add: add,
          remove: remove
        }, speed, easing, callback);
      }
    });
  })();
  /******************************************************************************/

  /*********************************** EFFECTS **********************************/

  /******************************************************************************/


  (function () {
    if ($.expr && $.expr.filters && $.expr.filters.animated) {
      $.expr.filters.animated = function (orig) {
        return function (elem) {
          return !!$(elem).data(dataSpaceAnimated) || orig(elem);
        };
      }($.expr.filters.animated);
    }

    if ($.uiBackCompat !== false) {
      $.extend($.effects, {
        // Saves a set of properties in a data storage
        save: function (element, set) {
          var i = 0,
              length = set.length;

          for (; i < length; i++) {
            if (set[i] !== null) {
              element.data(dataSpace + set[i], element[0].style[set[i]]);
            }
          }
        },
        // Restores a set of previously saved properties from a data storage
        restore: function (element, set) {
          var val,
              i = 0,
              length = set.length;

          for (; i < length; i++) {
            if (set[i] !== null) {
              val = element.data(dataSpace + set[i]);
              element.css(set[i], val);
            }
          }
        },
        setMode: function (el, mode) {
          if (mode === "toggle") {
            mode = el.is(":hidden") ? "show" : "hide";
          }

          return mode;
        },
        // Wraps the element around a wrapper that copies position properties
        createWrapper: function (element) {
          // If the element is already wrapped, return it
          if (element.parent().is(".ui-effects-wrapper")) {
            return element.parent();
          } // Wrap the element


          var props = {
            width: element.outerWidth(true),
            height: element.outerHeight(true),
            "float": element.css("float")
          },
              wrapper = $("<div></div>").addClass("ui-effects-wrapper").css({
            fontSize: "100%",
            background: "transparent",
            border: "none",
            margin: 0,
            padding: 0
          }),
              // Store the size in case width/height are defined in % - Fixes #5245
          size = {
            width: element.width(),
            height: element.height()
          },
              active = document.activeElement; // Support: Firefox
          // Firefox incorrectly exposes anonymous content
          // https://bugzilla.mozilla.org/show_bug.cgi?id=561664

          try {
            active.id;
          } catch (e) {
            active = document.body;
          }

          element.wrap(wrapper); // Fixes #7595 - Elements lose focus when wrapped.

          if (element[0] === active || $.contains(element[0], active)) {
            $(active).trigger("focus");
          } // Hotfix for jQuery 1.4 since some change in wrap() seems to actually
          // lose the reference to the wrapped element


          wrapper = element.parent(); // Transfer positioning properties to the wrapper

          if (element.css("position") === "static") {
            wrapper.css({
              position: "relative"
            });
            element.css({
              position: "relative"
            });
          } else {
            $.extend(props, {
              position: element.css("position"),
              zIndex: element.css("z-index")
            });
            $.each(["top", "left", "bottom", "right"], function (i, pos) {
              props[pos] = element.css(pos);

              if (isNaN(parseInt(props[pos], 10))) {
                props[pos] = "auto";
              }
            });
            element.css({
              position: "relative",
              top: 0,
              left: 0,
              right: "auto",
              bottom: "auto"
            });
          }

          element.css(size);
          return wrapper.css(props).show();
        },
        removeWrapper: function (element) {
          var active = document.activeElement;

          if (element.parent().is(".ui-effects-wrapper")) {
            element.parent().replaceWith(element); // Fixes #7595 - Elements lose focus when wrapped.

            if (element[0] === active || $.contains(element[0], active)) {
              $(active).trigger("focus");
            }
          }

          return element;
        }
      });
    }

    $.extend($.effects, {
      version: "1.12.1",
      define: function (name, mode, effect) {
        if (!effect) {
          effect = mode;
          mode = "effect";
        }

        $.effects.effect[name] = effect;
        $.effects.effect[name].mode = mode;
        return effect;
      },
      scaledDimensions: function (element, percent, direction) {
        if (percent === 0) {
          return {
            height: 0,
            width: 0,
            outerHeight: 0,
            outerWidth: 0
          };
        }

        var x = direction !== "horizontal" ? (percent || 100) / 100 : 1,
            y = direction !== "vertical" ? (percent || 100) / 100 : 1;
        return {
          height: element.height() * y,
          width: element.width() * x,
          outerHeight: element.outerHeight() * y,
          outerWidth: element.outerWidth() * x
        };
      },
      clipToBox: function (animation) {
        return {
          width: animation.clip.right - animation.clip.left,
          height: animation.clip.bottom - animation.clip.top,
          left: animation.clip.left,
          top: animation.clip.top
        };
      },
      // Injects recently queued functions to be first in line (after "inprogress")
      unshift: function (element, queueLength, count) {
        var queue = element.queue();

        if (queueLength > 1) {
          queue.splice.apply(queue, [1, 0].concat(queue.splice(queueLength, count)));
        }

        element.dequeue();
      },
      saveStyle: function (element) {
        element.data(dataSpaceStyle, element[0].style.cssText);
      },
      restoreStyle: function (element) {
        element[0].style.cssText = element.data(dataSpaceStyle) || "";
        element.removeData(dataSpaceStyle);
      },
      mode: function (element, mode) {
        var hidden = element.is(":hidden");

        if (mode === "toggle") {
          mode = hidden ? "show" : "hide";
        }

        if (hidden ? mode === "hide" : mode === "show") {
          mode = "none";
        }

        return mode;
      },
      // Translates a [top,left] array into a baseline value
      getBaseline: function (origin, original) {
        var y, x;

        switch (origin[0]) {
          case "top":
            y = 0;
            break;

          case "middle":
            y = 0.5;
            break;

          case "bottom":
            y = 1;
            break;

          default:
            y = origin[0] / original.height;
        }

        switch (origin[1]) {
          case "left":
            x = 0;
            break;

          case "center":
            x = 0.5;
            break;

          case "right":
            x = 1;
            break;

          default:
            x = origin[1] / original.width;
        }

        return {
          x: x,
          y: y
        };
      },
      // Creates a placeholder element so that the original element can be made absolute
      createPlaceholder: function (element) {
        var placeholder,
            cssPosition = element.css("position"),
            position = element.position(); // Lock in margins first to account for form elements, which
        // will change margin if you explicitly set height
        // see: http://jsfiddle.net/JZSMt/3/ https://bugs.webkit.org/show_bug.cgi?id=107380
        // Support: Safari

        element.css({
          marginTop: element.css("marginTop"),
          marginBottom: element.css("marginBottom"),
          marginLeft: element.css("marginLeft"),
          marginRight: element.css("marginRight")
        }).outerWidth(element.outerWidth()).outerHeight(element.outerHeight());

        if (/^(static|relative)/.test(cssPosition)) {
          cssPosition = "absolute";
          placeholder = $("<" + element[0].nodeName + ">").insertAfter(element).css({
            // Convert inline to inline block to account for inline elements
            // that turn to inline block based on content (like img)
            display: /^(inline|ruby)/.test(element.css("display")) ? "inline-block" : "block",
            visibility: "hidden",
            // Margins need to be set to account for margin collapse
            marginTop: element.css("marginTop"),
            marginBottom: element.css("marginBottom"),
            marginLeft: element.css("marginLeft"),
            marginRight: element.css("marginRight"),
            "float": element.css("float")
          }).outerWidth(element.outerWidth()).outerHeight(element.outerHeight()).addClass("ui-effects-placeholder");
          element.data(dataSpace + "placeholder", placeholder);
        }

        element.css({
          position: cssPosition,
          left: position.left,
          top: position.top
        });
        return placeholder;
      },
      removePlaceholder: function (element) {
        var dataKey = dataSpace + "placeholder",
            placeholder = element.data(dataKey);

        if (placeholder) {
          placeholder.remove();
          element.removeData(dataKey);
        }
      },
      // Removes a placeholder if it exists and restores
      // properties that were modified during placeholder creation
      cleanUp: function (element) {
        $.effects.restoreStyle(element);
        $.effects.removePlaceholder(element);
      },
      setTransition: function (element, list, factor, value) {
        value = value || {};
        $.each(list, function (i, x) {
          var unit = element.cssUnit(x);

          if (unit[0] > 0) {
            value[x] = unit[0] * factor + unit[1];
          }
        });
        return value;
      }
    }); // Return an effect options object for the given parameters:

    function _normalizeArguments(effect, options, speed, callback) {
      // Allow passing all options as the first parameter
      if ($.isPlainObject(effect)) {
        options = effect;
        effect = effect.effect;
      } // Convert to an object


      effect = {
        effect: effect
      }; // Catch (effect, null, ...)

      if (options == null) {
        options = {};
      } // Catch (effect, callback)


      if ($.isFunction(options)) {
        callback = options;
        speed = null;
        options = {};
      } // Catch (effect, speed, ?)


      if (typeof options === "number" || $.fx.speeds[options]) {
        callback = speed;
        speed = options;
        options = {};
      } // Catch (effect, options, callback)


      if ($.isFunction(speed)) {
        callback = speed;
        speed = null;
      } // Add options to effect


      if (options) {
        $.extend(effect, options);
      }

      speed = speed || options.duration;
      effect.duration = $.fx.off ? 0 : typeof speed === "number" ? speed : speed in $.fx.speeds ? $.fx.speeds[speed] : $.fx.speeds._default;
      effect.complete = callback || options.complete;
      return effect;
    }

    function standardAnimationOption(option) {
      // Valid standard speeds (nothing, number, named speed)
      if (!option || typeof option === "number" || $.fx.speeds[option]) {
        return true;
      } // Invalid strings - treat as "normal" speed


      if (typeof option === "string" && !$.effects.effect[option]) {
        return true;
      } // Complete callback


      if ($.isFunction(option)) {
        return true;
      } // Options hash (but not naming an effect)


      if (typeof option === "object" && !option.effect) {
        return true;
      } // Didn't match any standard API


      return false;
    }

    $.fn.extend({
      effect: function ()
      /* effect, options, speed, callback */
      {
        var args = _normalizeArguments.apply(this, arguments),
            effectMethod = $.effects.effect[args.effect],
            defaultMode = effectMethod.mode,
            queue = args.queue,
            queueName = queue || "fx",
            complete = args.complete,
            mode = args.mode,
            modes = [],
            prefilter = function (next) {
          var el = $(this),
              normalizedMode = $.effects.mode(el, mode) || defaultMode; // Sentinel for duck-punching the :animated psuedo-selector

          el.data(dataSpaceAnimated, true); // Save effect mode for later use,
          // we can't just call $.effects.mode again later,
          // as the .show() below destroys the initial state

          modes.push(normalizedMode); // See $.uiBackCompat inside of run() for removal of defaultMode in 1.13

          if (defaultMode && (normalizedMode === "show" || normalizedMode === defaultMode && normalizedMode === "hide")) {
            el.show();
          }

          if (!defaultMode || normalizedMode !== "none") {
            $.effects.saveStyle(el);
          }

          if ($.isFunction(next)) {
            next();
          }
        };

        if ($.fx.off || !effectMethod) {
          // Delegate to the original method (e.g., .show()) if possible
          if (mode) {
            return this[mode](args.duration, complete);
          } else {
            return this.each(function () {
              if (complete) {
                complete.call(this);
              }
            });
          }
        }

        function run(next) {
          var elem = $(this);

          function cleanup() {
            elem.removeData(dataSpaceAnimated);
            $.effects.cleanUp(elem);

            if (args.mode === "hide") {
              elem.hide();
            }

            done();
          }

          function done() {
            if ($.isFunction(complete)) {
              complete.call(elem[0]);
            }

            if ($.isFunction(next)) {
              next();
            }
          } // Override mode option on a per element basis,
          // as toggle can be either show or hide depending on element state


          args.mode = modes.shift();

          if ($.uiBackCompat !== false && !defaultMode) {
            if (elem.is(":hidden") ? mode === "hide" : mode === "show") {
              // Call the core method to track "olddisplay" properly
              elem[mode]();
              done();
            } else {
              effectMethod.call(elem[0], args, done);
            }
          } else {
            if (args.mode === "none") {
              // Call the core method to track "olddisplay" properly
              elem[mode]();
              done();
            } else {
              effectMethod.call(elem[0], args, cleanup);
            }
          }
        } // Run prefilter on all elements first to ensure that
        // any showing or hiding happens before placeholder creation,
        // which ensures that any layout changes are correctly captured.


        return queue === false ? this.each(prefilter).each(run) : this.queue(queueName, prefilter).queue(queueName, run);
      },
      show: function (orig) {
        return function (option) {
          if (standardAnimationOption(option)) {
            return orig.apply(this, arguments);
          } else {
            var args = _normalizeArguments.apply(this, arguments);

            args.mode = "show";
            return this.effect.call(this, args);
          }
        };
      }($.fn.show),
      hide: function (orig) {
        return function (option) {
          if (standardAnimationOption(option)) {
            return orig.apply(this, arguments);
          } else {
            var args = _normalizeArguments.apply(this, arguments);

            args.mode = "hide";
            return this.effect.call(this, args);
          }
        };
      }($.fn.hide),
      toggle: function (orig) {
        return function (option) {
          if (standardAnimationOption(option) || typeof option === "boolean") {
            return orig.apply(this, arguments);
          } else {
            var args = _normalizeArguments.apply(this, arguments);

            args.mode = "toggle";
            return this.effect.call(this, args);
          }
        };
      }($.fn.toggle),
      cssUnit: function (key) {
        var style = this.css(key),
            val = [];
        $.each(["em", "px", "%", "pt"], function (i, unit) {
          if (style.indexOf(unit) > 0) {
            val = [parseFloat(style), unit];
          }
        });
        return val;
      },
      cssClip: function (clipObj) {
        if (clipObj) {
          return this.css("clip", "rect(" + clipObj.top + "px " + clipObj.right + "px " + clipObj.bottom + "px " + clipObj.left + "px)");
        }

        return parseClip(this.css("clip"), this);
      },
      transfer: function (options, done) {
        var element = $(this),
            target = $(options.to),
            targetFixed = target.css("position") === "fixed",
            body = $("body"),
            fixTop = targetFixed ? body.scrollTop() : 0,
            fixLeft = targetFixed ? body.scrollLeft() : 0,
            endPosition = target.offset(),
            animation = {
          top: endPosition.top - fixTop,
          left: endPosition.left - fixLeft,
          height: target.innerHeight(),
          width: target.innerWidth()
        },
            startPosition = element.offset(),
            transfer = $("<div class='ui-effects-transfer'></div>").appendTo("body").addClass(options.className).css({
          top: startPosition.top - fixTop,
          left: startPosition.left - fixLeft,
          height: element.innerHeight(),
          width: element.innerWidth(),
          position: targetFixed ? "fixed" : "absolute"
        }).animate(animation, options.duration, options.easing, function () {
          transfer.remove();

          if ($.isFunction(done)) {
            done();
          }
        });
      }
    });

    function parseClip(str, element) {
      var outerWidth = element.outerWidth(),
          outerHeight = element.outerHeight(),
          clipRegex = /^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto)\)$/,
          values = clipRegex.exec(str) || ["", 0, outerWidth, outerHeight, 0];
      return {
        top: parseFloat(values[1]) || 0,
        right: values[2] === "auto" ? outerWidth : parseFloat(values[2]),
        bottom: values[3] === "auto" ? outerHeight : parseFloat(values[3]),
        left: parseFloat(values[4]) || 0
      };
    }

    $.fx.step.clip = function (fx) {
      if (!fx.clipInit) {
        fx.start = $(fx.elem).cssClip();

        if (typeof fx.end === "string") {
          fx.end = parseClip(fx.end, fx.elem);
        }

        fx.clipInit = true;
      }

      $(fx.elem).cssClip({
        top: fx.pos * (fx.end.top - fx.start.top) + fx.start.top,
        right: fx.pos * (fx.end.right - fx.start.right) + fx.start.right,
        bottom: fx.pos * (fx.end.bottom - fx.start.bottom) + fx.start.bottom,
        left: fx.pos * (fx.end.left - fx.start.left) + fx.start.left
      });
    };
  })();
  /******************************************************************************/

  /*********************************** EASING ***********************************/

  /******************************************************************************/


  (function () {
    // Based on easing equations from Robert Penner (http://www.robertpenner.com/easing)
    var baseEasings = {};
    $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (i, name) {
      baseEasings[name] = function (p) {
        return Math.pow(p, i + 2);
      };
    });
    $.extend(baseEasings, {
      Sine: function (p) {
        return 1 - Math.cos(p * Math.PI / 2);
      },
      Circ: function (p) {
        return 1 - Math.sqrt(1 - p * p);
      },
      Elastic: function (p) {
        return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
      },
      Back: function (p) {
        return p * p * (3 * p - 2);
      },
      Bounce: function (p) {
        var pow2,
            bounce = 4;

        while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}

        return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
      }
    });
    $.each(baseEasings, function (name, easeIn) {
      $.easing["easeIn" + name] = easeIn;

      $.easing["easeOut" + name] = function (p) {
        return 1 - easeIn(1 - p);
      };

      $.easing["easeInOut" + name] = function (p) {
        return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn(p * -2 + 2) / 2;
      };
    });
  })();

  var effect = $.effects;
  /*!
   * jQuery UI Effects Blind 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Blind Effect
  //>>group: Effects
  //>>description: Blinds the element.
  //>>docs: http://api.jqueryui.com/blind-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectBlind = $.effects.define("blind", "hide", function (options, done) {
    var map = {
      up: ["bottom", "top"],
      vertical: ["bottom", "top"],
      down: ["top", "bottom"],
      left: ["right", "left"],
      horizontal: ["right", "left"],
      right: ["left", "right"]
    },
        element = $(this),
        direction = options.direction || "up",
        start = element.cssClip(),
        animate = {
      clip: $.extend({}, start)
    },
        placeholder = $.effects.createPlaceholder(element);
    animate.clip[map[direction][0]] = animate.clip[map[direction][1]];

    if (options.mode === "show") {
      element.cssClip(animate.clip);

      if (placeholder) {
        placeholder.css($.effects.clipToBox(animate));
      }

      animate.clip = start;
    }

    if (placeholder) {
      placeholder.animate($.effects.clipToBox(animate), options.duration, options.easing);
    }

    element.animate(animate, {
      queue: false,
      duration: options.duration,
      easing: options.easing,
      complete: done
    });
  });
  /*!
   * jQuery UI Effects Bounce 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Bounce Effect
  //>>group: Effects
  //>>description: Bounces an element horizontally or vertically n times.
  //>>docs: http://api.jqueryui.com/bounce-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectBounce = $.effects.define("bounce", function (options, done) {
    var upAnim,
        downAnim,
        refValue,
        element = $(this),
        // Defaults:
    mode = options.mode,
        hide = mode === "hide",
        show = mode === "show",
        direction = options.direction || "up",
        distance = options.distance,
        times = options.times || 5,
        // Number of internal animations
    anims = times * 2 + (show || hide ? 1 : 0),
        speed = options.duration / anims,
        easing = options.easing,
        // Utility:
    ref = direction === "up" || direction === "down" ? "top" : "left",
        motion = direction === "up" || direction === "left",
        i = 0,
        queuelen = element.queue().length;
    $.effects.createPlaceholder(element);
    refValue = element.css(ref); // Default distance for the BIGGEST bounce is the outer Distance / 3

    if (!distance) {
      distance = element[ref === "top" ? "outerHeight" : "outerWidth"]() / 3;
    }

    if (show) {
      downAnim = {
        opacity: 1
      };
      downAnim[ref] = refValue; // If we are showing, force opacity 0 and set the initial position
      // then do the "first" animation

      element.css("opacity", 0).css(ref, motion ? -distance * 2 : distance * 2).animate(downAnim, speed, easing);
    } // Start at the smallest distance if we are hiding


    if (hide) {
      distance = distance / Math.pow(2, times - 1);
    }

    downAnim = {};
    downAnim[ref] = refValue; // Bounces up/down/left/right then back to 0 -- times * 2 animations happen here

    for (; i < times; i++) {
      upAnim = {};
      upAnim[ref] = (motion ? "-=" : "+=") + distance;
      element.animate(upAnim, speed, easing).animate(downAnim, speed, easing);
      distance = hide ? distance * 2 : distance / 2;
    } // Last Bounce when Hiding


    if (hide) {
      upAnim = {
        opacity: 0
      };
      upAnim[ref] = (motion ? "-=" : "+=") + distance;
      element.animate(upAnim, speed, easing);
    }

    element.queue(done);
    $.effects.unshift(element, queuelen, anims + 1);
  });
  /*!
   * jQuery UI Effects Clip 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Clip Effect
  //>>group: Effects
  //>>description: Clips the element on and off like an old TV.
  //>>docs: http://api.jqueryui.com/clip-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectClip = $.effects.define("clip", "hide", function (options, done) {
    var start,
        animate = {},
        element = $(this),
        direction = options.direction || "vertical",
        both = direction === "both",
        horizontal = both || direction === "horizontal",
        vertical = both || direction === "vertical";
    start = element.cssClip();
    animate.clip = {
      top: vertical ? (start.bottom - start.top) / 2 : start.top,
      right: horizontal ? (start.right - start.left) / 2 : start.right,
      bottom: vertical ? (start.bottom - start.top) / 2 : start.bottom,
      left: horizontal ? (start.right - start.left) / 2 : start.left
    };
    $.effects.createPlaceholder(element);

    if (options.mode === "show") {
      element.cssClip(animate.clip);
      animate.clip = start;
    }

    element.animate(animate, {
      queue: false,
      duration: options.duration,
      easing: options.easing,
      complete: done
    });
  });
  /*!
   * jQuery UI Effects Drop 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Drop Effect
  //>>group: Effects
  //>>description: Moves an element in one direction and hides it at the same time.
  //>>docs: http://api.jqueryui.com/drop-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectDrop = $.effects.define("drop", "hide", function (options, done) {
    var distance,
        element = $(this),
        mode = options.mode,
        show = mode === "show",
        direction = options.direction || "left",
        ref = direction === "up" || direction === "down" ? "top" : "left",
        motion = direction === "up" || direction === "left" ? "-=" : "+=",
        oppositeMotion = motion === "+=" ? "-=" : "+=",
        animation = {
      opacity: 0
    };
    $.effects.createPlaceholder(element);
    distance = options.distance || element[ref === "top" ? "outerHeight" : "outerWidth"](true) / 2;
    animation[ref] = motion + distance;

    if (show) {
      element.css(animation);
      animation[ref] = oppositeMotion + distance;
      animation.opacity = 1;
    } // Animate


    element.animate(animation, {
      queue: false,
      duration: options.duration,
      easing: options.easing,
      complete: done
    });
  });
  /*!
   * jQuery UI Effects Explode 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Explode Effect
  //>>group: Effects
  // jscs:disable maximumLineLength
  //>>description: Explodes an element in all directions into n pieces. Implodes an element to its original wholeness.
  // jscs:enable maximumLineLength
  //>>docs: http://api.jqueryui.com/explode-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectExplode = $.effects.define("explode", "hide", function (options, done) {
    var i,
        j,
        left,
        top,
        mx,
        my,
        rows = options.pieces ? Math.round(Math.sqrt(options.pieces)) : 3,
        cells = rows,
        element = $(this),
        mode = options.mode,
        show = mode === "show",
        // Show and then visibility:hidden the element before calculating offset
    offset = element.show().css("visibility", "hidden").offset(),
        // Width and height of a piece
    width = Math.ceil(element.outerWidth() / cells),
        height = Math.ceil(element.outerHeight() / rows),
        pieces = []; // Children animate complete:

    function childComplete() {
      pieces.push(this);

      if (pieces.length === rows * cells) {
        animComplete();
      }
    } // Clone the element for each row and cell.


    for (i = 0; i < rows; i++) {
      // ===>
      top = offset.top + i * height;
      my = i - (rows - 1) / 2;

      for (j = 0; j < cells; j++) {
        // |||
        left = offset.left + j * width;
        mx = j - (cells - 1) / 2; // Create a clone of the now hidden main element that will be absolute positioned
        // within a wrapper div off the -left and -top equal to size of our pieces

        element.clone().appendTo("body").wrap("<div></div>").css({
          position: "absolute",
          visibility: "visible",
          left: -j * width,
          top: -i * height
        }) // Select the wrapper - make it overflow: hidden and absolute positioned based on
        // where the original was located +left and +top equal to the size of pieces
        .parent().addClass("ui-effects-explode").css({
          position: "absolute",
          overflow: "hidden",
          width: width,
          height: height,
          left: left + (show ? mx * width : 0),
          top: top + (show ? my * height : 0),
          opacity: show ? 0 : 1
        }).animate({
          left: left + (show ? 0 : mx * width),
          top: top + (show ? 0 : my * height),
          opacity: show ? 1 : 0
        }, options.duration || 500, options.easing, childComplete);
      }
    }

    function animComplete() {
      element.css({
        visibility: "visible"
      });
      $(pieces).remove();
      done();
    }
  });
  /*!
   * jQuery UI Effects Fade 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Fade Effect
  //>>group: Effects
  //>>description: Fades the element.
  //>>docs: http://api.jqueryui.com/fade-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectFade = $.effects.define("fade", "toggle", function (options, done) {
    var show = options.mode === "show";
    $(this).css("opacity", show ? 0 : 1).animate({
      opacity: show ? 1 : 0
    }, {
      queue: false,
      duration: options.duration,
      easing: options.easing,
      complete: done
    });
  });
  /*!
   * jQuery UI Effects Fold 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Fold Effect
  //>>group: Effects
  //>>description: Folds an element first horizontally and then vertically.
  //>>docs: http://api.jqueryui.com/fold-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectFold = $.effects.define("fold", "hide", function (options, done) {
    // Create element
    var element = $(this),
        mode = options.mode,
        show = mode === "show",
        hide = mode === "hide",
        size = options.size || 15,
        percent = /([0-9]+)%/.exec(size),
        horizFirst = !!options.horizFirst,
        ref = horizFirst ? ["right", "bottom"] : ["bottom", "right"],
        duration = options.duration / 2,
        placeholder = $.effects.createPlaceholder(element),
        start = element.cssClip(),
        animation1 = {
      clip: $.extend({}, start)
    },
        animation2 = {
      clip: $.extend({}, start)
    },
        distance = [start[ref[0]], start[ref[1]]],
        queuelen = element.queue().length;

    if (percent) {
      size = parseInt(percent[1], 10) / 100 * distance[hide ? 0 : 1];
    }

    animation1.clip[ref[0]] = size;
    animation2.clip[ref[0]] = size;
    animation2.clip[ref[1]] = 0;

    if (show) {
      element.cssClip(animation2.clip);

      if (placeholder) {
        placeholder.css($.effects.clipToBox(animation2));
      }

      animation2.clip = start;
    } // Animate


    element.queue(function (next) {
      if (placeholder) {
        placeholder.animate($.effects.clipToBox(animation1), duration, options.easing).animate($.effects.clipToBox(animation2), duration, options.easing);
      }

      next();
    }).animate(animation1, duration, options.easing).animate(animation2, duration, options.easing).queue(done);
    $.effects.unshift(element, queuelen, 4);
  });
  /*!
   * jQuery UI Effects Highlight 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Highlight Effect
  //>>group: Effects
  //>>description: Highlights the background of an element in a defined color for a custom duration.
  //>>docs: http://api.jqueryui.com/highlight-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectHighlight = $.effects.define("highlight", "show", function (options, done) {
    var element = $(this),
        animation = {
      backgroundColor: element.css("backgroundColor")
    };

    if (options.mode === "hide") {
      animation.opacity = 0;
    }

    $.effects.saveStyle(element);
    element.css({
      backgroundImage: "none",
      backgroundColor: options.color || "#ffff99"
    }).animate(animation, {
      queue: false,
      duration: options.duration,
      easing: options.easing,
      complete: done
    });
  });
  /*!
   * jQuery UI Effects Size 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Size Effect
  //>>group: Effects
  //>>description: Resize an element to a specified width and height.
  //>>docs: http://api.jqueryui.com/size-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectSize = $.effects.define("size", function (options, done) {
    // Create element
    var baseline,
        factor,
        temp,
        element = $(this),
        // Copy for children
    cProps = ["fontSize"],
        vProps = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"],
        hProps = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],
        // Set options
    mode = options.mode,
        restore = mode !== "effect",
        scale = options.scale || "both",
        origin = options.origin || ["middle", "center"],
        position = element.css("position"),
        pos = element.position(),
        original = $.effects.scaledDimensions(element),
        from = options.from || original,
        to = options.to || $.effects.scaledDimensions(element, 0);
    $.effects.createPlaceholder(element);

    if (mode === "show") {
      temp = from;
      from = to;
      to = temp;
    } // Set scaling factor


    factor = {
      from: {
        y: from.height / original.height,
        x: from.width / original.width
      },
      to: {
        y: to.height / original.height,
        x: to.width / original.width
      }
    }; // Scale the css box

    if (scale === "box" || scale === "both") {
      // Vertical props scaling
      if (factor.from.y !== factor.to.y) {
        from = $.effects.setTransition(element, vProps, factor.from.y, from);
        to = $.effects.setTransition(element, vProps, factor.to.y, to);
      } // Horizontal props scaling


      if (factor.from.x !== factor.to.x) {
        from = $.effects.setTransition(element, hProps, factor.from.x, from);
        to = $.effects.setTransition(element, hProps, factor.to.x, to);
      }
    } // Scale the content


    if (scale === "content" || scale === "both") {
      // Vertical props scaling
      if (factor.from.y !== factor.to.y) {
        from = $.effects.setTransition(element, cProps, factor.from.y, from);
        to = $.effects.setTransition(element, cProps, factor.to.y, to);
      }
    } // Adjust the position properties based on the provided origin points


    if (origin) {
      baseline = $.effects.getBaseline(origin, original);
      from.top = (original.outerHeight - from.outerHeight) * baseline.y + pos.top;
      from.left = (original.outerWidth - from.outerWidth) * baseline.x + pos.left;
      to.top = (original.outerHeight - to.outerHeight) * baseline.y + pos.top;
      to.left = (original.outerWidth - to.outerWidth) * baseline.x + pos.left;
    }

    element.css(from); // Animate the children if desired

    if (scale === "content" || scale === "both") {
      vProps = vProps.concat(["marginTop", "marginBottom"]).concat(cProps);
      hProps = hProps.concat(["marginLeft", "marginRight"]); // Only animate children with width attributes specified
      // TODO: is this right? should we include anything with css width specified as well

      element.find("*[width]").each(function () {
        var child = $(this),
            childOriginal = $.effects.scaledDimensions(child),
            childFrom = {
          height: childOriginal.height * factor.from.y,
          width: childOriginal.width * factor.from.x,
          outerHeight: childOriginal.outerHeight * factor.from.y,
          outerWidth: childOriginal.outerWidth * factor.from.x
        },
            childTo = {
          height: childOriginal.height * factor.to.y,
          width: childOriginal.width * factor.to.x,
          outerHeight: childOriginal.height * factor.to.y,
          outerWidth: childOriginal.width * factor.to.x
        }; // Vertical props scaling

        if (factor.from.y !== factor.to.y) {
          childFrom = $.effects.setTransition(child, vProps, factor.from.y, childFrom);
          childTo = $.effects.setTransition(child, vProps, factor.to.y, childTo);
        } // Horizontal props scaling


        if (factor.from.x !== factor.to.x) {
          childFrom = $.effects.setTransition(child, hProps, factor.from.x, childFrom);
          childTo = $.effects.setTransition(child, hProps, factor.to.x, childTo);
        }

        if (restore) {
          $.effects.saveStyle(child);
        } // Animate children


        child.css(childFrom);
        child.animate(childTo, options.duration, options.easing, function () {
          // Restore children
          if (restore) {
            $.effects.restoreStyle(child);
          }
        });
      });
    } // Animate


    element.animate(to, {
      queue: false,
      duration: options.duration,
      easing: options.easing,
      complete: function () {
        var offset = element.offset();

        if (to.opacity === 0) {
          element.css("opacity", from.opacity);
        }

        if (!restore) {
          element.css("position", position === "static" ? "relative" : position).offset(offset); // Need to save style here so that automatic style restoration
          // doesn't restore to the original styles from before the animation.

          $.effects.saveStyle(element);
        }

        done();
      }
    });
  });
  /*!
   * jQuery UI Effects Scale 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Scale Effect
  //>>group: Effects
  //>>description: Grows or shrinks an element and its content.
  //>>docs: http://api.jqueryui.com/scale-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectScale = $.effects.define("scale", function (options, done) {
    // Create element
    var el = $(this),
        mode = options.mode,
        percent = parseInt(options.percent, 10) || (parseInt(options.percent, 10) === 0 ? 0 : mode !== "effect" ? 0 : 100),
        newOptions = $.extend(true, {
      from: $.effects.scaledDimensions(el),
      to: $.effects.scaledDimensions(el, percent, options.direction || "both"),
      origin: options.origin || ["middle", "center"]
    }, options); // Fade option to support puff

    if (options.fade) {
      newOptions.from.opacity = 1;
      newOptions.to.opacity = 0;
    }

    $.effects.effect.size.call(this, newOptions, done);
  });
  /*!
   * jQuery UI Effects Puff 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Puff Effect
  //>>group: Effects
  //>>description: Creates a puff effect by scaling the element up and hiding it at the same time.
  //>>docs: http://api.jqueryui.com/puff-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectPuff = $.effects.define("puff", "hide", function (options, done) {
    var newOptions = $.extend(true, {}, options, {
      fade: true,
      percent: parseInt(options.percent, 10) || 150
    });
    $.effects.effect.scale.call(this, newOptions, done);
  });
  /*!
   * jQuery UI Effects Pulsate 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Pulsate Effect
  //>>group: Effects
  //>>description: Pulsates an element n times by changing the opacity to zero and back.
  //>>docs: http://api.jqueryui.com/pulsate-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectPulsate = $.effects.define("pulsate", "show", function (options, done) {
    var element = $(this),
        mode = options.mode,
        show = mode === "show",
        hide = mode === "hide",
        showhide = show || hide,
        // Showing or hiding leaves off the "last" animation
    anims = (options.times || 5) * 2 + (showhide ? 1 : 0),
        duration = options.duration / anims,
        animateTo = 0,
        i = 1,
        queuelen = element.queue().length;

    if (show || !element.is(":visible")) {
      element.css("opacity", 0).show();
      animateTo = 1;
    } // Anims - 1 opacity "toggles"


    for (; i < anims; i++) {
      element.animate({
        opacity: animateTo
      }, duration, options.easing);
      animateTo = 1 - animateTo;
    }

    element.animate({
      opacity: animateTo
    }, duration, options.easing);
    element.queue(done);
    $.effects.unshift(element, queuelen, anims + 1);
  });
  /*!
   * jQuery UI Effects Shake 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Shake Effect
  //>>group: Effects
  //>>description: Shakes an element horizontally or vertically n times.
  //>>docs: http://api.jqueryui.com/shake-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectShake = $.effects.define("shake", function (options, done) {
    var i = 1,
        element = $(this),
        direction = options.direction || "left",
        distance = options.distance || 20,
        times = options.times || 3,
        anims = times * 2 + 1,
        speed = Math.round(options.duration / anims),
        ref = direction === "up" || direction === "down" ? "top" : "left",
        positiveMotion = direction === "up" || direction === "left",
        animation = {},
        animation1 = {},
        animation2 = {},
        queuelen = element.queue().length;
    $.effects.createPlaceholder(element); // Animation

    animation[ref] = (positiveMotion ? "-=" : "+=") + distance;
    animation1[ref] = (positiveMotion ? "+=" : "-=") + distance * 2;
    animation2[ref] = (positiveMotion ? "-=" : "+=") + distance * 2; // Animate

    element.animate(animation, speed, options.easing); // Shakes

    for (; i < times; i++) {
      element.animate(animation1, speed, options.easing).animate(animation2, speed, options.easing);
    }

    element.animate(animation1, speed, options.easing).animate(animation, speed / 2, options.easing).queue(done);
    $.effects.unshift(element, queuelen, anims + 1);
  });
  /*!
   * jQuery UI Effects Slide 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Slide Effect
  //>>group: Effects
  //>>description: Slides an element in and out of the viewport.
  //>>docs: http://api.jqueryui.com/slide-effect/
  //>>demos: http://jqueryui.com/effect/

  var effectsEffectSlide = $.effects.define("slide", "show", function (options, done) {
    var startClip,
        startRef,
        element = $(this),
        map = {
      up: ["bottom", "top"],
      down: ["top", "bottom"],
      left: ["right", "left"],
      right: ["left", "right"]
    },
        mode = options.mode,
        direction = options.direction || "left",
        ref = direction === "up" || direction === "down" ? "top" : "left",
        positiveMotion = direction === "up" || direction === "left",
        distance = options.distance || element[ref === "top" ? "outerHeight" : "outerWidth"](true),
        animation = {};
    $.effects.createPlaceholder(element);
    startClip = element.cssClip();
    startRef = element.position()[ref]; // Define hide animation

    animation[ref] = (positiveMotion ? -1 : 1) * distance + startRef;
    animation.clip = element.cssClip();
    animation.clip[map[direction][1]] = animation.clip[map[direction][0]]; // Reverse the animation if we're showing

    if (mode === "show") {
      element.cssClip(animation.clip);
      element.css(ref, animation[ref]);
      animation.clip = startClip;
      animation[ref] = startRef;
    } // Actually animate


    element.animate(animation, {
      queue: false,
      duration: options.duration,
      easing: options.easing,
      complete: done
    });
  });
  /*!
   * jQuery UI Effects Transfer 1.12.1
   * http://jqueryui.com
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
  //>>label: Transfer Effect
  //>>group: Effects
  //>>description: Displays a transfer effect from one element to another.
  //>>docs: http://api.jqueryui.com/transfer-effect/
  //>>demos: http://jqueryui.com/effect/

  var effect;

  if ($.uiBackCompat !== false) {
    effect = $.effects.define("transfer", function (options, done) {
      $(this).transfer(options, done);
    });
  }

  var effectsEffectTransfer = effect;
});
(function ($) {
  jQuery(document).ready(function () {
    // Sticky header
    $(window).scroll(function () {
      if ($(this).scrollTop() > 10) {
        $('#top-bar').addClass("sticky");
      } else {
        $('#top-bar').removeClass("sticky");
      }
    }); // Sticky header

    $(window).scroll(function () {
      if ($(this).scrollTop() > 10) {
        $('#case-header .overlay .container .hero-caption').addClass("title-up");
      } else {
        $('#case-header .overlay .container .hero-caption').removeClass("title-up");
      }
    }); // Sticky header

    $(window).scroll(function () {
      if ($(this).scrollTop() > 10) {
        $('#case-header .shape').addClass("shape-up");
      } else {
        $('#case-header .shape').removeClass("shape-up");
      }
    }); // $(document).ready(function(){
    //     $(this).scrollTop(0);
    // });

    $(document).ready(function () {
      if ($(window).scrollTop() !== 0) {
        $('#top-nav').addClass("sticky");
      }
    });
    $('#partners-slider').slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      responsive: [{
        breakpoint: 1000,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      }, {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }, {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      } // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
      ]
    });
    $('#reviews-slider').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: false,
      adaptiveHeight: true
    });
    $('#hero-slider').slick({
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: false,
      arrows: false,
      dots: true,
      appendDots: ".slide-nav",
      responsive: [{
        breakpoint: 480,
        settings: {
          adaptiveHeight: true
        }
      }]
    });
    $('#blog-slider').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      appendDots: $(".dots-container")
    });
    $(function () {
      $('#btn-up').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

          if (target.length) {
            $('html, body').animate({
              scrollTop: target.offset().top - 97
            }, 1000);
            return false;
          }
        }
      });
    });
    $(function () {
      $('#case-single footer .btn-up').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

          if (target.length) {
            $('html, body').animate({
              scrollTop: target.offset().top - 100
            }, 1000);
            return false;
          }
        }
      });
    });
    $(function () {
      $('#to-top a').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

          if (target.length) {
            $('html, body').animate({
              scrollTop: target.offset().top - 100
            }, 1000);
            return false;
          }
        }
      });
    }); // modal script

    setTimeout(function () {
      jQuery('.modal-overlay').addClass('show');
    }, 1000);
    $('.sign-btn a, .feature-card a.more-btn').click(function (e) {
      var myEm = $(this).attr('data-my-element');
      var modal = $('.modal-overlay[data-my-element = ' + myEm + '], .modal[data-my-element = ' + myEm + ']');
      e.preventDefault();
      modal.addClass('active');
      $('html').addClass('fixed');
    });
    $('.close-modal').click(function () {
      var modal = $('.modal-overlay, .modal');
      $('html').removeClass('fixed');
      modal.removeClass('active');
    });
    $(function () {
      $('#featured .featured-card .featured-desc').matchHeight();
      $('#featured .featured-card .featured-desc p').matchHeight(); // $('#blog-listing .container .articles .row .grid-item .blog-card .blog-inner .blog-desc h3').matchHeight();

      $('#organization .org-card .org-text').matchHeight(); // $('#case-stories .case-listing .case-card .case-desc h2').matchHeight();

      $('#case-stories .case-listing .case-card .case-desc p').matchHeight();
      $('#case-stories .case-listing .case-card').matchHeight();
    });
    $("span:contains('Infuse')").addClass('cat-infuse');
    $("span:contains('Unlock')").addClass('cat-unlock'); // Menu

    $('#mobile-menu--btn a').click(function () {
      $('.main-menu-sidebar').toggleClass("menu-active");
      $('.menu-overlay').addClass("active-overlay");
      $(this).toggleClass('open');
    }); // Menu

    $('.close-menu-btn').click(function () {
      $('.main-menu-sidebar').removeClass("menu-active");
      $('.menu-overlay').removeClass("active-overlay");
    });
    $(function () {
      var menu_ul = $('.nav-links > li.has-menu  ul'),
          menu_a = $('.nav-links > li.has-menu  small');
      menu_ul.hide();
      menu_a.click(function (e) {
        e.preventDefault();

        if (!$(this).hasClass('active')) {
          menu_a.removeClass('active');
          menu_ul.filter(':visible').slideUp('normal');
          $(this).addClass('active').next().stop(true, true).slideDown('normal');
        } else {
          $(this).removeClass('active');
          $(this).next().stop(true, true).slideUp('normal');
        }
      });
    });
    $(".nav-links > li.has-menu  small ").attr("href", "javascript:;");
    var $menu = $('#menu');
    $(document).mouseup(function (e) {
      if (!$menu.is(e.target) // if the target of the click isn't the container...
      && $menu.has(e.target).length === 0) // ... nor a descendant of the container
        {
          $menu.removeClass('menu-active');
          $('.menu-overlay').removeClass("active-overlay");
        }
    });
    $(document).ready(function () {
      $("#faq-accordion .set > a.accordion-heading").on("click", function (e) {
        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          $(this).siblings("#faq-accordion .content").slideUp(200);
        } else {
          $("#faq-accordion .set > a.accordion-heading").removeClass("active");
          $(this).addClass("active");
          $("#faq-accordion .content").slideUp(200);
          $(this).siblings("#faq-accordion .content").slideDown(200);
        }

        e.preventDefault();
      });
    });
  });
})(jQuery);