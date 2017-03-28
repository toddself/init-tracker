var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')

var sf = css('./node_modules/tachyons/css/tachyons.css')

var app = choo()
app.use(initStore)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
  <body class="${sf}">
    <section>
      <h1>Add a character</h1>
      <form onsubmit=${(evt) => evt.preventDefault()}>
        <label>Initiative: <input type="number" oninput=${(evt) => update('score', evt.target.value)} value="${state.init.score}"></label>
        <label>Name: <input type="text" oninput=${(evt) => update('name', evt.target.value)} value="${state.init.name}"></label>
        <button onclick=${(evt) => emit('add', {score: state.init.score, name: state.init.name})}>Add</button>
      </form>
    </section>
    <section>
      ${state.init.order.reverse().map((chars, idx) => html`<div><span>${idx}</span><span>${chars.join(', ')}</span></div>`)}
    </section>
  </body>
  `

  function update (key, val) {
    console.log('got', key, val)
    emit('input', {key, val})
  }
}

function initStore (state, emitter) {
  if (!state.init) {
    state.init = {
      order: [],
      name: '',
      score: ''
    }
  }

  emitter.on('input', function (data) {
    console.log(`updating ${data.key} to ${data.val}`)
    state.init[data.key] = data.val
    console.log(state.init)
  })

  emitter.on('add', function (data) {
    if (!Array.isArray(state.init.order[state.init.score])) {
      console.log(`state.init.order[${state.init.score}] was not an array`)
      state.init.order[state.init.score] = []
    }
    console.log(`adding ${state.init.name} to state.init.order[${state.init.score}]`)
    state.init.order[state.init.score].push(state.init.name)
  })
}
