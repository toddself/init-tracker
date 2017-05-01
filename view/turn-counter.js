var html = require('choo/html')

function turnCounter (state, emit) {
  return html`<section class="w-80 ma2">
    <span class="b">Turn:</span> ${state.current.turn}
  </section>`
}

module.exports = turnCounter
