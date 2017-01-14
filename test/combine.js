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

test('sequential combination of nested modules', function (t) {
  var module_extra = {
    message: {
      fancy_author: {
        needs: { message_author: 'first' },
        gives: 'fancy_author',
        create: (api) => {
          return () => '~' + api.message_author() + '~'
        }
      }
    }
  }
  var module_base = {
    message: {
      author: {
        gives: 'message_author',
        create: (api) => {
          return () => 'gertrude'
        }
      }
    }
  }
  var sockets = combine(module_extra, module_base)

  t.equal(sockets.message_author[0](), 'gertrude')
  t.equal(sockets.fancy_author[0](), '~gertrude~')
  t.end()
})

