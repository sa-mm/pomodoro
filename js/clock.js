var pView = function () {
  var ids = ['break-decrement', 'break-increment', 'break-length',
    'session-decrement', 'session-increment', 'session-length',
    'start_stop', 'reset', 'circle', 'time-left', 'timer-label']

  var idsToElements = function (acc, id) {
    acc[id] = document.getElementById(id)
    return acc
  }

  var els = ids.reduce(idsToElements, {})

  var setTimeLeft = function setTimeLeft(counterNum) {
    var date = new Date()
    date.setTime(counterNum)
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

  var resetView = function resetView () {
    els['session-length'].textContent = 25
    els['break-length'].textContent = 5
    els['timer-label'].textContent = 'Session'
    els['time-left'].textContent = '25:00'
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
    setTimeLeft: setTimeLeft,
    resetView: resetView
  }
}

var timer = {
  timeLeft: '25:00',
  timeLabel: 'Session',
  isSession: true,
  isStopped: true,
  alreadyStarted: false,
  breakCounterNum: 5 * 60 * 1000,
  sessionCounterNum: 25 * 60 * 1000,

  // save initial values
  init: function () {
    var origValues = {}
    for (var prop in this) {
      if (this.hasOwnProperty(prop) && prop !== 'origValues') {
        origValues[prop] = this[prop]
      }
    }
    this.origValues = origValues
  },

  // restore initial origValues
  resetTimer: function () {
    for (var prop in this.origValues) {
      this[prop] = this.origValues[prop]
    }
  },

  setCounterNum: function (type, direction) {
    var view = pView()
    var id = type + '-length'
    if (direction === 'inc') {
      view.inc(id)
    } else if (direction === 'dec') {
      view.dec(id)
    }
    var txt = view.els[id].textContent
    this[type + 'CounterNum'] = +txt * 60 * 1000 + 1000

    // update time-left
    if (type === 'session' && direction) {
      view.setTimeLeft(this.sessionCounterNum - 1)
    }
  }
}

var pomodoroClock = function () {
  timer.init()

  var view = pView()
  var els = view.els

  els['break-decrement'].addEventListener('click', function () {
    timer.setCounterNum('break', 'dec')
  })

  els['break-increment'].addEventListener('click', function () {
    timer.setCounterNum('break', 'inc')
  })

  els['session-decrement'].addEventListener('click', function () {
    timer.setCounterNum('session', 'dec')
  })

  els['session-increment'].addEventListener('click', function () {
    timer.setCounterNum('session', 'inc')
  })

  var counterCb = function (e) {
    timer.isStopped = !timer.isStopped
    var countDown = function () {
      if (!timer.isStopped) {
        // if the timer isn't stopped, then
        // decrement a counter and
        // update the session or break view
        if (timer.isSession) {
          timer.sessionCounterNum = timer.sessionCounterNum - 1000
          view.setTimeLeft(timer.sessionCounterNum)
          els['timer-label'].textContent = 'Session'
        } else {
          timer.breakCounterNum = timer.breakCounterNum - 1000
          view.setTimeLeft(timer.breakCounterNum)
          els['timer-label'].textContent = 'Break!'
        }

        var playBeep = function () {
          var beep = document.getElementById('beep')
          beep.play()
        }

        var flipSession = function flipSession() {
          clearInterval(interval)
          timer.isSession = !timer.isSession
          // play audio at end of session/break
          playBeep()
          interval = setInterval(countDown, 1000)
        }
        // if either the session counter or the break counter
        // has reached 0, then flip to the other session
        if (timer.isSession && timer.sessionCounterNum <= 0) {
          flipSession()
          timer.setCounterNum('break')
        } else if (!timer.isSession && timer.breakCounterNum <= 0) {
          flipSession()
          timer.setCounterNum('session')
        }
        console.log('sessionCounterNum: ' + timer.sessionCounterNum)
        console.log('breakCounterNum: ' + timer.breakCounterNum + ' and time-left element: ' + view.els['time-left'].textContent)
      }
      els.reset.addEventListener('click', function (e) {
        // when reset clicked
        // make sure interval is cleared.
        clearInterval(interval)
      })
    }
    if (!timer.alreadyStarted) {
      timer.alreadyStarted = !timer.alreadyStarted
      var interval = setInterval(countDown, 1000)
    }
  }

  els.start_stop.addEventListener('click', counterCb)

  els.reset.addEventListener('click', function (e) {
    timer.resetTimer()
    view.resetView()
  })
}

pomodoroClock()
