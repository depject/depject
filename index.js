
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

var apply = require('./apply')

function keys (obj) {
  return obj ? Object.keys(obj) : []
}

//perform a single pass over the modules,
//and satisify ever module which can now be resolved
//with the current sockets.

//apply this function repeatedly, until either there are
//no more plugs, or there was a pass which did not satisfy anything.

function eachPlug(gives, plugs, iter) {
  if(isString(gives))
    iter(gives, plugs)
  else
    for(var k in module.gives)
      iter(k, plugs[k], gives[k])

}

function append(obj, key, value) {
  obj[key] = (obj[key] || []).concat(value)
}

function setup(sockets, needs) {
  var _sockets = {}
  if(isString(needs)) {
    var name = parts[0]
    var type = parts[1]
    return apply[type](sockets[name])
  }
  else {

  }
}

function satisfy(sockets, module, add) {
  console.log('SAT?', module)
  var added = false
  if(!module.needs) {
    append(add, module.gives, module.create())
    return true
  }
  else if(hasAll(sockets, keys(module.needs))) {
    var _sockets = {}
    keys(module.needs).forEach(function (name) {
      _sockets[name] = apply[module.needs[name]](sockets[name])
    })
    eachPlug(module.gives, module.create(_sockets), function (name, fn) {
      append(add, name, fn)
    })
    return true
  }
  return false
}

module.exports  = function combine (modules, entry, type) {
  //iterate over array, and collect new plugs which are satisfyable.

  if(entry)
    modules.push({
      needs: entry+':'+(type||'first'),
      create: function (entry) {
        return entry
      }
    })

  var sockets = {}
  while (true) {
    var newSockets = {}
    var _modules = modules
    modules = modules.filter(function (module) {
      return !satisfy(sockets, module, newSockets)
    })

    if(isEmpty(newSockets))
      throw new Error('could not resolve all modules')
    else
      for(var k in newSockets)
        append(sockets, k, newSockets[k])

    if(!modules.length)
      return sockets
  }

}

