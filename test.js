'use strict'

// for now just test that the code load and runs without throwing
var menu = require('./')
var foos = menu('foo', function () {})
foos.add({head: 'bar', head_s: 'bar (2 left)', body: 'body\n'})
foos.add('bar')
foos.add({head: 'skip', body: 'body\n', skip: true})
foos.add({head: 'bar', head_s: 'bar (done)'})
foos.add('bar')

//process.exit()
