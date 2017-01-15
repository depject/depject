var test = require('tape')

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
