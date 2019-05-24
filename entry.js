var N = require('libnested')

var apply = require('./apply')

module.exports = function entry (sockets, needs) {
  return N.map(needs, function (type, path) {
    var dependency = N.get(sockets, path)
    if (!dependency) {
      dependency = N.set(sockets, path, [])
    }
    
    if (!apply[type]) throw new Error(`depeject#entry: typo "${type}", choose one of: first | map | reduce`)
    return apply[type](dependency, path.join('.'))
  })
}
