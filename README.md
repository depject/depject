# depject

minimal dependency injection

## module api

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

say we have a menu that is actions which may be performed on a thing.
We map the modules over that thing, and add all returned items to a menu.


## api

Each module is an object which exposes `{needs, gives, create}` properties.
`needs` and `gives` describe the module features that this module requires,
and exports.

`gives` is a sting name of it's export, or if there are multiple exports,
and object where each key is a name `{<name>: true,...}`.

`needs` is a map of names to types. `{<name> : "map"|"first"}`
the type determines how the modules returned values are handled.
If it's `'first'` then the first non null value is returned.
if it's `'map'` then an array of values is returned.

`create` is a function that is called with an object connected to modules which provide
the `needs` and must return a value which provides the `gives`. 

### combine

actually connect all the modules together!

`combine([modules...])`

this will return an array object of arrays of plugs.

### design questions

should `combine` have a way to specify the public interface?
should there be a way to create a routed plugin?
i.e. check a field and call a specific plugin directly?
how does this interact with interfaces provided remotely,
i.e. muxrpc?

## example


## api

### combine ([modules...])

takes an array of modules and plugs every plug into the relavant socket.

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

MIT




















