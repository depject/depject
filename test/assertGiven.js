var test = require('tape')
var assertGiven = require('../assertGiven')

test('throws when given is falsey', function(t) {
  t.throws(()=> assertGiven('cats'), /create function should return a function or an object/)
  t.end()
})

test('ok when gives is a string and given is a function', function(t) {
  t.doesNotThrow(()=> assertGiven('cats', function() {}))
  t.end()
})

test('throws when gives is a string but given is not a function', function(t) {
  t.throws(()=> assertGiven('cats', {}))
  t.throws(()=> assertGiven('cats', 'cats'))
  t.end()
})

test('ok when gives is an object and given is an object with matching keys', function(t) {
  var given = {
    cats: function() {},
    dogs: function() {}
  }
  var gives = {
    cats: true,
    dogs: true
  }
  t.doesNotThrow(()=> assertGiven(gives, given))
  t.end()
})

test('throws when gives is an object and given is an object with keys that do not match', function(t) {
  var given = {
    dogs: function() {}
  }
  var gives = {
    cats: true,
    dogs: true
  }
  t.throws(()=> assertGiven(gives, given))
  t.end()
})

test('throws when gives is an object and given is an object with keys that do not match 2', function(t) {
  var given = {
    dogs: function() {},
    cats: function() {}
  }
  var gives = {
    cats: true,
  }
  t.throws(()=> assertGiven(gives, given))
  t.end()
})
