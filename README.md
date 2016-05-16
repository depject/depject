# depject

minimal dependency injection

## module api

a module is an object with named functions and arrays.
functions represent _plugs_ and arrays represent _sockets_.
plugs are plugged into sockets. modules may expose plugs,
and may create new sockets. The creator of a socket gets to choose
the signature of that socket, i.e. what arguments it's called with,
and also how multiple plugs are combined together.

plugs are connected to sockets with the same name, so be sure to name wisely.
(we can improve this, once more experience with this sort of system is gained)

## example

``` js
var combine = require('depject')

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


function toCapitalized(word) {
    return word[0].toUpperCase() + word.substring(1).toLowerCase()
  }

var capitalize = {
  decorate_hello: toCapitalized
}

var greet = {
  decorate_hello: function (name) {
    return 'Hello, '+name
  }
}
combine([hi, capitalize, greet])

hi.hello('dominic')
```

in this case, hello becomes:

``` js
function (name) {
  return console.log('Hello, '+toCapitalized(name))
}
```

except that it's complete decoupled from hello, and you didn't need
to bother the maintainer of `hello` because you wanted it capitalized.

## api

### combine ([modules...])

takes an array of modules and plugs every plug into the relavant socket.

## License

MIT



