var combine = require('../')

var blobs = {
  gives: {blobs: {add: true}},
  create: function () {
    return {blobs: {add: function (i) { console.log(i) }}}
  }
}

var image = {
  needs: {blobs: {add: 'first'}},
  gives: 'start',
  create: function (api) {
    return function (n) {
      api.blobs.add(n)
    }
  }
}

combine([blobs, image]).start[0]('hello')

