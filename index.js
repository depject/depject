


function copy(from, to) {
  (from || []).forEach(function (e) { to.push(e) })
}


function combine(args) {
  var plugs = {}
  var sockets = {}
  args.forEach(function (mod) {
    for(var k in mod) {
      if(Array.isArray(mod[k])) {
        if(sockets[k])
          throw new Error('duplicate socket apis: '+k)
        sockets[k] = mod[k]
      }
      else if('function' == typeof mod[k])
        (plugs[k] = plugs[k] || []).push(mod[k])
    }
  })

  for(var k in sockets) copy(plugs[k], sockets[k])

  return {plugs: plugs, sockets: sockets}
}


module.exports = combine
