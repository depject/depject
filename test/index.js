

var hello = require('../examples/hello')
var Combine = require('../')
var tape = require('tape')

tape('simple', function (t) {
  t.equal(Combine([hello.hi, hello.greet]).hello[0]('depject'), 'Hello, depject')
  t.equal(Combine([hello.hi, hello.capitalize, hello.greet]).hello[0]('depject'), 'Hello, DEPJECT')

  t.end()
})

tape('entry', function (t) {
  t.equal(Combine([hello.hi, hello.greet], 'hello')('depject'), 'Hello, depject')
//  t.equal(Combine([hello.hi, hello.capitalize, hello.greet]).hello[0]('depject'), 'Hello, DEPJECT')

  t.end()
})
