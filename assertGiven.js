var N = require('libnested')

module.exports = function assertGiven (gives, given) {
  if (!given) {
    throw new Error('create function should return a function or an object')
  }

  if (typeof gives === 'string' && typeof given !== 'function') {
    throw new Error('create function should return a function when gives is a string')
  } else if (isObject(gives) && isObject(given)) {
    firstMissingKey(gives, given, function (path) {
      throw new Error('keys returned by create must match keys in given. missing: ' + path.join(', '))
    })
  }
}

function firstMissingKey (gives, given, onMissingKey) {
  return N.each(gives, function (value, path) {
    if (N.get(given, path) === undefined) {
      onMissingKey(path)
      return false
    }
  })
}

function isObject (o) {
  return o && typeof o === 'object'
}
