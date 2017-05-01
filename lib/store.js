var shortid = require('shortid')
var objKeySort = require('./oks')

function getActiveCharacter (state) {
  var currInit = state.initiative[state.current.initScore]
  var currInitIdx = currInit.findIndex(chr => chr.id === state.current.charId)
  return currInitIdx
}

function getNextInitScore (state, emitter) {
  var sorted = objKeySort.sort(state.initative)
  var currentScoreIndex = sorted.findIndex(key => state.current.initScore === key)
  var nextScoreIndex = currentScoreIndex + 1
  if (nextScoreIndex >= sorted.length) {
    emitter.emit('tracker:nextTurn')
    return sorted[0]
  }
  return sorted[nextScoreIndex]
}

function nextCharacter (state, emitter) {
  var nextChar = getActiveCharacter() + 1
  if (nextChar >= state.initiative[state.current.initScore].length) {
    state.current.initScore = getNextInitScore(state)
    state.current.charId = state.initiative[state.current.initScore][0]
  } else {
    state.current.charId = state.initiative[state.current.initScore][nextChar]
  }
  emitter.emit('render')
}

function nextTurn (state, emitter) {
  state.current.turn++
  emitter.emit('render')
}

function start (state, emitter) {
  state.current.initScore = objKeySort.highest()
  state.current.index = 0
  state.current.turn = 0
  state.started = true
  emitter.emit('render')
}

function end (state, emitter) {
  state.started = false
  state.current.initScore = null
  state.current.index = 0
  state.init.turn = 0
  emitter.emit('render')
}

function add (state, emitter) {
  if (state.started) {
    state.entry.initScore = objKeySort.lowest()
  }

  var newCharacter = Object.assign({}, state.entry)
  console.log('new character', newCharacter)
  newCharacter.id = shortid.generate()
  state.characters[newCharacter.id] = newCharacter

  if (!Array.isArray(state.initiative[newCharacter.initScore])) {
    state.initiative[newCharacter.initScore] = []
  }

  state.initiative[newCharacter.initScore].push(newCharacter.id)
  state.entry = Object.create(null)
  emitter.emit('render')
}

module.exports = function initStore (state, emitter) {
  state = Object.assign(state, {
    characters: {}, // list of characters
    initiative: {}, // key: init, val: array of characters at that init
    entry: {}, // for recording new characters
    active: false, // is the tracker active
    current: { // record keeping
      turn: 0,
      charId: null,
      initScore: 0
    }
  })

  emitter.on('tracker:nextCharacter', () => nextCharacter(state, emitter))
  emitter.on('tracker:nextTurn', () => nextTurn(state, emitter))
  emitter.on('tracker:start', () => start(state, emitter))
  emitter.on('tracker:end', () => end(state, emitter))

  emitter.on('character:add', () => add(state, emitter))
  emitter.on('character:input', function (data) {
    state.entry[data.key] = data.val
  })
}
