var Combine = require('../')
var test = require('tape')

test('combine is a function', function (t) {
  t.equal(typeof Combine, 'function')
  t.end()
})


test('combine one module', function (t) {
  const cats = {
    gives: 'cats',
    create: () => {
      t.ok(true, 'create is called')
      return () => () => true
    }
  }

  var api = Combine([cats])

  t.ok(api.cats, 'Combine returns an object with keys that match the keys given by all the modules')
  t.end()
})

test('combine two modules', function (t) {
  const cats = {
    gives: 'cats',
    create: () => {
      t.ok(true, 'create is called')
      return () => () => true
    }
  }

  const client = {
    needs: {cats: 'first'},
    gives: 'client',
    create: (api) => {
      t.ok(api.cats, 'create is called with object that has keys given by other modules')
      return () => () => true
    }
  }

  var api = Combine([client, cats])

  t.ok(api.cats && api.client, 'Combine returns an object with keys that match the keys given by all the modules')
  t.end()
})

test('combine takes an array of modules and throws if not an array', function (t) {
  t.plan(1)

  const cats = {
    gives: 'cats',
    create: () => {
      return () => () => true
    }
  }

  t.throws(() => Combine(cats))
})

test('one module depends on a module that depends on another', function (t) {
  const a = {
    needs: {b: 'first'},
    gives: 'a',
    create: (api) => api.b
  }
  const b = {
    needs: {c: 'first'},
    gives: 'b',
    create: (api) => api.c
  }
  const c = {
    gives: 'c',
    create: () => () => true
  }

  var api = Combine([a, c, b])
  t.ok(api.a[0]())
  t.end()
})

test('two modules depend on each other', function (t) {
  const cats = {
    needs: {dogs: 'first'},
    gives: 'cats',
    create: (api) => {
      t.ok(api.dogs, 'api provides the needed dep')
      return () => true
    }
  }

  const dogs = {
    needs: {cats: 'first'},
    gives: 'dogs',
    create: (api) => {
      t.ok(api.cats, 'api provides the needed dep')
      return () => true
    }
  }
  var api = Combine([cats, dogs])
  t.ok(api.cats && api.dogs, 'Combine returns an object with keys that match the keys given by all the modules')
  t.end()
})

test('a module depends on itself', function (t) {
  const factorial = {
    needs: {factorial: 'first'},
    gives: 'factorial',
    create: (api) => {
      t.ok(api.factorial, 'api provides the needed dep')
      return (num) => {
        if (num === 1) return 1
        else return num * api.factorial(num - 1)
      }
    }
  }

  var api = Combine([factorial])
  t.ok(api.factorial, 'Combine returns an object with keys that match the keys given by all the modules')
  t.equal(api.factorial[0](4), 24)
  t.end()
})

test('throws if need type is not first, map or reduce', function (t) {
  const cats = {
    gives: 'cats',
    create: () => {
      t.ok(true, 'create is called')
      return () => () => true
    }
  }

  const client = {
    needs: {cats: 'nope'},
    gives: 'client',
    create: (api) => {
      t.ok(api.cats, 'create is called with object that has keys given by other modules')
      return () => ({ client: api.cats })
    }
  }

  t.throws(() => Combine([client, cats]))

  client.needs.cats = 'first'
  var api = Combine([client, cats])
  t.ok(api, 'needs first is ok')

  client.needs.cats = 'map'
  api = Combine([client, cats])
  t.ok(api, 'needs map is ok')

  client.needs.cats = 'reduce'
  api = Combine([client, cats])
  t.ok(api, 'needs reduce is ok')

  t.end()
})

test('when a module needs a map of dependencies it receives an array of all the modules', function (t) {
  const a = {
    needs: {ideas: 'map'},
    gives: 'a',
    create: (api) => api.ideas
  }
  const b = {
    gives: 'ideas',
    create: () => () => 'sink'
  }
  const c = {
    gives: 'ideas',
    create: () => () => 'swim'
  }

  var api = Combine([a, b, c])
  t.ok(Array.isArray(api.a[0]()))
  t.end()
})

test('when a module needs the first of dependencies it receives the first module to return a value', function (t) {
  const a = {
    needs: {ideas: 'first'},
    gives: 'a',
    create: (api) => api.ideas
  }
  const b = {
    gives: 'ideas',
    create: () => () => null
  }
  const c = {
    gives: 'ideas',
    create: () => () => 'swim'
  }

  var api = Combine([a, b, c])
  t.equal(api.a[0](), 'swim')
  t.end()
})

