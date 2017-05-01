var html = require('choo/html')
var sort = require('../lib/oks').sort

function table (state, emit) {
  var keys = sort(state.initiative)

  return keys.map(function (key) {
    var chars = state.initiative[key]
    var active = ''

    if (state.current.initScore === key) {
      active = 'active ba'
    }

    return chars.map(function (chr) {
      return html`<div class="cf row ${active}">
        <span class="fl w-10">${key}</span><span class="fl w-90">${state.characters[chr].name}</span>
      </div>`
    })
  })
}

module.exports = table
