require(Modules.ASR)

var call,
    caller_id,
    questions = [
      { 
        hints_ru: ["файерфокс", "мозилла", "мозилла файерфокс", "огненная лиса", "огнелис", "firefox", "mozilla", "mozilla firefox"],
        answers: ["файерфокс", "мозилла", "мозиллафайерфокс", "огненнаялиса", "огнелис", "firefox", "mozilla", "mozillafirefox"],
        pics: ["1-1.jpg", "1-2.jpg", "1-3.jpg"]
      },
      { 
        hints_ru: ["машинное обучение", "machine learning"],
        answers: ["машинноеобучение", "machinelearning"],
        pics: ["2-1.jpg", "2-2.jpg", "2-3.jpg"]
      },
      {
        hints_ru: ["единорог", "юникорн", "unicorn", "единороги"],
        answers: ["единорог", "юникорн", "unicorn", "единороги"],
        pics: ["12-1.jpg", "12-2.jpg", "12-3.jpg"]
      },
      {
      	hints_ru: ["джаваскрипт", "javascript"],
        answers: ["джаваскрипт", "javascript"],
        pics: ["4-1.jpg", "4-2.jpg", "4-3.jpg"]
      },
      {
        hints_ru: ["распознавание речи", "речь в текст", "speech recognition", "speech to text", "speech-to-text", "распознавание голоса"],
        answers: ["распознаваниеречи", "речьвтекст", "speechrecognition", "speechtotext", "speech-to-text", "распознаваниеголоса"],
        pics: ["5-1.jpg", "5-2.jpg", "5-3.jpg"]
      },
      {
        hints_ru: ["дедлайн", "deadline"],
        answers: ["дедлайн", "deadline"],
        pics: ["7-1.jpg", "7-2.jpg", "7-3.jpg"]
      },
      {
        hints_ru: ["синтез речи", "text to speech", "speech synthesis", "tts", "ттс"],
        answers: ["синтезречи", "texttospeech", "speechsynthesis", "tts", "ттс"],
        pics: ["6-1.jpg", "6-2.jpg", "6-3.jpg"]
      },
      {
        hints_ru: ["силиконовая долина", "кремниевая долина", "silicon valley", "долина"],
        answers: ["силиконоваядолина", "кремниеваядолина", "siliconvalley", "долина"],
        pics: ["8-1.jpg", "8-2.jpg", "8-3.jpg"]
      },
      {
        hints_ru: ["колл центр", "колл-центр", "контакт центр"],
        answers: ["коллцентр", "колл-центр", "контактцентр"],
        pics: ["9-1.jpg", "9-2.jpg", "9-3.jpg"]
      },
      {
        hints_ru: ["голосовой ассистент", "голосовой помощник", "voice assistant"],
        answers: ["голосовойассистент", "голосовойпомощник", "voiceassistant"],
        pics: ["10-1.jpg", "10-2.jpg", "10-3.jpg"]
      },
      {
        hints_ru: ["компьютер", "комп", "десктоп", "персональный компьютер", "пк", "эвм", "пэвм"],
        answers: ["компьютер", "комп", "десктоп", "персональныйкомпьютер", "пк", "эвм", "пэвм"],
        pics: ["11-1.jpg", "11-2.jpg", "11-3.jpg"]
      },
      {
        hints_ru: ["воксимплант", "вокс имплант", "voximplant", "вокс", "vox"],
        answers: ["воксимплант", "voximplant", "вокс", "vox"],
        pics: ["13-1.jpg", "13-2.jpg", "13-3.jpg"]
      },
      {
        hints_ru: ["браузер", "веб-браузер", "веб браузер", "browser", "web browser", "браузеры", "веб браузеры"],
        answers: ["браузер", "веб-браузер", "веббраузер", "browser", "webbrowser", "браузеры", "веббраузеры"],
        pics: ["14-1.jpg", "14-2.jpg", "14-3.jpg"]
      },
      {
        hints_ru: ["баг", "бага", "bug", "ошибка", "ошибка в коде", "баги"],
        answers: ["баг", "бага", "bug", "ошибка", "ошибкавкоде", "баги"],
        pics: ["15-1.jpg", "15-2.jpg", "15-3.jpg"]
      }
    ],
    ws = "https://demos05.voximplant.com/intercomconf",
    qIndex = 0,
    attempts = 0,
    ru_asr, en_asr,
    ents, ruts,
    points = 0

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