test('when a module needs the first of dependencies it receives the first module to return a value. Depends on order passed to combine', function (t) {
  const a = {
    needs: {ideas: 'first'},
    gives: 'a',
    create: (api) => api.ideas
  }
  const b = {
    gives: 'ideas',
    create: () => () => 'sink'
  }
  const c = {
    gives: 'ideas',
    create: () => () => 'swim'
  }

  var api = Combine([a, b, c])
  t.equal(api.a[0](), 'sink')
  t.end()
})

test('when a module needs the reduce of dependencies it receives the result of applying all', function (t) {
  const a = {
    needs: {ideas: 'reduce'},
    gives: 'a',
    create: (api) => api.ideas
  }
  const b = {
    gives: 'ideas',
    create: () => (ideas) => ideas + 'sink'
  }
  const c = {
    gives: 'ideas',
    create: () => (ideas) => ideas + 'swim'
  }

  var api = Combine([a, b, c])
  t.equal(api.a[0](''), 'sinkswim')
  api = Combine([a, c, b])
  t.equal(api.a[0](''), 'swimsink', 'ordering works correctly')
  t.end()
})

test('a module can give multiple exports', function (t) {
  const a = {
    gives: {ideas: true, thoughts: true},
    create: () => ({
      ideas: () => 'idea',
      thoughts: () => 'thought'
    })
  }

  var api = Combine([a])
  t.ok(api.ideas && api.thoughts)
  t.end()
})

test('a module can need multiple imports', function (t) {
  const a = {
    needs: {ideas: 'first', thoughts: 'first'},
    gives: 'a',
    create: (api) => () => api.ideas() + api.thoughts()
  }

  const b = {
    gives: 'ideas',
    create: () => () => 'idea'
  }
  const c = {
    gives: 'thoughts',
    create: () => () => 'thought'
  }

  var api = Combine([a, b, c])
  t.equal(api.a[0](), 'ideathought')
  t.end()
})

test('throws an error when a needed module is not given', function(t) {
  const a = {
    needs: {ideas: 'first'},
    create: (api) => api.b 
  }
  t.throws(() => Combine([a]), /export needed but not given/)
  t.end()
})

test('map throws an error when no functions are provided to map', function(t) {
  const a = {
    gives: 'a',
    needs: {ideas: 'map'},
    create: (api) => api.ideas() 
  }
  const b = {
    gives: 'ideas',
    create: (api) => null 
  }
  t.throws( () => Combine([a, b]), /no functions available/)

  t.end()
})

test('reduce throws an error when no functions are provided to reduce', function(t) {
  const a = {
    gives: 'a',
    needs: {ideas: 'reduce'},
    create: (api) => api.ideas() 
  }
  const b = {
    gives: 'ideas',
    create: (api) => null 
  }
  t.throws( () => Combine([a, b]), /no functions available/)

  t.end()
})

test('first throws an error when no functions are provided to take first', function(t) {
  const a = {
    needs: {ideas: 'first'},
    create: (api) => api.ideas() 
  }
  const b = {
    gives: 'ideas',
    create: (api) => null 
  }
  t.throws( () => Combine([a, b]), /no functions available/)

  t.end()
})

test('combine throws an error when module does not have a create function', function (t) {
  t.throws(() => Combine([{}]), /did not have a create function/)
  t.end()
})

test('combine throws an error when not passed anything', function (t) {
  t.throws(() => Combine(), /could not resolve any modules/)
  t.end()
})

test('combine throws an error when passed a module with a create but no gives', function (t) {
  const a = {
    create: (api) => () => true 
  }
  t.throws(() => Combine([a]), /could not resolve any modules/)
  t.end()
})

test('combine throws an error when passed a module with a create when gives a string', function (t) {
  const a = {
    gives: 'nope',
    create: (api) => {} 
  }
  t.throws(() => Combine([a]), /export declared but not returned/)
  t.end()
})

test('combine throws an error when passed a module with a create when gives is an object', function (t) {
  const a = {
    gives: {nope: true},
    create: (api) => {} 
  }
  t.throws(() => Combine([a]), /export declared but not returned/)
  t.end()
})
