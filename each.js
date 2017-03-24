module.exports = function eachModule (obj, iter, path) {
  path = path || []
  if (isModule(obj)) iter(obj, path.concat(k))
  for (var k in obj) {
    if (isObject(obj[k])) {
      eachModule(obj[k], iter, path.concat(k))
    }
  }
}
