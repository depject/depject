var N = require('libnested')

var isArray = Array.isArray

var apply = require('./apply')

module.exports = function combine () {
  var modules = getModules([].slice.call(arguments))

  var allNeeds = getAllNeeds(modules)
  var allGives = getAllGives(modules)

  var missing = getNeedsNotGiven(allNeeds, allGives)

  missing.forEach(function (path) {
    console.log('MISSING', path)
  })

  var deps = getDependencyOrder(modules, allGives)
  console.log('deps', deps)

  var sockets = {}

  for (var i = 0; i < deps.length; i++) {
    var module = deps[i]
    var key = module.key
    // collect the functions that this module needs
    var imports = resolveNeeds(sockets, module)
    // create module, and get function(s) it returns.
    if(!isFunction(module.create))
      throw new Error('module:'+key + ' did not have a create function')
    var exported = module.create(imports)

    // for the functions it declares, merge these into newSockets
    if(isString(module.gives))
      append(sockets, [module.gives], exported)
    else
      N.each(module.gives, function (_, path) {
        var fun = N.get(exported, path)
        if(!isFunction(fun))
          throw new Error('export declared but not returned '+path.join('.') + ' in:'+key)
        append(sockets, path, fun)
      })
  }

  return sockets
}

function getModules (moduleSets) {
  return moduleSets.reduce(function (a, b) {
    for(var k in b)
      if(!b[k]) delete a[k]
      else {
        a[k] = b[k]
        // save key to module
        a[k].key = k
      }
    return a
  }, {})
}


function getAllNeeds (modules) {
  var allNeeds = {}
  for (var k in modules) {
    var module = modules[k]
    N.each(module.needs, function (v, path) {
      append(allNeeds, path, module)
    })
  }
  return allNeeds
}

function getAllGives (modules) {
  var allGives = {}
  for (var k in modules) {
    var module = modules[k]
    if(isString(module.gives))
      append(allGives, [module.gives], module)
    else
      N.each(module.gives, function (v, path) {
        append(allGives, path, module)
      })
  }
  return allGives
}

function getNeedsNotGiven (allNeeds, allGives) {
  // check every need is given
  var missing = []
  N.each(allNeeds, function (_, path) {
    if(!N.get(allGives, path))
      missing.push(path)
  })
  return missing
}

function getDependencyOrder (modules, allGives) {
  var resolved = []
  var unresolved = []
  for (var k in modules) {
    var module = modules[k]
    resolveDependencyOrder(module, allGives, resolved, unresolved)
  }
  return resolved
}

function resolveDependencyOrder (module, allGives, resolved, unresolved) {
  unresolved.push(module)
  N.each(module.needs, function (v, path) {
    var deps = N.get(allGives, path)
    for (var i = 0; i < deps.length; i++) {
      var dep = deps[i]
      // if circular dependency (we've seen it before)
      if (unresolved.indexOf(dep) !== -1)
        console.log('circular dependency:', module, dep)
      else
        resolveDependencyOrder(dep, allGives, resolved, unresolved)
    }
  })
  // don't add same dependency twice
  if (resolved.indexOf(module) === -1)
    resolved.push(module)
  unresolved.splice(unresolved.indexOf(module), 1)
}


// collect the functions that this module needs.
function resolveNeeds (sockets, module) {
  return N.map(module.needs, function (type, path) {
    var a = N.get(sockets, path)
    if(!a)
      a = N.set(sockets, path, [])
    return apply[type](a)
  })
}

function append(obj, path, value) {
 var a = N.get(obj, path)
  if(!a) N.set(obj, path, a = [])
  a.push(value)
}

function isString (s) {
  return 'string' === typeof s
}


function isFunction (f) {
  return 'function' === typeof f
}

