function sort (obj) {
  return Object
    .keys(obj)
    .sort((a, b) => parseInt(a, 10) < parseInt(b, 10))
}

function highest (obj) {
  return sort(obj)[0]
}

function lowest (obj) {
  var sorted = sort(obj)
  return sorted[sorted.length - 1]
}

module.exports = {
  sort: sort,
  higest: highest,
  lowest: lowest
}
