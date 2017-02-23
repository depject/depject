expose({
  gives: 'decorate',
  create: function () {
    return function (name) {
      return 'Hello, ' + name
    }
  }
})
