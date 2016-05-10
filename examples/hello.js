var combine = require('../')

var hi = {
  hello: function (name) {
    console.log(
      hi.decorate_hello.reduce(function (name, dec) {
        return dec(name)
      }, name)
    )
  },
  decorate_hello: []
}

var capitalize = {
  decorate_hello: function (name) {
    return name[0].toUpperCase() + name.substring(1).toLowerCase()
  }
}

var greet = {
  decorate_hello: function (name) {
    return 'Hello, '+name
  }
}
combine([hi, capitalize, greet])

hi.hello('dominic')