VoxEngine.addEventListener(AppEvents.CallAlerting, async (e) => {
	call = e.call
    caller_id = e.callerid
    call.addEventListener(CallEvents.Connected, onCallConnected)
    call.addEventListener(CallEvents.Disconnected, onCallDisconnected) 
    //call.answer()
    call.startEarlyMedia()
    // запрос к бэку и проверка callerid - если уже участвовал, то давай до свидания
    let res = await Net.httpRequestAsync(ws + '/checkCallerId?caller_id=' + encodeURIComponent(caller_id))
    try {
  		res = JSON.parse(res.text)
  	} catch (err) {
  		Logger.write(err)
        call.hangup()
  	}
	if (res.result === true) {
    	call.say("Привет, вы позвонили по бесплатному номеру, подождите пару секунд пока мы соединяем вас с Павлом", Language.Premium.RU_RUSSIAN_YA_FEMALE
)
    	call.addEventListener(CallEvents.PlaybackFinished, callevent => call.answer())
    	//call.answer()
    } else {
      if (res.reason == "already_played") {
        //call.answer()
        call.say("Знакомый номер я вижу на экране моего несуществующего мобильного. Одна попытка в одни руки — таковы правила.", Language.RU_RUSSIAN_MALE)
        call.addEventListener(CallEvents.PlaybackFinished, VoxEngine.terminate)
      } else {
        call.say("Не узнаю вас в гриме: перезагрузи страницу, введи номер для идентификации и попробуй позвонить еще раз. Очень жду!", Language.RU_RUSSIAN_MALE)
        call.addEventListener(CallEvents.PlaybackFinished, VoxEngine.terminate)      	
      }
    }    
})

function onCallConnected(e) {
  call.removeEventListener(CallEvents.PlaybackFinished)
  // Ломимся по HTTP к socketio, чтобы общаться с браузером
  call.say("Мир тебе, землянин! Конкурс прост: я показываю в браузере изображения, в них зашифрованы слова или словосочетания, имеющие отношение к конференции и <say-as stress='2'>АйТи</say-as>." +
           "А ты пытаешься их отгадать, разговаривая со мной по телефону. Всего пять вопросов и по три попытки отгадать правильный ответ. Готов??? Понеслась!",
             Language.RU_RUSSIAN_MALE)
  //call.say("Привет!", Language.RU_RUSSIAN_MALE)
  call.addEventListener(CallEvents.PlaybackFinished, startGame)  
  call.record({stereo: true})
  call.addEventListener(CallEvents.RecordStarted, async (rec) => {
    let res = await Net.httpRequestAsync(ws + '/urlResult?caller_id=' + encodeURIComponent(caller_id) + '&url=' + 
                                       encodeURIComponent(rec.url))     
  })
}

async function startGame() {
  call.removeEventListener(CallEvents.PlaybackFinished)
  shuffle(questions) 
  questions = questions.slice(0, 5)
  let res = await Net.httpRequestAsync(ws + '/voxResult?caller_id=' + encodeURIComponent(caller_id) + '&data=' + 
                                       encodeURIComponent(JSON.stringify({action: "start", data: questions[qIndex].pics[attempts], points: points})))
  try {
  	res = JSON.parse(res.text)
  } catch (err) {
  	Logger.write(err)
  }
  if (res.result === true) {
  	Logger.write("===--- The Game has started! ---===")
    startASR()    
    wireCall()
  }
}

function wireCall() {
  call.sendMediaTo(ru_asr)
}

function unwireCall() {
  call.stopMediaTo(ru_asr)
}

function stopASR() {
  ru_asr.stop()
}

function wordend(num, words) {
    return words[ ((num=Math.abs(num%100)) > 10 && num < 15 || (num%=10) > 4 || num === 0) + (num !== 1) ];
}

async function startASR() {
	ru_asr = VoxEngine.createASR({ 
      lang: ASRLanguage.RUSSIAN_RU,
      dict: questions[qIndex].hints_ru
    })    
    
    var results = []

    ru_asr.addEventListener(ASREvents.Result, (e) => {   
      stopASR()
      results.push(e.text.toLowerCase())
      onRecognitionResult(results)
    })   
    ru_asr.addEventListener(ASREvents.ASRError, onRecognitionError)   

}

function wsProblem() {
  call.say("Трагедия! На линии случилась авария. Попробуй позвонить еще раз, но чуть позднее. ", Language.RU_RUSSIAN_MALE)
  call.addEventListener(CallEvents.PlaybackFinished, VoxEngine.terminate)
}

