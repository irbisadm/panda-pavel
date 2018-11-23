//pavr

import img11 from '../assets/mems/1-1.jpg'
import img12 from '../assets/mems/1-2.jpg'
import img13 from '../assets/mems/1-3.jpg'
import img21 from '../assets/mems/2-1.jpg'
import img22 from '../assets/mems/2-2.jpg'
import img23 from '../assets/mems/2-3.jpg'
import img31 from '../assets/mems/3-1.jpg'
import img32 from '../assets/mems/3-2.jpg'
import img33 from '../assets/mems/3-3.jpg'
import img41 from '../assets/mems/4-1.jpg'
import img42 from '../assets/mems/4-2.jpg'
import img43 from '../assets/mems/4-3.jpg'
import img51 from '../assets/mems/5-1.jpg'
import img52 from '../assets/mems/5-2.jpg'
import img53 from '../assets/mems/5-3.jpg'
import img61 from '../assets/mems/6-1.jpg'
import img62 from '../assets/mems/6-2.jpg'
import img63 from '../assets/mems/6-3.jpg'
import img71 from '../assets/mems/7-1.jpg'
import img72 from '../assets/mems/7-2.jpg'
import img73 from '../assets/mems/7-3.jpg'
import img81 from '../assets/mems/8-1.jpg'
import img82 from '../assets/mems/8-2.jpg'
import img83 from '../assets/mems/8-3.jpg'
import img91 from '../assets/mems/9-1.jpg'
import img92 from '../assets/mems/9-2.jpg'
import img93 from '../assets/mems/9-3.jpg'
import img101 from '../assets/mems/10-1.jpg'
import img102 from '../assets/mems/10-2.jpg'
import img103 from '../assets/mems/10-3.jpg'
import img111 from '../assets/mems/11-1.jpg'
import img112 from '../assets/mems/11-2.jpg'
import img113 from '../assets/mems/11-3.jpg'
import img121 from '../assets/mems/12-1.jpg'
import img122 from '../assets/mems/12-2.jpg'
import img123 from '../assets/mems/12-3.jpg'
import img131 from '../assets/mems/13-1.jpg'
import img132 from '../assets/mems/13-2.jpg'
import img133 from '../assets/mems/13-3.jpg'
import img141 from '../assets/mems/14-1.jpg'
import img142 from '../assets/mems/14-2.jpg'
import img143 from '../assets/mems/14-3.jpg'
import img151 from '../assets/mems/15-1.jpg'
import img152 from '../assets/mems/15-2.jpg'
import img153 from '../assets/mems/15-3.jpg'

let images = {
  img11,
  img12,
  img13,
  img21,
  img22,
  img23,
  img31,
  img32,
  img33,
  img41,
  img42,
  img43,
  img51,
  img52,
  img53,
  img61,
  img62,
  img63,
  img71,
  img72,
  img73,
  img81,
  img82,
  img83,
  img91,
  img92,
  img93,
  img101,
  img102,
  img103,
  img111,
  img112,
  img113,
  img121,
  img122,
  img123,
  img131,
  img132,
  img133,
  img141,
  img142,
  img143,
  img151,
  img152,
  img153,
}

// console.log(images);
//HELPERS
function Timer(callback, delay) {
  var timerId, start, remaining = delay;

  this.pause = function () {
    window.clearTimeout(timerId);
    remaining -= new Date() - start;
  };

  this.resume = function () {
    start = new Date();
    window.clearTimeout(timerId);
    timerId = window.setTimeout(callback, remaining);
  };

  this.resume();
}

$.fn.hideMessage = function (time = 300) {
  $(this).removeClass('visible').slideUp(time);
}

$.fn.showMessage = function (time = 300) {
  $(this).addClass('visible').slideDown(time);
}

