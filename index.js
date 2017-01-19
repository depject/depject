var N = require('libnested')

var isModule = require('./is')
var apply = require('./apply')
var assertGiven = require('./assertGiven')

module.exports = function combine () {
  var nestedModules = Array.prototype.slice.call(arguments)
  var modules = flattenNested(nestedModules)

  assertDependencies(modules)

  var combinedModules = {}

  for (var key in modules) {
    var module = modules[key]
    var needed = getNeeded(module.needs, combinedModules)
    var given = module.create(needed)

    assertGiven(module.gives, given, key)

    addGivenToCombined(given, combinedModules, module)
  }

  if (isEmpty(combinedModules)) {
    throw new Error('could not resolve any modules')
  }

  return combinedModules
}

function isString (s) {
  return typeof s === 'string'
}

function isEmpty (e) {
  for (var k in e) return false
  return true
}

function isObject (o) {
  return o && typeof o === 'object'
}

function append (obj, path, value) {
  var a = N.get(obj, path)
  if (!a) N.set(obj, path, a = [])
  a.push(value)
}

function flattenNested (modules) {
  return modules.reduce(function (a, b) {
    eachModule(b, function (value, path) {
      var k = path.join('/')
      a[k] = value
    })
    return a
  }, {})
}

function assertDependencies (modules) {
  var allNeeds = {}
  var allGives = {}

  for (var key in modules) {
    var module = modules[key]
    N.each(module.needs, function (v, path) {
      N.set(allNeeds, path, key)
    })
    if (isString(module.gives)) {
      N.set(allGives, [module.gives], true)
    } else {
      N.each(module.gives, function (v, path) {
        N.set(allGives, path, true)
      })
    }
  }

  N.each(allNeeds, function (key, path) {
    if (!N.get(allGives, path)) { throw new Error('missing module, not given: (' + path.join('.') + '), needed by a module') }
  })
}

function addGivenToCombined (given, combined, module) {
  if (isString(module.gives)) {
    append(combined, [module.gives], given)
  } else {
    N.each(module.gives, function (_, path) {
      var fun = N.get(given, path)
      append(combined, path, fun)
    })
  }
}

function getNeeded (needs, combined) {
  return N.map(needs, function (type, path) {
    var dependency = N.get(combined, path)
    if (!dependency) {
      dependency = N.set(combined, path, [])
    }
    return apply[type](dependency)
  })
}

function eachModule (obj, iter, path) {
  path = path || []
  for (var k in obj) {
    if (isObject(obj[k])) {
      if (isModule(obj[k])) iter(obj[k], path.concat(k))
      else eachModule(obj[k], iter, path.concat(k))
    }
  }
}
