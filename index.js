'use strict'

const keypress = require('keypress')
const chalk = require('chalk')
const log = require('single-line-log').stdout

module.exports = function (title, cb) {
  const items = []
  const isRaw = process.stdin.isRaw
  var active = true
  var moved = false
  var selected = 0

  keypress(process.stdin)
  process.stdin.on('keypress', onkeypress)
  if (!isRaw) process.stdin.setRawMode(true)
  process.stdin.resume()
  draw()

  function add (item) {
    if (!active) return
    if (typeof item === 'string') item = { name: item, sub: '', value: item }
    items.push(item)
    draw()
  }

  function onkeypress (ch, key) {
    if (!key) return
    if (key.ctrl && key.name === 'c') process.exit(130)
    if (key.name === 'up') {
      let nextsel = selected-1;
      while (nextsel > -1 && items[nextsel].skip) nextsel--
      if (nextsel < 0) return
      selected = nextsel
      draw()
    } else if (key.name === 'down') {
      let nextsel = selected+1
      while (nextsel < items.length && items[nextsel].skip) nextsel++
      if (nextsel >= items.length) return
      selected = nextsel
      moved = true
      draw()
    } else if (items.length > 0 && key.name === 'return') {
      select()
    }
  }

  function select () {
    active = false
    draw()
    process.stdin.pause()
    if (!isRaw) process.stdin.setRawMode(false)
    process.stdin.removeListener('keypress', onkeypress)
    cb(items[selected])
  }

  function draw () {
    var status = ''
    const CURSOR = '> '
    const SPACE  = '  '
    var q = chalk.green('? ') + chalk.bold(title)
    if (active) {
      if (items.length === 0) status = ' (waiting...)'
      else if (!moved) status = ' (use arrow keys)'

      log(items.reduce((s, item, index) => {
        const sub = item.sub ? '\n' + SPACE + item.sub : ''
        return s + (index === selected
          ? chalk.cyan(CURSOR + item.name) + sub
          : SPACE + item.name + sub) + '\n'
      }
      ,
      `${q}${status}\n`))

    } else {
      log(q + ' ' + chalk.cyan(items[selected].name) + '\n')
    }
  }

  return { add: add }
}
