const fs = require('fs')
const path = require('path')
const lodash = require('lodash')
const COMMANDS = require('../db')
const ENHANCES = require('../enhance')
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
  // 检查是否存在该文件
  const filePath = path.resolve(`${__dirname}/../db/${name}.json`)
  let data = {
    [key]: value
  }
  if (!COMMANDS[name]) {
    // 新建文件
    // console.log(createPath)
    fs.writeFileSync(`${filePath}`, JSON.stringify(data, null, 4))
    return [
      {
        style: ['success'],
        text: `${name}.json文件已新建，调用命令`
      },
      {
        style: ['help'],
        text: `show ${name} ${key}`
      }
    ]
  }
  // 追加数据
  // enhance
  // TODO enhance应该在新建文件前处理
  if (ENHANCES[name]) {
    const enhanceHandle = require(ENHANCES[name])
    data = enhanceHandle(data, 'add')
    fs.writeFileSync(`${filePath}`, JSON.stringify(data.data, null, 4))
    return data.snText
  } else {
    // 如果文件为空则赋值为空对象避免出错
    let existData = fs.readFileSync(`${filePath}`, 'utf-8')
    existData = existData || '{}'
    data = lodash.set(JSON.parse(existData), key, value)
    fs.writeFileSync(`${filePath}`, JSON.stringify(data, null, 4))
    return [
      {
        style: ['success'],
        text: `${name}.json文件已更新，调用命令`
      },
      {
        style: ['help'],
        text: `show ${name} ${key}`
      }
    ]
  }
}

module.exports = handle
