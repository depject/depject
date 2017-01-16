module.exports = function assertGiven (gives, given) {
  if (!given) {
    throw new Error('create function should return a function or an object')
  }

  if (typeof gives === 'string' && typeof given !== 'function') {
    throw new Error('create function should return a function when gives is a string')
  } else if (isObject(gives) && isObject(given)) {
    if (!hasSameKeys(gives, given)) {
      throw new Error('keys returned by create must match keys in given')
    }
  }
}

function hasSameKeys (gives, given) {
  return hasEveryKey(gives, given) && hasEveryKey(given, gives)
}

function hasEveryKey (obj1, obj2) {
  return Object.keys(obj1).every(function (key) {
    return obj2[key]
  })
}

function isObject (o) {
  return o && typeof o === 'object'
}
