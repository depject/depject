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
      for(var i = 0; i < funs.length; i++) {
        var _value = funs[i](value)
        if(_value) return _value
      }
    }
  },
  map: function (funs) {
    return function (value) {
      return funs.map(function (fn) {
        return fn(value)
      })
    }
  }
}

