function toErrorMessage (type, path) {
  return 'depject/' + type + ': no functions available at:' + path
}
module.exports = {
  reduce: function (funs, path) {
    return function (value) {
      if (!funs.length) throw new Error(toErrorMessage('reduce', path))
      return funs.reduce(function (value, fn) {
        return fn(value)
      }, value)
    }
  },
  first: function (funs, path) {
    return function (value) {
      if (!funs.length) throw new Error(toErrorMessage('first', path))
      var args = [].slice.call(arguments)
      for (var i = 0; i < funs.length; i++) {
        var _value = funs[i].apply(this, args)
        if (_value) return _value
      }
    }
  },
  map: function (funs, path) {
    return function (value) {
      if (!funs.length) throw new Error(toErrorMessage('map', path))
      var args = [].slice.call(arguments)
      return funs.map(function (fn) {
        return fn.apply(this, args)
      })
    }
  }
}
