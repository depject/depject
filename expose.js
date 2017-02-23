
;(function () {

  var G =
    typeof global !== 'undefined' ? global //node
  : typeof window !== 'undefined' ? window //browser
  : typeof self   !== 'undefined' ? self   //webworker
  :                                 this   //???

  if(G.expose) return

  var modules = []
  setTimeout(function () {
    require('./entry')(require('./')(modules), {app: 'first'}).app()
  })

  G.expose = function (module) {
    modules.push(module)
  }

  console.log(G)

})()











