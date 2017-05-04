var clock = function () {
  var ids = ['break-decrement', 'break-increment', 'break-length',
    'session-decrement', 'session-increment', 'session-length',
    'start_stop', 'reset', 'circle', 'time-left', 'timer-label']

  var idsToElements = function (acc, id) {
    acc[id] = document.getElementById(id)
    return acc
  }
  var els = ids.reduce(idsToElements, {})

  var dec = function (num) {
    num > 1 ? num-- : num
    return num
  }

  var inc = function (num) {
    num >= 60 ? num : num++
    return num
  }

  var breakCounterNum
  var breakLength = document.getElementById('break-length')
  var breakText = +breakLength.textContent

  var setBreakCounterNum = function (txt) {
    breakCounterNum = +txt * 60 * 1000
  }
  setBreakCounterNum(breakText)

  els['break-decrement'].addEventListener('click', function (target) {
    target.preventDefault()
    breakText = dec(breakText)
    breakLength.textContent = breakText
    setBreakCounterNum(breakText)
  })
  els['break-increment'].addEventListener('click', function (target) {
    breakText = inc(breakText)
    breakLength.textContent = breakText
    setBreakCounterNum(breakText)
  })

  var sessionLength = document.getElementById('session-length')
  var sessionText = +sessionLength.textContent

  var counter = document.getElementById('time-left')
  var counterNum
  var setCounterNum = function (txt) {
    counterNum = +txt * 60 * 1000
  }
  setCounterNum(counter.textContent)

  els['session-decrement'].addEventListener('click', function (target) {
    sessionText = dec(sessionText)
    sessionLength.textContent = sessionText
    counter.textContent = sessionText
    setCounterNum(counter.textContent)
  })
  els['session-increment'].addEventListener('click', function () {
    sessionText = inc(sessionText)
    sessionLength.textContent = sessionText
    counter.textContent = sessionText
    setCounterNum(counter.textContent)
  })

  // var fillBackground = function (num) {
  //   var circle = document.getElementById('circle')
  //   circle.style.background = 'linear-gradient(0, red 50%, transparent 50%)'
  // }

  var isStopped = true
  var alreadyStarted = false


  var counterCb = function (e) {
    // this.removeEventListener('click', counterCb)
    e.preventDefault()
    isStopped = !isStopped
    var session = true
    var countDown = function () {
      if (!isStopped) {
        var date = new Date()
        if (session) {
          counterNum = counterNum - 1000
          // fillBackground()
          date.setTime(counterNum)
        } else {
          breakCounterNum = breakCounterNum - 1000
          // fillBackground()
          date.setTime(breakCounterNum)
        }
        var m = date.getMinutes()
        var s = date.getSeconds()
        var checkTime = function checkTime (i) {
          if (i < 10) { i = '0' + i };  // add zero in front of numbers < 10
          return i
        }
        m = checkTime(m)
        s = checkTime(s)
        counter.textContent = m + ':' + s
        if (session && counterNum <= 0) {
          session = false
          clearInterval(interval)
          interval = setInterval(countDown, 1000)
          setBreakCounterNum(breakLength.textContent)
          els['timer-label'].textContent = 'Break!'
        } else if (!session && breakCounterNum <= 0) {
          clearInterval(interval)
          session = true
          els['timer-label'].textContent = 'Session'
          setCounterNum(sessionLength.textContent)
          interval = setInterval(countDown, 1000)
        }
        console.log('counterNum: ' + counterNum)
        console.log('breakCounterNum: ' + breakCounterNum)
      }
      els.reset.addEventListener('click', function (e) {
        e.preventDefault()
        clearInterval(interval)
        // els.circle.addEventListener('click', counterCb)
      })
    }
    if (!alreadyStarted) {
      var interval = setInterval(countDown, 1000)
      alreadyStarted = true
    }
  }
  // els.circle.addEventListener('click', counterCb)

  var startStop = els.start_stop
  // startStop.addEventListener('click', function (e) {
  //   e.preventDefault()
  //   isStopped ? isStopped = false : isStopped = true
  // })
  startStop.addEventListener('click', counterCb)

  els.reset.addEventListener('click', function (e) {
    e.preventDefault()
    session = true
    isPaused = false
    alreadyStarted = false
    sessionText = 25
    sessionLength.textContent = sessionText
    breakText = 5
    breakLength.textContent = breakText
    breakLength.nodeValue = breakText
    document.getElementById('timer-label').textContent = 'Session'
    document.getElementById('time-left').textContent = sessionText
    setCounterNum(counter.textContent)
    setBreakCounterNum(breakText)
  })
}

clock()
