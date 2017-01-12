var N = require('libnested')

function isFunction (f) {
  return 'function' === typeof f
}

function isObject (o) {
  return o && 'object' === typeof o
}

function isTrue (b) {
  return b === true
}

function isGives (o) {
  return isString(o) || N.each(o, isTrue)
}

function isAll (o, test) {
  for(var k in o)
    if(!test(o[k])) return false
  return true
}

function isType (t) {
  return ({map: true, first: true, reduce: true})[t]
}

function isNeeds (n) {
  return N.each(n, isType)
}

function isModule (m) {
  return isFunction(m.create) && isGives(m.gives) && (!m.needs || isNeeds(m.needs))
}

function isString (s) {
  return 'string' === typeof s
}

function isEmpty (e) {
  for(var k in e) return false
  return true
}

module.exports = isModule
