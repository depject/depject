# depject 

> simplest dependency injection

## Installation

```sh
$ npm install --save depject
```

## philosophy 

A module exposes features to be used by other modules,
and may also depend on features provided by other modules.
Any module system can do that. In the node module system,
modules declare exactly which modules they depend on.
That works well when the module does a very well defined task,
that can be abstractly solved. In other words, it works well
when the module solves a technical problem.

But it doesn't work so well when the module just represents an opinion.
Developer tools seem to be dominated by technical problems,
but user applications seem to be dominated by opinions.
There are many different ways something could be implemented,
no objectively optimal solution, and loads of pretty good ones.

The contemporary best practice is to embrace that, and create software
that has strong opinions. That takes a strong leader to make decisions,
compromises be dammed. I am building a p2p system, and have gone to
considerable effort to create a decentralized protocol. But then,
if we have a user interface with strong opinions, then that recentralizes development.

My strong opinion is to reject strong opinions. `depject` is a strategy to
deopinionate software. It should be easy to change any particular opinion.

Another way to look at this, is the goal is to make pull-requests that merge easily.
with node's module system, a dependant module must declare exactly which modules they depend on.
That means, to add a feature, you need to add a new file implementing it,
and also update files that use that.

To contrast, in `depject` if that feature is the same _shape_ as one already existing,
you only need to add that file. This means you can add merge two new features,
with out a conflict.

## patterns

### first - use the first module that has an opinion about a thing.

Say we have a system with multiple types of messages. Each type has a renderer.
We want to call all the renderers, and get the first one that knows how to handle that value.

### map - get each module's opinion about a thing.

Say we have a menu that is actions which may be performed on a thing.
We map the modules over that thing, and add all returned items to a menu.

### reduce - compose each modules opinion about a thing into one opinion.

We might want to allow other modules to decorate the value given by our module

## example

### Using `first`

```js
const combine = require('depject')

const cats = {
  gives: 'speak',
  create: () => (type) => type === 'cat' ? 'Meow' : undefined 
}

const dogs = {
  gives: 'speak',
  create: () => (type) => type === 'dog' ? 'Woof' : undefined 
}

const animals = {
  needs: {speak: 'first'},
  gives: 'animals',
  create: (modules) => () => () => modules.speak("dog")
}

var combined = combine([cats, dogs, animals])

var myAnimals = combined.animals[0]()

console.log(myAnimals())
//Woof
```

### Using `map`

```js
const combine = require('depject')

const cats = {
  gives: 'names',
  create: () => () => 'Fluffy' 
}

const dogs = {
  gives: 'names',
  create: () => () => 'Rex' 
}

const animals = {
  needs: {names: 'map'},
  gives: 'animals',
  create: (modules) => () => () => modules.names()
}

var combined = combine([cats, dogs, animals])

var myAnimals = combined.animals[0]()

console.log(myAnimals())
//['Fluffy', 'Rex']
```
## api

### modules

Each module is an object which exposes `{needs, gives, create}` properties. `needs` and `gives` describe the module features that this module requires, and exports.

`needs` is a map of names to types. `{<name> : "map"|"first"|"reduce"}`

`gives` Is a string name of it's export, or if there are multiple exports an object where each key is a name `{<name>: true,...}`. 

`create` Is a function that is called with an object connected to modules which provide the `needs` and must return a value which provides the `gives` or an object with keys that match what the module `gives`.

### combine

Actually connect all the modules together!
Takes an array of modules, resolves dependencies and injects them into each module. 

`combine([modules...])`

This will return an array object of arrays of exports.

### design questions

Should `combine` have a way to specify the public interface?

Should there be a way to create a routed plugin?
i.e. check a field and call a specific plugin directly?

How does this interact with interfaces provided remotely?
i.e. muxrpc?

## graphs!

once you have assembled the modules, you may also generate a `.dot` file of the
module graph, which can be interesting too look at.

``` js
//graph.js
console.log(require('depject/graph')(modules))
```

then run it through `dot`

`node graph.js | dot -Tsvg > graph.svg`

see also [patchbay graph](https://github.com/dominictarr/patchbay/blob/master/graph.svg)

## License

MIT © [Dominic Tarr](http://dominictarr.com)
