module.exports = function initStore (state, emitter) {
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
