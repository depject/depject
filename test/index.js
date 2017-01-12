var Combine = require('../')
var test = require('tape')

test('combine is a function', function(t) {
  t.equal(typeof Combine, 'function')
  t.end()
})

test('combine one module', function(t) {
  t.plan(3)
  theCats = ['fluffy']

  const cats = {
    gives: 'cats',
    create: () => {
      t.ok(true, 'create is called')
      return (_cats) => { return {cats: () => _cats}}
    }
  }

  var modules = Combine([cats])
  
  t.ok(modules.cats, 'Combine returns an object with keys that match the keys given by all the modules')
  t.deepEqual(modules.cats[0](theCats).cats(), theCats, 'can depend on one module')
})

test('combine two modules', function(t) {
  t.plan(5)
  theCats = ['fluffy']
  theClient = ['client']

  const cats = {
    gives: 'cats',
    create: () => {
      t.ok(true, 'create is called')
      return (_cats) => {return {cats: id => _cats}}
    }
  }

  const client = {
    needs: {cats: 'first'},
    gives: 'client',
    create: (modules) => {
      t.ok(modules.cats, 'create is called with object that has keys given by other modules')
      return (_client) => {return {client: () => _client}}
    } 
  }

  var modules = Combine([client, cats])
  
  t.ok(modules.cats && modules.client, 'Combine returns an object with keys that match the keys given by all the modules')
  t.deepEqual(modules.cats[0](theCats).cats(), theCats, 'can depend on module one')
  t.deepEqual(modules.client[0](theClient).client(), theClient, 'can depend on module two')
})

test('combine takes an array of modules and throws if not an array', function(t) {

  t.plan(1)

  const cats = {
    gives: 'cats',
    create: () => {
      t.ok(true, 'create is called')
      return () => {cats: id => _cats}
    }
  }

  var modules = t.throws(() => Combine(cats))
})

test('one module depends on a module that depends on another', function(t) {

  t.end()
})

test('two modules depend on each other', function(t) {

  t.end()
})

test('a module depends on itself', function(t) {

  t.end()
})

test('needs must use either first or map', function(t) {

  const cats = {
    gives: 'cats',
    create: () => {
      t.ok(true, 'create is called')
      return () => {cats: id => _cats}
    }
  }

  const client = {
    needs: {cats: 'nope'},
    gives: 'client',
    create: (modules) => {
      t.ok(modules.cats, 'create is called with object that has keys given by other modules')
      return () => {client: () => cats.cats()}
    } 
  }

  var modules = t.throws(() => Combine([client, cats]))

  client.needs.cats = 'first'
  var modules = Combine([client, cats])
  t.ok(modules, 'needs first is ok')

  client.needs.cats = 'map'
  var modules = Combine([client, cats])
  t.ok(modules, 'needs map is ok')

  t.end()
})

test('when a module needs a map of dependencies it recieves an array of all the modules', function(t) {

  t.end()
})

test('when a module needs the first of dependencies it recieves the first module to return a value', function(t) {

  t.end()
})