$(document).ready(function () {
  let callerId;
  let socket;

  const playTypingSound = function (timeStart = 4) {
    setTimeout(() => {
      // console.log('play');
      $('#typingSound')[0].currentTime = timeStart;
      $('#typingSound')[0].play();
    }, 1000)

  }

  const stopTypingSound = function () {
    // console.log('stop');
    $('#typingSound')[0].pause();
  }

  $.ajax({
    url: 'https://demos05.voximplant.com/intercomconf/checkPromo',
    success: (res) => {
      if (res.result !== undefined) {
        // console.log('check callerId: ' + res.result);
        if (res.result === true) {
          window.pavrTimer = new Timer(showPavel, 1000)
        } else {
          console.error('There is no promo-codes')
        }


      }
    },

    error: (jqXHR, textStatus, errorThrown) => {
      console.error(res.errorThrown)
    },

    dataType: 'json',
    type: 'GET',
    xhrFields: {
      withCredentials: true
    }
  })

  function showPavel() {
    if (window.innerWidth > 768) {
      $('.pavr_block').addClass('active')


      setTimeout(() => {
        $('.pavr_av_block').addClass('pavr_av_bouncing')
      }, 1000);

      setTimeout(() => {
        $('.pavr_text_block_first').showMessage();
        playTypingSound();
      }, 1200);
      setTimeout(() => {
        $('.pavr_btn_block_first').showMessage()
        stopTypingSound();
      }, 6200);
    }
  }


  $('.pavr_btn_ok').click(() => {
    $('.pavr_text_block_err').removeClass('visible');
    $('.pavr_text_block_ok').showMessage();
    playTypingSound();
    $('.pavr_btn_ok').attr('disabled', true);


    //input show
    setTimeout(() => {
      $('.pavr-form').showMessage();
      stopTypingSound();
      pavrInput.focus();
    }, 5500);

    //this is my number button show
    setTimeout(() => {
      $('.pavr_btn_block_second').showMessage()
    }, 5500);


  })

  const pavrInput = $('#myNumberInput');

  pavrInput.keypress(function (e) {
    if (e.which == 13) {
      $('#myNumberButton').click();
    }
  });

  pavrInput.focus(() => {
    $('.pavr-form__warning').removeClass('visible');
  });

  $('#myNumberButton').click(() => {

    callerId = pavrInput.val();

    if (callerId[0] === '+') {
      callerId = callerId.substr(1)
    }

    // console.log(callerId);
    const reg = /^[0-9\-\+]{9,15}$/g;
    if (reg.test(callerId)) {
      if (callerId[0] === '8') {
        callerId = '7' + callerId.substr(1);
      }
      setCallerId(callerId);

    } else {
      $('#regexCheckWarn').addClass('visible');
    }


  });

  $('.pavr_btn_no').click(() => {

    $('.pavr_btn_block_second').hideMessage();
    $('.pavr_btn_block_first').hideMessage();
    $('.pavr_text_block_ok').hideMessage();
    $('.pavr_text_block_second').hideMessage();
    $('.pavr_text_block_third').hideMessage();


    $('.pavr_text_block_err').addClass('visible').slideDown();

    playTypingSound();


    setTimeout(() => {
      stopTypingSound();
    }, 2000);

    const destroyTimeout = setTimeout(() => {
      hidePavel();

    }, 3000);

  })


  $('.pawr-finish-button').click(hidePavel)

  function hidePavel() {
    $('.pavr_block').removeClass('active');
    setTimeout(() => {
      $('.pavr_block').remove();
    }, 3000)
  }

  function successNumberCheck() {
    playTypingSound(8.5);
    pavrInput.attr('readonly', 'readonly');
    $('#myNumberButton').attr('disabled', true);
    $('.pavr_btn_block_second').removeClass('visible')
      .slideUp();

    $('.pavr_text_block_third').addClass('visible')
      .slideDown();
  }

  function checkCallerId(id) {
    $.ajax({
      url: 'https://demos05.voximplant.com/intercomconf/checkCallerId?caller_id=' + id,
      success: (res) => {
        if (res.result !== undefined) {
          // console.log('check callerId: ' + res.result);
          if (res.result === true) {
            successNumberCheck()
          } else {
            console.error(res);

            // successNumberCheck();

            switch (res.reason) {
              case "no_socket":
                $('#socketCheckWarn').addClass('visible');
                break;
              case "already_played":
                $('#alreadyPlayedCheckWarn').addClass('visible');
                break;
            }

          }


        }
      },

      error: (jqXHR, textStatus, errorThrown) => {
        console.error(res.errorThrown)
      },

      dataType: 'json',
      type: 'GET',
      xhrFields: {
        withCredentials: true
      }
    })
  }

  function startGame() {
    $('.pavr_btn_block_second').hideMessage();
    $('.pavr_btn_block_first').hideMessage();

    $('.pavr_text_block_ok').hideMessage();
    $('.pavr_text_block_first').hideMessage();
    $('.pavr_text_block_second').hideMessage();
    $('.pavr_text_block_third').hideMessage();


    $('.pavr_text_block_game').addClass('visible').slideDown().animate({
      width: '460px',
      height: '480px'
    });

    $('#pavrCurrentScore').slideDown();

  }


  let scoreValue = 0;

  function changeScore(value) {
    if (value === scoreValue) return;
    $('#pavrCurrentScore .score_value').slideUp(function () {
      $(this).remove();
    });

    let newValue = $('<div class="score_value"></div>').text('Баллы: ' + value);
    newValue.prependTo($('#pavrCurrentScore')).slideDown();
    scoreValue = value;
  }


  function addImage(imgName) {
    $('#right-answer-wrapper').hideMessage();
    $('.pavr_btn_block_answer').addClass('visible').slideUp();
    $('.pavr_text_block_game .pavr_image').remove();

    // console.log(imgName);
    let imgVariable = 'img' + imgName.replace(/[^0-9]+/g, '')
    // console.log(imgVariable);

    let img = $('<img />', {
      class: 'pavr_image',
      src: images[imgVariable],
      alt: 'image'
    });

    img.appendTo($('.pavr_text_block_game .pavr_image-wrapper'));

  }

  function handleError() {
    if (isFinished) return;

    $('.pavr_btn_block_second').hideMessage();
    $('.pavr_btn_block_first').hideMessage();
    $('.pavr_text_block_ok').hideMessage();
    $('.pavr_text_block_second').hideMessage();
    $('.pavr_text_block_third').hideMessage();
    $('.pavr_text_block_game').hideMessage();
    $('#recognizedAnswerBlock').hideMessage();

    $('#disconectError').showMessage();

    setTimeout(() => {
      hidePavel();
    }, 3000);

  }


  let isFinished = false;

  function handleFinish(code, type) {


    function wordend(num, words) {
      return words[((num = Math.abs(num % 100)) > 10 && num < 15 || (num %= 10) > 4 || num === 0) + (num !== 1)];
    }

    let textValue = `${scoreValue} ${wordend(scoreValue, ['балл', 'балла', 'баллов'])}`

    $('#pavrFinalScore').text(textValue);
    $('#promoCode').text(code);

    let promoCodeTypeText;
    switch (type) {
      case 'FREE':
        promoCodeTypeText = '100% скидку';
        break;
      case 'MEDIUM':
        promoCodeTypeText = '30% скидку';
        break;
      case 'SMALL':
        promoCodeTypeText = '10% скидку';
        break;
    }

    $('#promoCodeTypeText').text(promoCodeTypeText);


    $('.pavr_btn_block_second').hideMessage();
    $('.pavr_btn_block_first').hideMessage();
    $('.pavr_text_block_ok').hideMessage();
    $('.pavr_text_block_second').hideMessage();
    $('.pavr_text_block_third').hideMessage();
    $('.pavr_text_block_game').hideMessage();
    $('#recognizedAnswerBlock').hideMessage();


    $('.pavr_text_block_finish').showMessage();
    playTypingSound()
    setTimeout(() => {
      $('.pavr_btn_block_finish').showMessage();
      stopTypingSound()
    }, 5500)

  }

  function handleFinishBad() {
    $('.pavr_btn_block_second').hideMessage();
    $('.pavr_btn_block_first').hideMessage();
    $('.pavr_text_block_ok').hideMessage();
    $('.pavr_text_block_second').hideMessage();
    $('.pavr_text_block_third').hideMessage();
    $('.pavr_text_block_game').hideMessage();

    $('.pavr_text_block_finishBad').showMessage();
    playTypingSound();
    setTimeout(() => {
      stopTypingSound()
      $('.pavr_btn_block_finishBad').showMessage();
    }, 5500)


  }

  function handleAnswer(answer) {
    // console.log('recognition_result: ' + answer);

    $('#recognizedAnswer').text(answer);
    $('.pavr_btn_block_answer').showMessage();
  }

  function showRightAnswer(answer) {
    $('#right-answer-wrapper').showMessage();
    $('#right-answer').text(answer);
  }

  function setCallerId(id) {
    $.ajax({
      url: 'https://demos05.voximplant.com/intercomconf/setCallerId?caller_id=' + id,
      success: (res) => {
        if (res.result !== undefined) {
          // в сессии на серваке прописали callerid
          // console.log('SUXESS')
          connectSocket(id);

        }
      },

      error: (jqXHR, textStatus, errorThrown) => {
        console.error(res.errorThrown)
      },

      dataType: 'json',
      type: 'GET',
      xhrFields: {
        withCredentials: true
      }
    })
  }


// Подрубаем сокет
  function connectSocket(id) {
    socket = io('https://demos05.voximplant.com', {path: '/intercomconf/socket.io'})
    socket.on('connect', function () {
      console.log('websocket connected for callerId:' + callerId);
      checkCallerId(id);
    });
    socket.on('data', data => {
      // console.log('websocket event')

      try {
        const result = JSON.parse(data.result);
        console.log(result);
        if (result.points) {
          changeScore(result.points);
        }


        switch (result.action) {
          case 'start':
            startGame();
            addImage(result.data);
            break;

          case 'recognition_result':
            handleAnswer(result.data[0]);
            break;

          case 'next_word_success':
          case 'next_word_fail':
          case 'next_image':
            addImage(result.data);
            break;

          case 'call_disconnected':
            handleError();
            break;

          case 'points_updated':
            showRightAnswer(result.right_answer);
            break;

          case 'finish':
            isFinished = true;
            showRightAnswer(result.right_answer);
            setTimeout(function () {
              if (result.code && result.code_type) {
                handleFinish(result.code, result.code_type)
              } else {
                handleFinishBad();
              }
            }, 4000)

            break;
        }


      } catch (err) {
        console.error(err)
        handleError();
      }
    })
    socket.on('disconnect', function () {
      // console.log('websocket disconnected')
      handleError();
    })
  }
});


