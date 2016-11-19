var apply = require('../apply')

var hello = require('../examples/hello')
var Combine = require('../')
var tape = require('tape')

tape('simple', function (t) {
  t.equal(Combine([hello.hi, hello.greet]).hello[0]('depject'), 'Hello, depject')
  t.equal(Combine([hello.hi, hello.capitalize, hello.greet]).hello[0]('depject'), 'Hello, DEPJECT')

  t.end()
})

tape('entry', function (t) {
  t.equal(apply.first(Combine([hello.hi, hello.greet]).hello)('depject'), 'Hello, depject')
  t.equal(apply.first(Combine([hello.hi, hello.capitalize, hello.greet]).hello)('depject'), 'Hello, DEPJECT')

  t.end()
})


var isModule = require('../is')

tape('isModule', function (t) {

  t.notOk(isModule(hello))
  for(var k in hello)
    t.ok(isModule(hello[k]))
  t.end()

})


tape('from object', function (t) {
  t.equal(apply.first(Combine(
      {hi: hello.hi},
      {capitalize: hello.capitalize, greet: hello.greet}
   ).hello)('depject'), 'Hello, DEPJECT')

  t.end()
})


tape('from object', function (t) {
  t.equal(apply.first(Combine(
      hello,
      {capitalize: false}
   ).hello)('depject'), 'Hello, depject')

  t.end()
})



