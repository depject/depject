var N = require('libnested')

var isModule = require('./is')

function isString (s) {
  return typeof s === 'string'
}

function isEmpty (e) {
  for (var k in e) return false
  return true
}

function isFunction (f) {
  return typeof f === 'function'
}

function isObject (o) {
  return o && 'object' === typeof o
}

var isArray = Array.isArray

var apply = require('./apply')

function filter (modules, fn) {
  if (Array.isArray(modules)) {
    return modules.filter(fn)
  }
  var o = {}
  for (var k in modules) {
    if (fn(modules[k], k, modules)) {
      o[k] = modules[k]
    }
  }
  return o
}

function append (obj, path, value) {
  var a = N.get(obj, path)
  if (!a) N.set(obj, path, a = [])
  a.push(value)
}

module.exports = function combine () {
  // iterate over array, and collect new plugs which are satisfyable.

  var modules = [].slice.call(arguments).reduce(function (a, b) {
    eachModule(b, function (value, path) {
      var k = path.join('/')
      if(!value) 
        delete a[k]
      else 
        a[k] = value
    })
    return a
  }, {})

  var allNeeds = {}
  var allGives = {}

  for (var k in modules) {
    var module = modules[k]
    N.each(module.needs, function (v, path) {
      N.set(allNeeds, path, true)
    })
    if (isString(module.gives)) {
      N.set(allGives, [module.gives], true)
    } else {
      N.each(module.gives, function (v, path) {
        N.set(allGives, path, true)
      })
    }
  }

  N.each(allNeeds, function (_, path) {
    if (!N.get(allGives, path)) { throw new Error('export needed but not given ' + path.join('.') + ' in: ' + path) }
  })


  var sockets = {}
  while (true) {
    var newSockets = {}
    // filter modules that have not been resolved yet.
    modules = filter(modules, function (module, key) {
      // if this module cannot be resolved yet, keep it for next time.
      // collect the functions that this module needs.
      var m = N.map(module.needs, function (type, path) {
        var a = N.get(sockets, path)
        if (!a) {
          a = N.set(sockets, path, [])
        }
        return apply[type](a)
      })

      if(!isFunction(module.create)){throw new Error('did not have a create function', key)}
      // create module, and get function(s) it returns.
      var exported = module.create(m)
      if(!exported) {throw new Error('export declared but not returned for', key)}

      // for the functions it declares, merge these into newSockets
      if (isString(module.gives)) {
        append(newSockets, [module.gives], exported)
      } else {
        N.each(module.gives, function (_, path) {
          var fun = N.get(exported, path)
          append(newSockets, path, fun)
        })
      }
    })

    if (isEmpty(newSockets)) {
      throw new Error('could not resolve any modules')
    } else {
      N.each(newSockets, function (_ary, path) {
        var ary = N.get(sockets, path) || N.set(sockets, path, [])
        _ary.forEach(function (e) { ary.push(e) })
      })
    }
    if (isEmpty(modules)) { return sockets }
  }
}

function eachModule (obj, iter, _a) {
  _a = _a || []
  for(var k in obj) {
    if(isObject(obj[k])) {
      if(isModule(obj[k]))
        iter(obj[k], _a.concat(k))
      else 
        eachModule(obj[k], iter, _a.concat(k))
    }
    // falsy overrides modules
    else if (!obj[k])
      iter(obj[k], _a.concat(k))
  }
}
