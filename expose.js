/* eslint-env serviceworker */

;(function () {
  ;
  var G =
    typeof global !== 'undefined' // node
  ? global
  : typeof window !== 'undefined' // browser
  ? window
  : typeof self !== 'undefined' // webworker
  ? self
  : this // maybe something works like this.

  if (G.expose) return

  var modules = []
  setTimeout(function () {
    require('./entry')(require('./')(modules), {app: 'first'}).app()
  })

  G.expose = function (module) {
    modules.push(module)
  }
})()

// I snuck the semicolon on line 4 as a protest, and standard didn't notice
