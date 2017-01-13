function dot (s) {
  return s.replace('.js', '_JS').replace(/-/g, '_')
}

function each (obj, iter) {
  for (var k in obj) { iter(obj[k], k, obj) }
}
function source (modules, fn) {
  for (var k in modules) {
    for (var j in modules[k]) {
      if (modules[k][j] === fn) return k
    }
  }
}

var exports = module.exports = function (modules, name) {
  return exports.toDot(exports.toGraph(modules), name)
}

exports.toGraph = function (modules) {
  var g = {}
  each(modules, function (e, name) {
    var o = {}
    for (var k in e) {
      if (Array.isArray(e[k])) {
        o[k] = e[k].map(function (v) {
          return source(modules, v)
        })
      }
    }

    g[name] = o
  })
  return g
}

exports.toDot = function (g, name) {
  var s = ''
  function log () {
    var args = [].slice.call(arguments)
    s += args.join(' ') + '\n'
  }

  log('digraph ' + (name || 'depject') + ' {')
  for (var k in g) {
    log('  ', dot(k), '[label="' + k + '"]')
  }
  log()
  for (k in g) {
    for (var j in g[k]) {
      log('  ', dot(j), '[label="' + j + '", shape="box"]')
    }
  }

  log()

  var edges = {}
  function once (edge) {
    if (edges[edge]) return
    edges[edge] = true
    log('  ', edge)
  }

  for (k in g) {
    for (j in g[k]) {
      once(dot(k) + '->' + dot(j))
      if (Array.isArray(g[k][j])) {
        g[k][j].forEach(function (dest) {
          if (dest) {
            once(dot(j) + '->' + dot(dest))
          }
        })
      } else { once(dot(j) + '->' + dot(g[k][j])) }
    }
  }

  log('}')

  return s
}

