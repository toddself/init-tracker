var choo = require('choo')
var html = require('choo/html')
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
`

var app = choo()
app.use(initStore)
app.route('/', mainView)
app.mount('body')

function table (state, emit) {
  console.log('hi i am here')
  var keys = Object.keys(state.init.order)
  keys.sort((a, b) => parseInt(a, 10) < parseInt(b, 10))
  return keys.map(key => {
    var chars = state.init.order[key]
    return chars.map(chr => html`<div class="cf row"><span class="fl w-10">${key}</span><span class="fl w-90">${chr}</span></div>`)
  })
}

function mainView (state, emit) {
  console.log('state is now', state)
  return html`
  <body class="${sf} ${st}">
    <h1>Initiative Tracker</h1>
    <section class="w-80 ma2 pa2 ba">
      <h2>Add a character</h2>
      <form onsubmit=${(evt) => evt.preventDefault()}>
        <label>Initiative: <input type="number" oninput=${(evt) => update('score', evt.target.value)} value="${state.init.score}"></label>
        <label>Name: <input type="text" oninput=${(evt) => update('name', evt.target.value)} value="${state.init.name}"></label>
        <button onclick=${(evt) => emit('add', {score: state.init.score, name: state.init.name})}>Add</button>
      </form>
    </section>
    <section class="w-80 ma2">
      <div class="cf bb mv2"><span class="fl w-10">Init</span><span class="fl w-90">Character</span></div>
      ${table(state, emit)}
    </section>
  </body>
  `

  function update (key, val) {
    emit('input', {key, val})
  }
}

function initStore (state, emitter) {
  if (!state.init) {
    state.init = {
      order: {},
      name: '',
      score: ''
    }
  }

  emitter.on('input', function (data) {
    state.init[data.key] = data.val
  })

  emitter.on('add', function (data) {
    if (!Array.isArray(state.init.order[state.init.score])) {
      state.init.order[state.init.score] = []
    }
    state.init.order[state.init.score].push(state.init.name)
    emitter.emit('render')
  })
}
