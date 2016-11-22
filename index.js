
var N = require('libnested')

function hasAll(set, keys) {
  return keys.every(function (k) {
    return !!set[k]
  })
}

function isString (s) {
  return 'string' === typeof s
}

function isEmpty (e) {
  for(var k in e) return false
  return true
}

var isArray = Array.isArray

var apply = require('./apply')

function filter(modules, fn) {
  if(Array.isArray(modules))
    return modules.filter(fn)
  var o = {}
    for(var k in modules)
      if(fn(modules[k], k, modules))
        o[k] = modules[k]
  return o
}

function append(obj, path, value) {
 var a = N.get(obj, path)
  if(!a) N.set(obj, path, a = [])
  a.push(value)
}

module.exports  = function combine () {
  //iterate over array, and collect new plugs which are satisfyable.

  var modules = [].slice.call(arguments).reduce(function (a, b) {
    for(var k in b)
      if(!b[k]) delete a[k]
      else      a[k] = b[k]
    return a
  }, {})

  var sockets = {}
  while (true) {
    var newSockets = {}
    //filter modules that have not been resolved yet.
    modules = filter(modules, function (module) {
      //if this module can now be resolved, initialize it and merge into newSockets
      if(N.each(module.needs, function (type, path) {
        if(!N.get(sockets, path)) return false
      })) {

        var m

        //collect the functions that this module needs.
        if(isString(modules.needs)) {
          m = module.create(sockets[module.needs])
        }
        else
          m = N.map(module.needs, function (type, path) {
            var a = N.get(sockets, path)
            if(isArray(a)) return apply[type](a)
            else           throw new Error('expected array at path:'+path.join('.'))
          })

        //create module, and get functions it returns.
        var exported = module.create(m)

        //for the functions it declares, merge these into newSockets
        if(isString(module.gives)) {
          (newSockets[module.gives] = newSockets[module.gives] || []).push(exported)
        }
        else
          N.each(module.gives, function (_, path) {
            append(newSockets, path, N.get(exported, path))
          })
      }
      else
        return true
    })

    if(isEmpty(newSockets))
      throw new Error('could not resolve all modules')
    else
      N.each(newSockets, function (_ary, path) {
        var ary = N.get(sockets, path) || N.set(sockets, path, [])
        _ary.forEach(function (e) { ary.push(e) })
      })
    if(isEmpty(modules))
      return sockets
  }

}



