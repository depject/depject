expose({
  needs: {decorate: 'reduce'},
  gives: 'hello',
  create: function (sockets) {
    return function (name) {
      return sockets.decorate(name)
    }
  }
})
