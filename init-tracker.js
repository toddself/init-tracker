var choo = require('choo')
var html = require('choo/html')
var log = require('choo-log')
var css = require('sheetify')

var initStore = require('./lib/store')

var table = require('./view/table')
var turnCounter = require('./view/turn-counter')
var addCharacter = require('./view/add-character')

var sf = css('./node_modules/tachyons/css/tachyons.css')
var st = css('./static/css/style.css')

var app = choo()
app.use(initStore)
app.use(log())
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  console.log('store', state)
  return html`
  <body class="${sf} ${st}" onkeydown=${next}>
    <h1>Initiative Tracker</h1>
    <section class="w-80 ma2">
      <button onclick=${toggleRun}>${state.active ? 'End' : 'Start'}</button>
    </section>
    ${state.active ? turnCounter(state, emit) : ''}
    <section class="w-80 ma2">
      <div class="cf bb mv2"><span class="fl w-10">Init</span><span class="fl w-90">Character</span></div>
      ${table(state, emit)}
    </section>
    ${state.active ? '' : addCharacter(state, emit)}
  </body>
  `

  function toggleRun (evt) {
    evt.preventDefault()
    if (state.active) {
      return emit('tracker:end')
    }
    emit('tracker:start')
  }

  function next () {
    if (state.active) {
      emit('tracker:nextCharacter')
    }
  }
}

