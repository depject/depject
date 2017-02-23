expose({
  needs: {hello: 'first'},
  gives: 'app',
  create: function (api) {
    return function () {
      var s = api.hello('depject')
      document.body.appendChild(document.createTextNode(s))
      console.log(s)
    }
  }
})

