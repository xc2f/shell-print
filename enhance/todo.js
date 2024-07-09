/**
 * @author Qin Fen
 * @email hellowd93@163.com
 * @create date 2019-03-28 20:14:33
 * @modify date 2019-03-28 20:14:33
 * @desc [TodoList]
 */
const fs = require('fs')
const path = require('path')
const lodash = require('lodash')
const moment = require('moment')

// now
// const NOW = Date.now()
const TODAY = moment().format('YY-MM-DD_ddd')
const TIME = moment().format('HH:mm')
const filePath = path.resolve(`${__dirname}/../db/todo.json`)
// const caseMediaContainerName = `case_media:${moment().format('YYMMDD')}_${NOW}`

// const caseMediaContainerName = 'caseMediaContainerName'

// const replacer = (k, v) => {
//   switch (k) {
//     case 'build':
//       v = v || ''
//       v = v.replace(/\$\{.+?\}/gi, caseMediaContainerName)
//       break

//     default:
//       break
//   }
//   return v
// }
const fileData = fs.readFileSync(`${filePath}`, 'utf-8') || '{}'
const _fileData = JSON.parse(fileData)

const addTodo = data => {
  const keys = Object.keys(data)
  const data_key = `${TIME}_${keys[0]}`
  const insertData = _fileData[TODAY]
    ? _fileData[TODAY][data_key]
      ? _fileData[TODAY][data_key].concat(`; ${data[keys[0]]}`)
      : ''.concat(`${data[keys[0]]}`)
    : ''.concat(`${data[keys[0]]}`)
  data = lodash.set(_fileData, TODAY, {
    ..._fileData[TODAY],
    [data_key]: insertData
  })
  // fs.writeFileSync(`${filePath}`, JSON.stringify(data, null, 4))
  return {
    data,
    snText: [
      {
        style: ['success'],
        text: `todo.json文件已更新，调用命令`
      },
      {
        style: ['help'],
        text: `show todo ${TODAY}`
      }
    ]
  }
}

const showTodo7Days = data => {
  const todo7DaysData = {}
  const keys = Object.keys(data)
  keys
    // map会处理每一项，提前return会返回undefined
    .filter(key => {
      // 2100年解决此bug，假如那时我还活着的话
      const day = '20'.concat(key.split('_')[0])
      const day7Before = moment().subtract(7, 'd').format('YYYY-MM-DD')
      // console.log(day, day7Before)
      if (moment(day).isAfter(day7Before)) {
        return key
      }
      // console.log(day7Before)
    })
    .forEach(key => {
      todo7DaysData[key] = data[key]
    })
  return todo7DaysData
}

const handle = (data, type) => {
  // console.log(data, type)
  let snText
  switch (type) {
    case 'add':
      data = addTodo(data)
      break
    case 'all':
      break
    default:
      data = showTodo7Days(data)
      snText = []
      break
  }
  if (type === 'add') return data
  const reverseData = {}
  Object.keys(data)
    .reverse()
    .forEach(key => {
      reverseData[key] = data[key]
    })
  return reverseData
}

module.exports = handle
