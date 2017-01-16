'use strict'
var test = require('tape')
var freeze = require('deep-freeze')

var combine = require('../')

test('nested combine', function (t) {
  var modules = {
    a: {
      b: {
        c: {
          gives: 'yes',
          create: function () {
            return function () {
              return true
            }
          }
        }
      },
      d: {
        e: {
          needs: {
            yes: 'first'
          },
          gives: 'no',
          create: function (api) {
            return function () {
              return !api.yes()
            }
          }
        }
      }
    }
  }
  var sockets = combine(modules)
  t.equal(sockets.yes[0](), true)
  t.equal(sockets.no[0](), false)
  t.end()
})

test('nested combine with mulitple args passed to combine', function (t) {
  var module1 = {
    a: {
      b: {
        c: {
          gives: 'yes',
          create: function () {
            return function () {
              return true
            }
          }
        }
      }
    }
  }
  var module2 = {
    d: {
      e: {
        needs: {
          yes: 'first'
        },
        gives: 'no',
        create: function (api) {
          return function () {
            return !api.yes()
          }
        }
      }
    }
  }
  var sockets = combine(module1, module2)
  t.equal(sockets.yes[0](), true)
  t.equal(sockets.no[0](), false)
  t.end()
})

test('nested combine with other keys and values in surrounding objects', function (t) {
  var modules = {
    a: {
      z: null,
      x: true,
      y: {},
      b: {
        c: {
          z: null,
          x: true,
          y: {},
          gives: 'yes',
          create: function () {
            return function () {
              return true
            }
          }
        }
      },
      d: {
        z: null,
        x: true,
        y: {},
        e: {
          z: null,
          x: true,
          y: {},
          needs: {
            yes: 'first'
          },
          gives: 'no',
          create: function (api) {
            return function () {
              return !api.yes()
            }
          }
        }
      }
    }
  }
  var sockets = combine(modules)
  t.equal(sockets.yes[0](), true)
  t.equal(sockets.no[0](), false)
  t.end()
})

test('nested combine with other keys and values in surrounding objects will not modify object passed in', function (t) {
  var modules = {
    a: {
      z: null,
      x: true,
      y: {},
      b: {
        c: {
          z: null,
          x: true,
          y: {},
          gives: 'yes',
          create: function () {
            return function () {
              return true
            }
          }
        }
      },
      d: {
        z: null,
        x: true,
        y: {},
        e: {
          z: null,
          x: true,
          y: {},
          needs: {
            yes: 'first'
          },
          gives: 'no',
          create: function (api) {
            return function () {
              return !api.yes()
            }
          }
        }
      }
    }
  }
  freeze(modules)
  var sockets = combine(modules)
  t.equal(sockets.yes[0](), true)
  t.equal(sockets.no[0](), false)
  t.end()
})
