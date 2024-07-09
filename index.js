#!/usr/bin/env node
/**
 * @author Qin Fen
 * @email hellowd93@163.com
 * @create date 2019-03-22 23:59:11
 * @modify date 2019-03-22 23:59:11
 * @desc [Entrance]
 */
// ! DO NOT PUT ANY CREDENTIAL INFORMATION

const colors = require('colors')

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
  default: 'white',
  success: 'green'
})

// const shell = require('shelljs')
const argv = require('yargs')
  .option('h', {
    alias: 'help'
  })
  .option('n', {
    alias: 'name',
    describe: '命令名'
  })
  .option('k', {
    alias: 'key',
    describe: '命令下的key值'
  })
  .option('v', {
    alias: 'value',
    describe: '命令下的value'
  })
  .option('a', {
    alias: 'all',
    describe: '列出全部'
  })
  // .choices('i', ['peanut-butter', 'jelly', 'banana', 'pickles'])
  .help().argv
// const moment = require('moment')
// const KEYS = require('./db/index')
const readDB = require('./utils/readDB')
const addDB = require('./utils/addDB')
const removeDB = require('./utils/removeDB')

const PRESERVE_COMMANDS = ['add', 'remove', 'update', 'empty', 'set']

// handle command line argvs
const argvs = argv._
// console.log(argv)
// console.log(argvs)
let snText = []
const command = argvs[1]
if (PRESERVE_COMMANDS.indexOf(command) === -1) {
  snText = readDB(argv)
} else {
  switch (command) {
    case 'add':
      snText = addDB(argv)
      break
    case 'remove':
      snText = removeDB(argv)
    // case 'todo':
    // snText = todo(argv)
    default:
      break
  }
}
let consoleStr = ''
snText.forEach(item => {
  consoleStr += colors[item.style[0] || 'default'](item.text)
})
// 或注册一个全局console函数
// global.console = (log = []) => {
//   log.forEach(item => {
//     consoleStr += colors[item.style[0] || 'default'](item.text)
//   })
// }
console.log(consoleStr)
