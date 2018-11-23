import i18next from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import locI18next from "loc-i18next";
import en from "./localize/en.js";
import ru from "./localize/ru.js";

let autoresize;

document.onkeydown = function (evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
    isEscape = (evt.key == "Escape" || evt.key == "Esc");
  } else {
    isEscape = (evt.keyCode == 27);
  }
  if (isEscape) {
    // console.log("Escape");
    timePadClose.click();
    popupOut.click();
  }
};

i18next
  .use(LngDetector)
  .init({
      debug: true,
      resources: {
        en: en,
        ru: ru
      },
    },
    function (err, t) {
      let localize = locI18next.init(i18next);

      $('[data-i18n]').each((key, value) => {
        let a = value.getAttribute('data-i18n');
        // value.innerText = i18next.t(a)
        // console.log(value);
        // console.log(value.childNodes[0]);
        if (value.childNodes[0]) {
          value.innerHTML = i18next.t(a);
        }

        // var cache = value.children();
        // value.text(i18next.t(a)).append(cache);
      });
    });

let lng = $('.header__language');
let infoPartnersButtonBackground = $('.become_a_partner .partners-list__img');
lng.click(function (e) {
  i18next.changeLanguage(i18next.language === 'en' ? 'ru' : 'en');
  $('[data-i18n]').each((key, value) => {
    let a = value.getAttribute('data-i18n');
    if (value.childNodes[0]) {
      value.innerHTML = i18next.t(a);
    }
  });
  //autoresize(); // error: "autoresize is not a function"
  $('.form__area').attr('placeholder', i18next.language === 'ru' ? 'Электропочта' : 'email');
  infoPartnersButtonBackground.css('background-image', i18next.language === 'ru' ? 'url(dist/static/become_partners_ru.svg)' : 'url(dist/static/become_partners_en.svg)');
});

infoPartnersButtonBackground.css('background-image', (i18next.language === 'ru' || i18next.language === 'ru-RU') ? 'url(dist/static/become_partners_ru.svg)' : 'url(dist/static/become_partners_en.svg)');

let customPlay = $('.play_button');
let videoContainer = $('.video-container');
let playerClose = $('#playerClose');


