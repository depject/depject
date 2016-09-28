
function copy(from, to) {
  (from || []).forEach(function (e) {
    to.forEach(function (to) { to.push(e) })
  })
}


function each(obj, iter) {
  for(var k in obj)
    iter(obj[k], k, obj)
}

function isFunction (f) {
  return 'function' === typeof f
}

var isArray = Array.isArray

function isObject(o) {
  return o && 'object' === typeof o && !isArray(o)
}

function combine() {

  var modules = [].slice.call(arguments).reduce(function (a, b) {
    for(var k in b)
      if(!b[k]) delete a[k]
      else      a[k] = b[k]
    return a
  }, {})

  var plugs = {}
  var sockets = {}
  each(modules, function (mod) {
    for(var k in mod) {
      if(Array.isArray(mod[k]))
        (sockets[k] = sockets[k] || []).push(mod[k])
      else if('function' == typeof mod[k])
        (plugs[k] = plugs[k] || []).push(mod[k])
    }
  })

  for(var k in sockets) copy(plugs[k], sockets[k])

  return {plugs: plugs, sockets: sockets}
}

module.exports = combine

