
;(function () {

  var G =
    typeof global !== 'undefined' ? global //node
  : typeof window !== 'undefined' ? window //browser
  : typeof self   !== 'undefined' ? self   //webworker
  :                                 this   //???

  console.log('depject!')

  if(G.expose) return

  var modules = {}
  setTimeout(function () {
    console.log(modules)
    require('./entry')(require('./')(modules), {app: 'first'}).app()
  })

  G.expose = function (module) {
    console.log('EXPOSE', module)
//    var o = {}
    modules[Math.random()] = module
  //  modules.push(o)
  }

  console.log('G', G.expose, G)

})()



