var combine = require('../')

var hi = {
  needs: {decorate: 'reduce'},
  gives: 'hello',
  create: function (sockets) {
    return function (name) {
      return sockets.decorate(name)
    }
  }
}

var capitalize = {
  gives: 'decorate',
  create: function () {
    return function (name) {
      return name.toUpperCase()
    }
  }
}

var greet = {
  gives: 'decorate',
  create: function () {
    return function (name) {
      return 'Hello, ' + name
    }
  }
}

module.exports = {
  hi: hi, capitalize: capitalize, greet: greet
}

if (!module.parent) {
  console.log(combine([hi, capitalize, greet]).hello[0]('dominic'))
}

