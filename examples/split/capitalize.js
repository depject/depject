expose({
  gives: 'decorate',
  create: function () {
    return function (name) {
      return name.toUpperCase()
    }
  }
})
