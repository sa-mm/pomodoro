var pView = function () {
  var ids = ['break-decrement', 'break-increment', 'break-length',
    'session-decrement', 'session-increment', 'session-length',
    'start_stop', 'reset', 'circle', 'time-left', 'timer-label']

  var idsToElements = function (acc, id) {
    acc[id] = document.getElementById(id)
    return acc
  }

  var els = ids.reduce(idsToElements, {})

  var updateTime = function updateTime(date) {
    var checkTime = function checkTime(i) {
      if (i < 10) { i = '0' + i };  // add zero in front of numbers < 10
      return i
    }
    var m = date.getMinutes()
    var s = date.getSeconds()
    m = checkTime(m)
    s = checkTime(s)
    els['time-left'].textContent = m + ':' + s
  }

  var setTimeLeft = function setTimeLeft (num) {
    var date = new Date()
    date.setTime(num)
    updateTime(date)
  }

  var dec = function (id) {
    var txt = els[id].textContent
    var num = +txt
    num > 1 ? num-- : num
    els[id].textContent = num
  }

  var inc = function (id) {
    var txt = els[id].textContent
    var num = +txt
    num >= 60 ? num : num++
    els[id].textContent = num
  }

  return {
    els: els,
    dec: dec,
    inc: inc,
    updateTime: updateTime,
    setTimeLeft: setTimeLeft
  }
}

var timer = {
  timeLeft: '25:00',
  timeLabel: 'Session',
  isSession: true,
  isStopped: true,
  alreadyStarted: false,
  breakCounterNum: 5 * 60 * 1000 + 1000,
  sessionCounterNum: 25 * 60 * 1000,

  // save initial values
  init: function() {
    var origValues = {}
    for (var prop in this) {
      if (this.hasOwnProperty(prop) && prop !== 'origValues') {
        origValues[prop] = this[prop]
      }
    }
    this.origValues = origValues
  },

  // restore initial origValues
  resetTimer: function() {
    for (var prop in this.origValues) {
      this[prop] = this.origValues[prop]
    }
  },

  setBreakCounterNum: function (txt) {
    this.breakCounterNum = +txt * 60 * 1000 + 1000
  },

  setSessionCounterNum: function (txt) {
    this.sessionCounterNum = +txt * 60 * 1000
  }
}

var pomodoroClock = function () {
  timer.init()

  var view = pView()
  var els = view.els

  els['break-decrement'].addEventListener('click', function () {
    view.dec('break-length')
    timer.setBreakCounterNum(els['break-length'].textContent)
  })

  els['break-increment'].addEventListener('click', function () {
    view.inc('break-length')
    timer.setBreakCounterNum(els['break-length'].textContent)
  })

  els['session-decrement'].addEventListener('click', function () {
    view.dec('session-length')
    timer.setSessionCounterNum(els['session-length'].textContent)
    view.setTimeLeft(timer.sessionCounterNum)
  })

  els['session-increment'].addEventListener('click', function () {
    view.inc('session-length')
    timer.setSessionCounterNum(els['session-length'].textContent)
    view.setTimeLeft(timer.sessionCounterNum)
  })

  var counterCb = function (e) {
    e.preventDefault()
    timer.isStopped = !timer.isStopped
    var countDown = function () {
      if (!timer.isStopped) {
        // if the timer isn't stopped, then
        // decrement a counter and
        // update the session or break view
        var date = new Date()
        if (timer.isSession) {
          timer.sessionCounterNum = timer.sessionCounterNum - 1000
          date.setTime(timer.sessionCounterNum)
          els['timer-label'].textContent = 'Session'
        } else {
          timer.breakCounterNum = timer.breakCounterNum - 1000
          date.setTime(timer.breakCounterNum)
          els['timer-label'].textContent = 'Break!'
        }
        view.updateTime(date)
        var playBeep = function () {
          var beep = document.getElementById('beep')
          // beep.play()
        }

        var flipSession = function flipSession() {
          timer.isSession = !timer.isSession
          clearInterval(interval)
          playBeep()
          interval = setInterval(countDown, 1000)
        }
        // if either the session counter or the break counter
        // has reached 0, then flip to the other session
        if (timer.isSession && timer.sessionCounterNum <= 0) {
          flipSession()
          timer.setBreakCounterNum(els['break-length'].textContent)
        } else if (!timer.isSession && timer.breakCounterNum <= 0) {
          flipSession()
          timer.setSessionCounterNum(els['session-length'].textContent)
          timer.sessionCounterNum = timer.sessionCounterNum + 1000
        }
        console.log('sessionCounterNum: ' + timer.sessionCounterNum)
        console.log('breakCounterNum: ' + timer.breakCounterNum)
      }
      els.reset.addEventListener('click', function (e) {
        // when reset clicked
        // make sure interval is cleared.
        clearInterval(interval)
      })
    }
    if (!timer.alreadyStarted) {
      var interval = setInterval(countDown, 1000)
      timer.alreadyStarted = !timer.alreadyStarted
    }
  }

  var startStop = els.start_stop
  startStop.addEventListener('click', counterCb)

  els.reset.addEventListener('click', function (e) {
    timer.resetTimer()
    els['session-length'].textContent = 25
    els['break-length'].textContent = 5
    els['timer-label'].textContent = 'Session'
    els['time-left'].textContent = '25:00'
    timer.setSessionCounterNum('25')
    timer.setBreakCounterNum('5')
  })
}

pomodoroClock()