customPlay.click(function () {
  event.preventDefault();
  videoContainer.addClass('visible');
  $('#player')[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
});

playerClose.click(function () {
  videoContainer.removeClass('visible');
  $('#player')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
});

let shedulePlayVideoLihk = $('.lightbox-button');

shedulePlayVideoLihk.click(function () {
  event.preventDefault();
  console.log($(this));
  const videoContainer =  $(this).parent().siblings(".video-container");
  const video = videoContainer.find('.video-container__video');
  const closeVideo = videoContainer.find('.video-container__control');
  videoContainer.addClass('visible');
  video[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
  closeVideo.click(function () {
    videoContainer.removeClass('visible');
    video[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
  });
});

let burger = $('.sidebar__burger');
let aboutButtons = $('.about-conf-button');
let speakersButtons = $('.speakers_button');
let scheduleButtons = $('.schedule_button');
let contactButtons = $('.contact_button');
let mapButtons = $('.map_button');
let buyTicket = $('.js_buy-ticket-button');
let asideMenu = $('.aside_menu');
let arrow = $('.sidebar__arrow');
let header = $('.header');
let currentPage = 1;

burger.click(function () {
  asideMenu.toggleClass('hidden')
  burger.toggleClass('active')

});

function onFullpage() {

  $('#fullpage').fullpage({
    menu: '#menuPage',
    lockAnchors: false,
    anchors: ['firstPage',
      'topics',
      'speakers',
      'schedule',
      'sponsors',
      'partners',
      'infopartners',
      'map',
      'thirdPage'],
    responsiveWidth: 768,
    responsiveAutoHeight: 1000,
    slidesNavPosition: "",

    //Scrolling
    css3: true,
    scrollingSpeed: 600,
    autoScrolling: true,
    fitToSection: true,
    fitToSectionDelay: 500,
    scrollBar: true,
    easing: 'easeInOutCubic',
    easingcss3: 'ease',
    // loopBottom: true,
    // loopTop: false,
    loopHorizontal: true,
    continuousVertical: false,
    continuousHorizontal: false,
    scrollHorizontally: false,
    interlockedSlides: false,
    dragAndMove: false,
    offsetSections: false,
    resetSliders: false,
    fadingEffect: false,
    // normalScrollElements: '.schedule-page',
    scrollOverflow: false,
    scrollOverflowOptions: null,
    touchSensitivity: 15,
    normalScrollElementTouchThreshold: 5,
    bigSectionsDestination: null,

    //Accessibility
    keyboardScrolling: true,
    animateAnchor: false,
    recordHistory: true,

    //Design
    slidesNavigation: true,
    controlArrows: true,
    verticalCentered: false,
    lazyLoading: true,
    onLeave: function (index, nextIndex, direction) {
      $.fn.fullpage.setAllowScrolling(true);
      // console.log("onLeave: " + "index: " + index + " nextIndex: " + nextIndex + " direction: " +  direction);
      currentPage = nextIndex;

      if (nextIndex != 1) {
        header.addClass('active');
        burger.removeClass('hidden');
        // burgerInput.removeClass('hidden');
      } else if (nextIndex === 1) {
        header.removeClass('active');
        burger.addClass('hidden');
        burger.removeClass('active');
        asideMenu.addClass('hidden');

      }
      if (nextIndex != 9) {
        arrow.removeClass('sidebar__arrow-up');
        $('.section').eq(1).removeClass('visible');
      } else {
        arrow.addClass('sidebar__arrow-up');
        $('.section').eq(1).addClass('visible');

      }

    }
  });

}

onFullpage();

$('[data-menuanchor]').on('click', function (e, i) {
  let aim = $(this)[0].getAttribute('data-menuanchor');
  $.fn.fullpage.moveTo(aim);
});


arrow.click(function () {
  if (currentPage < 9) {
    $.fn.fullpage.moveSectionDown();
  } else {
    $.fn.fullpage.moveTo(1);
  }
});

aboutButtons.on('click', function () {
  asideMenu.addClass('hidden');
  burger.removeClass('active');
  // $.fn.fullpage.moveTo('topics');
});
speakersButtons.on('click', function () {
  asideMenu.addClass('hidden');
  burger.removeClass('active');
  // $.fn.fullpage.moveTo('speakers');
});
scheduleButtons.on('click', function () {
  asideMenu.addClass('hidden');
  burger.removeClass('active');
  // $.fn.fullpage.moveTo('schedule');
});
mapButtons.on('click', function () {
  asideMenu.addClass('hidden');
  burger.removeClass('active');
  $.fn.fullpage.moveTo('map');
});
contactButtons.on('click', function () {
  asideMenu.addClass('hidden');
  burger.removeClass('active');
  $.fn.fullpage.moveTo('thirdPage');
});

function noscroll(e) {
  e.preventDefault();
  window.onscroll = function (e) {
    e.preventDefault();
  }
}

//TIMEPAD popup

buyTicket.on('click', function () {
  asideMenu.addClass('hidden');
  burger.removeClass('active');
  $('.timepad-popup').addClass('visible');
  //$.fn.fullpage.moveTo('firstPage');
  $.fn.fullpage.setAutoScrolling(false);
  // disableScroll();
  $('body').css("overflow", "hidden");
  if (window.pavrTimer) {
    window.pavrTimer.pause();
  }
});

let timePadClose = $('.timepad-popup__control');
timePadClose.click(function () {
  $('.timepad-popup').removeClass('visible');
  $.fn.fullpage.setMouseWheelScrolling(true);
  $.fn.fullpage.setAutoScrolling(true);

  if (window.pavrTimer) {
    window.pavrTimer.resume();
  }

});


let popupMove = function ($popup) {
  let speaker = $popup.parent();
  let photoWrapper = speaker.find('.speaker__photo');
  let img = speaker.find('.speaker__image')[0];
  let bounds = img.getBoundingClientRect();
  let left = bounds.left;
  let right = $(window).width() - bounds.right;
  let top = bounds.top;
  let bottom = $(window).height() - bounds.bottom;
  let popupDescr = $popup.find('.popup__descr');
  popupDescr.removeAttr('style');
  photoWrapper.removeClass('brdMoveR brdMoveL brdMoveB brdMoveT');
  popupDescr.removeClass('alignRight');
  if (right > left) {
    popupDescr.css('left', bounds.right);
    popupDescr.css('width', right - 100);
    photoWrapper.addClass('brdMoveL')
  } else {
    popupDescr.css('width', left - 100);
    popupDescr.css('right', $(window).width() - bounds.left + 20);
    popupDescr.addClass('alignRight');
    photoWrapper.addClass('brdMoveR');
  }

  if (top > bottom) {
    popupDescr.css('bottom', bottom);
    photoWrapper.addClass('brdMoveB');
  } else {
    popupDescr.css('top', bounds.top);
    photoWrapper.addClass('brdMoveT');

  }
  let pos = $popup[0].getBoundingClientRect();
  if ($(window).width() > 545) {
    $popup.css('top', -pos.top);
    $popup.css('left', -pos.left);
  }
};

let popupOut = $('.popupOut');
popupOut.on('click', function (i, d) {
  let popup = $(this).closest('.popup');
  let slides = $('.speakers .fp-slides');
  let speaker = popup.parent();
  speaker.removeClass('active');
  slides.css('overflow', 'hidden');
  $('.fp-controlArrow').css('visibility', 'visible');
  $('.sidebar').css('z-index', '10');
  popupMove(popup);

  if(window.pavrTimer){
    window.pavrTimer.resume();
  }

});
let speakerPhoto = $('.speaker__photo');
speakerPhoto.on('click', function (i, d) {
  let popup = $(this).siblings('.popup');
  let slides = $('.speakers .fp-slides');
  $('.fp-controlArrow').css('visibility', 'hidden');
  $('.sidebar').css('z-index', '0');
  if (popup.is(":visible")) {
    slides.css('overflow', 'hidden');
    $('.fp-controlArrow').css('visibility', 'visible');
    $('.sidebar').css('z-index', '10');
  } else {
    slides.css('overflow', 'visible');

  }
  let speaker = $(this).parent();
  speaker.toggleClass('active');

  popupMove(popup);
  if (window.pavrTimer) {
    window.pavrTimer.pause();
  }

});

let popups = $('.popup');
$(window).on('resize', function () {
  popups.each(function (e) {
    popupMove($(this));
  })
})


let controls = $('.popup__control');
controls.on('click', function () {
  $(this).toggleClass('active');

  if ($(this).hasClass('active')) {
    $(this).siblings(".popup__descr").slideDown(400);
  } else {
    $(this).siblings(".popup__descr").slideUp(400);
  }

});

$('.form').submit(function (e) {
  e.preventDefault();
  // console.log(e);
  let form = $('.email_form');
  form.removeClass('success error');

  let value = $(".form__area").val();

  // console.log(value);


  $.ajax({
    url: "/dist/static/mail.php",
    data: {
      email: value
    },
    method: 'POST',
    dataType: 'json',
    success: function (answer) {
      // console.log(data);
      // let answer = JSON.parse(data);
      // console.log(answer);
      if (answer.result === "ok") {
        form.addClass('success');
      } else {
        form.addClass('error');
      }
    },
    error: function (jqxhr) {
      form.addClass('error');
    }
  });


});


!(function (t, e, s, i) {
  "use strict";

  function n(e, s) {
    (this.element = e),
      (this.settings = t.extend({}, a, s)),
      (this._defaults = a),
      (this._name = r),
      this.init();
  }

  var r = "_Glitch",
    a = {
      destroy: !1,
      glitch: !0,
      scale: !0,
      blend: !0,
      blendModeType: "hue",
      glitch1TimeMin: 600,
      glitch1TimeMax: 900,
      glitch2TimeMin: 10,
      glitch2TimeMax: 115,
      zIndexStart: 5
    };
  t.extend(n.prototype, {
    init: function () {
      this.glitch();
    },
    glitch: function () {
      function e(t, e) {
        return Math.floor(Math.random() * (e - t + 1)) + t;
      }

      function s() {
        var i = e(10, 1900),
          n = 9999,
          a = e(10, 1300),
          o = 0,
          h = e(0, 16),
          f = e(0, 16),
          d = e(c, l);
        t(r).css({
          clip: "rect(" + i + "px, " + n + "px, " + a + "px," + o + "px)",
          right: f,
          left: h
        }),
          setTimeout(s, d);
      }

      function i() {
        var s = e(10, 1900),
          n = 9999,
          c = e(10, 1300),
          l = 0,
          f = e(0, 40),
          d = e(0, 40),
          m = e(o, h);
        if (a === !0) var x = (Math.random() * (1.1 - 0.9) + 0.9).toFixed(2);
        else if (a === !1) var x = 1;
        t(r)
          .next()
          .css({
            clip: "rect(" + s + "px, " + n + "px, " + c + "px," + l + "px)",
            left: f,
            right: d,
            "-webkit-transform": "scale(" + x + ")",
            "-ms-transform": "scale(" + x + ")",
            transform: "scale(" + x + ")"
          }),
          setTimeout(i, m);
      }

      function n() {
        var s = e(10, 1900),
          i = 9999,
          c = e(10, 1300),
          l = 0,
          f = e(0, 40),
          d = e(0, 40),
          m = e(o, h);
        if (a === !0) var x = (Math.random() * (1.1 - 0.9) + 0.9).toFixed(2);
        else if (a === !1) var x = 1;
        t(r)
          .next()
          .next()
          .css({
            clip: "rect(" + s + "px, " + i + "px, " + c + "px," + l + "px)",
            left: f,
            right: d,
            "-webkit-transform": "scale(" + x + ")",
            "-ms-transform": "scale(" + x + ")",
            transform: "scale(" + x + ")"
          }),
          setTimeout(n, m);
      }

      var r = this.element,
        a = this.settings.scale,
        c = this.settings.glitch1TimeMin,
        l = this.settings.glitch1TimeMax,
        o = this.settings.glitch2TimeMin,
        h = this.settings.glitch2TimeMax,
        f = this.settings.zIndexStart;
      if (this.settings.destroy === !0)
        (t(r).hasClass("el-front-1") ||
          t(r).hasClass("front-3") ||
          t(r).hasClass("front-2")) &&
        t(".front-1, .front-2, .front-3").remove(),
          t(".back").removeClass("back");
      else if (this.settings.destroy === !1) {
        var d = t(r).clone();
        if (
          (d
            .insertBefore(r)
            .addClass("back")
            .css({"z-index": f}),
          this.settings.blend === !0)
        ) {
          var d = t(r).clone();
          d
            .insertAfter(r)
            .addClass("front-3")
            .css({
              "z-index": f + 3,
              "mix-blend-mode": this.settings.blendModeType
            }),
            n();
        }
        if (this.settings.glitch === !0) {
          var d = t(r).clone();
          d
            .insertAfter(r)
            .addClass("front-2")
            .css({"z-index": f + 2}),
            t(".back")
              .next()
              .addClass("front-1")
              .css({"z-index": f + 1}),
            s(),
            i();
        }
      }
    }
  }),
    (t.fn[r] = function (t) {
      return this.each(function () {
        new n(this, t);
      });
    });
})(jQuery, window, document);

let topics = $(".topic");
topics.on({
  mouseenter: function () {
    // console.log($('.topic__image', this));
    // console.log('mouseenter');

    $('.topic__image', this)._Glitch({
      destroy: !1,
      glitch: !0,
      scale: !0,
      blend: !0,
      blendModeType: "hue",
      glitch1TimeMin: 300,
      glitch1TimeMax: 500,
      glitch2TimeMin: 110,
      glitch2TimeMax: 1100
    });
  },
  mouseout: function () {
    // console.log('mouseout');
    $('.topic__image', this)._Glitch({
      destroy: !0
    });

  }
});

function setSchedulePage() {

  // let eventBtns = $('.event__btn');
  // let eventList = $('.event-list');
  // let eventToggles = $('.event__toggle');
  // let mapImg = document.getElementById('mapImg');

  // let eventButtons = document.querySelectorAll('.event__toggle, .event__btn');
  // //let eventListOne = document.querySelectorAll('.event-list')[0];
  // let eventLists = document.querySelectorAll('.event-list')

  // mapImg.addEventListener("wheel", function (e) {
  //     e.preventDefault();
  //     e.stopPropagation()
  //     //$.fn.fullpage.setAllowScrolling(false);
  // });
  // function eventListsHeight() {
  //     eventLists.forEach(function (item, i, arr) {
  //         item.parentNode.setAttribute("class", "event event_active");

  //         let elementsHeight = [...item.querySelectorAll('li')].reduce((sum, current) => {
  //             return sum + current.offsetHeight
  //         }, 0);
  //         item.style.height = elementsHeight + 30 + "px";
  //     });
  // }
  // eventListsHeight();

  // function eventListsHeightResize() {
  //     eventLists.forEach(function (item, i, arr) {
  //         //item.parentNode.setAttribute("class", "event event_active");

  //         if(item.parentNode.classList.contains("event_active")) {
  //             let elementsHeight = [...item.querySelectorAll('li')].reduce((sum, current) => {
  //                 return sum + current.offsetHeight
  //             }, 0);
  //             item.style.height = elementsHeight + 30 + "px";
  //         }
  //     });
  // }
  // autoresize = eventListsHeightResize;
  // window.addEventListener("resize", eventListsHeightResize);
  // //eventListOne.parentNode.setAttribute("class", "event event_active");


  // eventButtons.forEach(function (item, i, arr) {

  //     item.addEventListener("click", function (e) {

  //         let eventList = this.parentNode.querySelector('.event-list');

  //         if (!this.parentNode.classList.contains("event_active")) {
  //             this.parentNode.classList.add("event_active");

  //             let elementsHeight = [...eventList.querySelectorAll('li')].reduce((sum, current) => {
  //                 return sum + current.offsetHeight
  //             }, 0);
  //             eventList.style.height = elementsHeight + 30 + "px";


  //         } else {
  //             this.parentNode.classList.remove("event_active");
  //             eventList.style.height = "0px";
  //         }

  //     });

  // });


  let schedulePage = document.getElementById("schedulePage");

  schedulePage.addEventListener("wheel", function (e) {

    let delta = e.deltaY;
    let schedulePageInner = this.querySelector(".schedule-page__inner");

    if (delta < 0) {

      if (schedulePageInner.scrollTop > 0) {
        $.fn.fullpage.setAllowScrolling(false);
      } else {
        $.fn.fullpage.setAllowScrolling(true);
      }
    } else if (delta > 0) {

      if (schedulePageInner.scrollHeight - schedulePageInner.scrollTop === schedulePageInner.clientHeight) {
        $.fn.fullpage.setAllowScrolling(true);
      } else {
        $.fn.fullpage.setAllowScrolling(false);
      }
    }
  });

}

setSchedulePage();


function setPartnersPage(anchor) {
  const arrowClick = _ => {
    if (_.hasClass('active'))
      return false;
    setTimeout(arrowAfterAction, 400);
  };
  const arrowAfterAction = _ => {
    fpSlideArrowPrev.css("opacity", fpSlideFirst.hasClass('active') ? '.4' : '1');
    fpSlideArrowNext.css("opacity", fpSlideLast.hasClass('active') ? '.4' : '1');
    fpSlides.each(function (idx) {
      if ($(this).hasClass('active')) {
        NavElementBefore.html(idx + 1)
      }
    });
  };

  const fpSliderBlock = $(`[data-anchor="${anchor}"]`).first();
  const fpSlideArrowNext = fpSliderBlock.find(`.fp-controlArrow.fp-next`);
  const fpSlideArrowPrev = fpSliderBlock.find(`.fp-controlArrow.fp-prev`);
  const fpSlideFirst = fpSliderBlock.find(`.fp-slide:first-child`);
  const fpSlideLast = fpSliderBlock.find(`.fp-slide:last-child`);
  const fpSlides = fpSliderBlock.find(`.fp-slide`);
  const fpSlidesNavs = fpSliderBlock.find(`.fp-slidesNav li span`);
  const fpSlidesNavsLi = fpSliderBlock.find(`.fp-slidesNav li`);
  const fpslidesNav = fpSliderBlock.find(`.fp-slidesNav`);
  fpslidesNav.prepend("<div class='NavElementBefore'> Тест </div>");
  let NavElementBefore = fpSliderBlock.find(`.fp-slidesNav .NavElementBefore`);
  arrowAfterAction();
  fpSlideArrowNext.click(_ => arrowClick(fpSlideLast));
  fpSlideArrowPrev.click(_ => arrowClick(fpSlideFirst));
  fpSlidesNavs.click(_ => setTimeout(arrowAfterAction, 200));
  fpSlidesNavs.each(function (idx) {
    $(this).html("" + (idx + 1));
  });

  fpSlidesNavsLi.each(function (idx) {
    if (idx !== fpSlidesNavsLi.length - 1) {
      $(this).css({
        "width": "0",
        "height": "0",
        "overflow": "hidden",
      })
    }
  });
}

setPartnersPage('speakers');
setPartnersPage('partners');
setPartnersPage('infopartners');

window.initMap = function () {
  var image = {
    url: '/dist/static/map-logo.svg',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(50, 50),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(25, 25)
  };
  var uluru = {lat: 55.7787881, lng: 37.6734736};

  // var popupContent = '<p class="content">Что угодно</p>',
  //     infowindow = new google.maps.InfoWindow({
  //         content: popupContent
  //     });

  var map = new google.maps.Map(document.getElementById('mapImg'), {
    zoom: 16,
    center: uluru,
    styles: [
      {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 65
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 51
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 30
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 40
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "hue": "#ffff00"
          },
          {
            "lightness": -25
          },
          {
            "saturation": -97
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "lightness": -25
          },
          {
            "saturation": -100
          }
        ]
      }
    ]
  });

  var marker = new google.maps.Marker({
    position: uluru,
    map: map,
    icon: image
  });

  // infowindow.open(map, marker);
}

initMap();

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
    e.preventDefault();
  e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

function disableScroll() {
  console.log('disable');
  if (window.addEventListener) // older FF
    window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove = preventDefault; // mobile
  document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
  console.log('enable');
  if (window.removeEventListener)
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.onmousewheel = document.onmousewheel = null;
  window.onwheel = null;
  window.ontouchmove = null;
  document.onkeydown = null;
}

$(document).ready(function () {
  $('.events.active').fadeIn();
  $('.events-page__select').click(function () {
    $('.events-page__select').removeClass('active');
    $(this).addClass('active');
    let tab_id = $(this).attr('data-stage');
    $("#" + tab_id).addClass('active').fadeIn().siblings().removeClass('active').fadeOut()
  })

  $('.videos.active').fadeIn();
  $('.video-container__select').click(function () {
    $('.video-container__select').removeClass('active');
    $(this).addClass('active');
    let video_id = $(this).attr('data-stage');
    $("#" + video_id).addClass('active').fadeIn().siblings().removeClass('active').fadeOut();
    if (video_id === 'video-1') {
      $("#player")[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
      $("#player2")[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
    } else {
      $("#player2")[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
      $("#player")[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
    }
  })
})