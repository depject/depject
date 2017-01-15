var N = require('libnested')

var isModule = require('./is')
var apply = require('./apply')

module.exports = function combine () {
  var modules = flattenNested(arguments)

  throwIfMissingDeps(modules)

  var api = {}

  eachModule(modules, function (module, key) {
    var deps = buildDeps(module.needs, api)
    var exported = module.create(deps)

    if (!exported) { throw new Error('export declared but not returned for', key) }
    addExportsToApi(exported, api, module)
  })

  if (isEmpty(api)) {
    throw new Error('could not resolve any modules')
  }

  return api
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

function flattenNested (args) {
  return [].slice.call(args).reduce(function (a, b) {
    eachModule(b, function (value, path) {
      var k = path.join('/')
      if (!value) delete a[k]
      else a[k] = value
    })
    return a
  }, {})
}

function throwIfMissingDeps (modules) {
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
    if (!N.get(allGives, path)) { throw new Error('export needed but not given' + path.join('.') + ' in: ' + path) }
  })
}

function addExportsToApi (exported, api, module) {
  if (isString(module.gives)) {
    append(api, [module.gives], exported)
  } else {
    N.each(module.gives, function (_, path) {
      var fun = N.get(exported, path)
      append(api, path, fun)
    })
  }
}

function buildDeps (needs, api) {
  return N.map(needs, function (type, path) {
    var a = N.get(api, path)
    if (!a) {
      a = N.set(api, path, [])
    }
    return apply[type](a)
  })
}

function eachModule (obj, iter, _a) {
  _a = _a || []
  for (var k in obj) {
    if (isObject(obj[k])) {
      if (isModule(obj[k])) iter(obj[k], _a.concat(k))
      else eachModule(obj[k], iter, _a.concat(k))
    } else if (!obj[k]) iter(obj[k], _a.concat(k))
  }
}
