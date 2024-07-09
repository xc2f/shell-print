const fs = require('fs')
const path = require('path')
const COMMANDS = require('../db')
const lodash = require('lodash')
const COMMAND_KEYS = Object.keys(COMMANDS).map(command =>
  command.toString().toLowerCase()
)
let snText = []

const handle = argv => {
  let { _, name = '', key = '', value = '' } = argv
  if (_[0]) {
    // 如果没有用-n或--name指定命令名，从_中取
    name = _[0]
  }
  if (!name) {
    return [
      {
        style: ['error'],
        text: '请指定命令名，见'
      },
      {
        style: ['help'],
        text: '--help'
      }
    ]
  }
  if (!COMMANDS[name]) {
    return [
      {
        style: ['error'],
        text: `${name}不存在`
      }
    ]
  }
  if (!key) {
    return [
      {
        style: ['error'],
        text: '请指定key值，见'
      },
      {
        style: ['help'],
        text: '--help'
      }
    ]
  }

  const filePath = path.resolve(`${__dirname}/../db/${name}.json`)

  // 追加数据
  let data = fs.readFileSync(`${filePath}`, 'utf-8')
  // 如果文件为空则赋值为空对象避免出错
  data = data || '{}'
  data = JSON.parse(data)
  const dataValue = lodash.get(data, key, '')
  if (dataValue) {
    eval(`delete data.${key}`)
  } else {
    // 值为空或不存在
    return [
      {
        style: ['help'],
        text: '不存在或还没搞'
      }
    ]
  }
  fs.writeFileSync(`${filePath}`, JSON.stringify(data, null, 4))
  return [
    {
      style: ['success'],
      text: `${name} > ${key} 已移除`
    }
  ]
}

module.exports = handle
