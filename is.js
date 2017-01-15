var N = require('libnested')

function isFunction (f) {
  return typeof f === 'function'
}

function isTrue (b) {
  return b === true
}

function isGives (o) {
  return isString(o) || N.each(o, isTrue)
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
  return typeof s === 'string'
}

module.exports = isModule
