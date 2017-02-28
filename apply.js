module.exports = {
  reduce: function (funs) {
    return function (value, context) {
      return funs.reduce(function (value, fn) {
        return fn(value, context)
      }, value)
    }
  },
  first: function (funs) {
    return function (value) {
      var args = [].slice.call(arguments)
      for (var i = 0; i < funs.length; i++) {
        var _value = funs[i].apply(this, args)
        if (_value) return _value
      }
    }
  },
  map: function (funs) {
    return function (value) {
      var args = [].slice.call(arguments)
      return funs.map(function (fn) {
        return fn.apply(this, args)
      })
    }
  }
}