async function onRecognitionResult(e) {
  // Сохраняем номер телефона, чтобы нельзя было потом второй раз играть
  if (qIndex == 0) {
     Logger.write("Storing player info...")
  	let res = await Net.httpRequestAsync(ws + '/voxResult?caller_id=' + encodeURIComponent(caller_id) + '&action=store')
    try { 
      res = JSON.parse(res.text) 
      if (res.result != "stored") wsProblem()
    } catch (err) { Logger.write(err); wsProblem() }
  }
  // Обработка распознавания
  unwireCall()
  Logger.write(e)
  let res = await Net.httpRequestAsync(ws + '/voxResult?caller_id=' + encodeURIComponent(caller_id) + '&data=' +
                	encodeURIComponent(JSON.stringify({action: "recognition_result", data: e })))
  
  let rr = e[0].replace("это ", "").replace("вероятно ", "").replace("может быть ", "").replace("может это ", "")
  rr = rr.replace(/ /g,'')
  let found = questions[qIndex].answers.some(r=> rr.indexOf(r) >= 0)
  Logger.write("FOUND: " + found)
  if (found) {
    if (attempts == 0) {
      points += 5
      call.say("<say-as stress='3'>Крутотенюшка</say-as>! Держи пятюню!", Language.RU_RUSSIAN_MALE) 
    }
    else if (attempts == 1) {
      points += 3
      call.say("Нормально! Засчитываю три балла.", Language.RU_RUSSIAN_MALE)
    }
    else if (attempts == 2) {
      points += 1
      call.say("Ну такое… всего лишь один балл. Погнали дальше.", Language.RU_RUSSIAN_MALE)
    }
    
    attempts = 0
    qIndex++
    if (qIndex < 5) {
      startASR()
      let res = await Net.httpRequestAsync(ws + '/voxResult?caller_id=' + encodeURIComponent(caller_id) + '&data=' +
                	encodeURIComponent(JSON.stringify({action: "points_updated", points: points, right_answer: questions[qIndex-1].hints_ru[0]})))
      call.addEventListener(CallEvents.PlaybackFinished, async (ee) => {
        call.removeEventListener(CallEvents.PlaybackFinished)            
        let res = Net.httpRequestAsync(ws + '/voxResult?caller_id=' + encodeURIComponent(caller_id) + '&data=' +
                	encodeURIComponent(JSON.stringify({action: "next_word_success", data: questions[qIndex].pics[attempts]})))
        wireCall()
      })
    } else gameFinished()      
  } else {
    attempts++
    if (attempts < 3) {
      
      call.say("Ммм… нет. Это не то, что я загадал. Попробуй еще раз!", Language.RU_RUSSIAN_MALE)
      startASR()      
    	call.addEventListener(CallEvents.PlaybackFinished, async (ee) => {
      		call.removeEventListener(CallEvents.PlaybackFinished)
            let res = await Net.httpRequestAsync(ws + '/voxResult?caller_id=' + encodeURIComponent(caller_id) + '&data=' +
                	encodeURIComponent(JSON.stringify({action: "next_image", data: questions[qIndex].pics[attempts], points: points})))
      		wireCall()
    	})
    } else {
        
    	attempts = 0
        qIndex++
        if (qIndex < 5) {
          startASR()
          call.say("Ноль баллов за этот вопрос. Правильный ответ: " + questions[qIndex-1].hints_ru[0] + ". Соберись! Погнали дальше.", Language.RU_RUSSIAN_MALE)
          let res = await Net.httpRequestAsync(ws + '/voxResult?caller_id=' + encodeURIComponent(caller_id) + '&data=' +
                    	encodeURIComponent(JSON.stringify({action: "points_updated", points: points, right_answer: questions[qIndex-1].hints_ru[0]})))
          call.addEventListener(CallEvents.PlaybackFinished, async (ee) => {
              call.removeEventListener(CallEvents.PlaybackFinished)
              let res = await Net.httpRequestAsync(ws + '/voxResult?caller_id=' + encodeURIComponent(caller_id) + '&data=' +
                    	encodeURIComponent(JSON.stringify({action: "next_word_fail", data: questions[qIndex].pics[attempts]})))
              wireCall()
          })
        } else gameFinished()
    }
  }
}

async function gameFinished() {
  let res = await Net.httpRequestAsync(ws + '/voxResult?caller_id=' + encodeURIComponent(caller_id) + '&data=' +
                                       encodeURIComponent(JSON.stringify({action: "finish", points: points, right_answer: questions[qIndex-1].hints_ru[0]})) + '&action=finish')
  call.say("На этом вопросы кончились, спасибо за участие! Всего набрано " + points + " " + wordend(points, ['балл', 'балла', 'баллов']) +
           (points==0?"":", приз в виде промокода ищи на экране."), Language.RU_RUSSIAN_MALE)
  call.addEventListener(CallEvents.PlaybackFinished, (e) => {
    call.removeEventListener(CallEvents.PlaybackFinished)
    call.hangup()
  })
}

function onRecognitionError(e) {
  Logger.write("боль")
}

async function onCallDisconnected(e) {
  let res = await Net.httpRequestAsync(ws + '/voxResult?caller_id=' + encodeURIComponent(caller_id) + '&data=' +
                                       encodeURIComponent(JSON.stringify({action: "call_disconnected", points: points})))
  VoxEngine.terminate()
}