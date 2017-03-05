'use strict'

// for now just test that the code load and runs without throwing
var menu = require('./')
var foos = menu('foo', function () {})
foos.add({name: 'bar', sub: 'sub\n', value: 'bar'})
foos.add('bar')
foos.add({name: 'skip', sub: 'sub\n', value: 'bar', skip: true})
foos.add('bar')
foos.add('bar')

//process.exit()
