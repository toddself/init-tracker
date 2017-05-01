var html = require('choo/html')

function addCharacter (state, emit) {
  return html`<section class="w-80 ma2 pa2 ba">
    <h2>Add a character</h2>
    <form onsubmit=${(evt) => evt.preventDefault()}>
      <label>Initiative: <input autoFocus="true" type="number" max="30" min="-30" step="1" class="num" oninput=${initInput} value="${state.entry.score}"></label>
      <label>Name: <input type="text" oninput=${nameInput} onkeydown=${submitOnEnter} value="${state.entry.name || ''}"></label>
      <button onclick=${add}>Add</button>
    </form>
  </section>`

  function initInput (evt) {
    update('initScore', evt)
  }

  function nameInput (evt) {
    update('name', evt)
  }

  function submitOnEnter (evt) {
    if (evt.key === 'Enter') {
      add(evt)
    }
  }

  function add (evt) {
    evt.preventDefault()
    emit('character:add')
  }

  function update (key, evt) {
    emit('character:input', {key: key, val: evt.target.value})
  }
}

module.exports = addCharacter
