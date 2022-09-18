import '../scss/owl.carousel.scss';
import '../scss/main.scss';
import '../index.pug';
import $ from "jquery";
import 'owl.carousel';
import mainImage from '../img/sprite.svg';
require('fancybox')($);

$(document).ready(function() {

  $(function() {
    $('ul.rout-tabs__caption').on('click', 'li:not(.active)', function() {
      $(this).addClass('active').siblings().removeClass('active')
        .closest('div.rout-tabs').find('div.rout-tabs__content').removeClass('active').eq($(this).index()).addClass('active');
    })
  });

  $('.walks-carousel').owlCarousel({
    loop:true,
    items:3,
    margin:20,
    nav:true,
    center:true,
    responsive:{
      0:{
          items:1
      },
      600:{
          items:1
      },
      800:{
          items:3
      }
  }
  });

  $('.carousel-gallery').owlCarousel({
    loop:true,
    items:4,
    margin:0,
    responsive:{
      0:{
          items:2
      },
      600:{
          items:2
      },
      800:{
          items:4
      }
  }
  });

  $('.fancybox').fancybox();

  $('.top-menu a').click(function () {
    let elementClick = $(this).attr('href');
    let destination = $(elementClick).offset().top;
    $('body,html').animate({scrollTop: destination }, 1400);
  });

  $( ".faq__question" ).click(function() {
    $( this ).next(".faq__answer").fadeToggle();
    $( this ).toggleClass("open");
  });

  $( ".burger" ).click(function() {
    $( ".top-menu ul" ).fadeToggle();
    $( this ).toggleClass("open");
  });



  let sections = $('section'),
  nav = $('nav'),
  nav_height = nav.outerHeight();

  $(window).on('scroll', function () {
    let cur_pos = $(this).scrollTop();
    
    sections.each(function() {
      let top = $(this).offset().top - nav_height,
          bottom = top + $(this).outerHeight();
      
      if (cur_pos >= top && cur_pos <= bottom) {
        nav.find('a').removeClass('active');
        sections.removeClass('active');
        
        $(this).addClass('active');
        nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
      }
    });
  });

  nav.find('a').on('click', function () {
    let $el = $(this), id = $el.attr('href');
    
    $('html, body').animate({
      scrollTop: $(id).offset().top - nav_height
    }, 500);
    
    return false;
  });

  $(window).scroll(function(){
    if($(this).scrollTop()>140){
        $('.top-header').addClass('fixed');
        $('header').addClass('header-fixed');
    }
    else if ($(this).scrollTop()<140){
        $('.top-header').removeClass('fixed');
        $('header').removeClass('header-fixed');
    }
  });

  let $window = $(document).width();

  $('.top-menu a').click(function () {

    if ($window < 992) {
        $('.top-menu ul').fadeOut();
        $( '.burger' ).toggleClass("open");
    }

  });


});


