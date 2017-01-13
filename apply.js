module.exports = {
  reduce: function (funs) {
    return function (value) {
      return funs.reduce(function (value, fn) {
        return fn(value)
      }, value)
    }
  },
  first: function (funs) {
    return function (value) {
      if (!funs.length) throw new Error('depject.first: plugins not loaded yet')
      var args = [].slice.call(arguments)
      for (var i = 0; i < funs.length; i++) {
        var _value = funs[i].apply(this, args)
        if (_value) return _value
      }
    }
  },
  map: function (funs) {
    return function (value) {
      if (!funs.length) throw new Error('depject.map: plugins not loaded yet')
      var args = [].slice.call(arguments)
      return funs.map(function (fn) {
        return fn.apply(this, args)
      })
    }
  }
}

