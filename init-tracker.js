var choo = require('choo')
var html = require('choo/html')
var log = require('choo-log')
var css = require('sheetify')

var sf = css('./node_modules/tachyons/css/tachyons.css')
var st = css`
  .row {
    background-color: lightgrey;
  }

  .row:nth-child(2n) {
    background-color: white;
  }

  .row:hover {
    background-color: cyan;
  }

  .active {
    background-color: brightred;
  }

  .num {
    width: 3rem;
  }
`

var app = choo()
app.use(initStore)
app.use(log())
app.route('/', mainView)
app.mount('body')

function table (state, emit) {
  var keys = Object.keys(state.init.order)
  keys.sort((a, b) => parseInt(a, 10) < parseInt(b, 10))
  return keys.map(key => {
    var chars = state.init.order[key]
    var active = ''
    if (state.init.current.score === key) {
      active = 'active ba'
    }

    return chars.map(chr => html`<div class="cf row ${active}"><span class="fl w-10">${key}</span><span class="fl w-90">${chr}</span></div>`)
  })
}

function turnCounter (state, emit) {
  return html`<div><span class="b">Turn:</span> ${state.init.turn}</div>`
}

function addCharacter (state, emit) {
  return html`<section class="w-80 ma2 pa2 ba">
    <h2>Add a character</h2>
    <form onsubmit=${(evt) => evt.preventDefault()}>
      <label>Initiative: <input autoFocus="true" type="number" max="30" min="-30" step="1" class="num" oninput=${(evt) => update('score', evt)} value="${state.init.score}"></label>
      <label>Name: <input type="text" oninput=${(evt) => update('name', evt)} onkeydown=${submitOnEnter} value="${state.init.name}"></label>
      <button onclick=${add}>Add</button>
    </form>
  </section>`

  function submitOnEnter (evt) {
    if (evt.key === 'Enter') {
      add(evt)
    }
  }

  function add (evt) {
    emit('add', {score: state.init.score, name: state.init.name})
    evt.preventDefault()
  }

  function update (key, evt) {
    emit('input', {key, val: evt.target.value})
  }
}

function mainView (state, emit) {
  return html`
  <body class="${sf} ${st}" onkeydown=${next}>
    <h1>Initiative Tracker</h1>
    ${state.init.started ? '' : addCharacter(state, emit)}
    <section class="w-80 ma2">
      <button onclick=${start}>Start!</button><button onclick=${end}>End!</button><br>
      ${state.init.started ? turnCounter(state, emit) : ''}
    </section>
    <section class="w-80 ma2">
      <div class="cf bb mv2"><span class="fl w-10">Init</span><span class="fl w-90">Character</span></div>
      ${table(state, emit)}
    </section>
  </body>
  `
  function start (evt) {
    evt.preventDefault()
    emit('start')
  }

  function end (evt) {
    evt.preventDefault()
    emit('end')
  }

  function next () {
    if (state.init.started) {
      emit('next')
    }
  }
}

function initStore (state, emitter) {
  if (!state.init) {
    state.init = {
      order: {},
      current: {
        score: null,
        index: null
      },
      name: '',
      score: '',
      started: false,
      turn: 0
    }
  }

  emitter.on('next', function () {
    state.init.current.index++
    var sorted = sort()
    if (state.init.current.index >= sorted.length) {
      state.init.current.index = 0
      state.init.turn++
    }
    state.init.current.score = sort()[state.init.current.index]
    emitter.emit('render')
  })

  emitter.on('start', function () {
    state.init.current.score = highest()
    state.init.current.index = 0
    state.init.started = true
    emitter.emit('render')
  })

  emitter.on('end', function () {
    state.init.started = false
    state.init.current.score = null
    state.init.current.index = null
    state.init.turn = 0
    emitter.emit('render')
  })

  emitter.on('input', function (data) {
    state.init[data.key] = data.val
  })

  emitter.on('add', function (data) {
    if (state.init.started) {
      state.init.score = lowest()
    }

    if (!Array.isArray(state.init.order[state.init.score])) {
      state.init.order[state.init.score] = []
    }

    state.init.order[state.init.score].push(state.init.name)
    state.init.name = ''
    state.init.score = ''
    emitter.emit('render')
  })

  function sort () {
    return Object.keys(state.init.order).sort((a, b) => parseInt(a, 10) < parseInt(b, 10))
  }

  function highest () {
    return sort()[0]
  }

  function lowest () {
    return Object.keys(state.init.order).sort((a, b) => parseInt(a, 10) > parseInt(b, 10))[0]
  }
}
