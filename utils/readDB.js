/**
 * @author Qin Fen
 * @email hellowd93@163.com
 * @create date 2019-03-23 00:39:32
 * @modify date 2022-02-16 18:37:07
 * @desc [根据command参数读取文件内容]
 */
const fs = require('fs')
const COMMANDS = require('../db')
const ENHANCES = require('../enhance')
const isObject = require('./isObject')

const COMMAND_KEYS = Object.keys(COMMANDS).map(command =>
  command.toString().toLowerCase()
)
const FORMAT = ['=========== + ', ' + ===========\n']

module.exports = argv => {
  // 将所有key置为字符串
  const { _ = [], a = false } = argv
  const argvs = _.map(key => key.toString())
  // console.log(argvs)
  // 未指定查询key
  if (argvs.length === 0) {
    // return `Avaliable keys: ${COMMAND_KEYS.toString()}.`
    return [
      {
        style: ['help'],
        text: `Avaliable keys: ${COMMAND_KEYS.toString()}.`
      }
    ]
  }

  const command = argvs[0].toLowerCase()
  // 未找到查询key
  if (COMMAND_KEYS.indexOf(command) === -1) {
    return [
      {
        style: ['error'],
        text: `No \`${command}\` key exists.\n`
      },
      {
        style: ['help'],
        text: `Avaliable keys: ${COMMAND_KEYS.toString()}.`
      }
    ]
  }

  const commandUpperCase = command.toUpperCase() || 'COMMAND'
  let data
  let snText = []

  try {
    // 解析文本内容
    data = JSON.parse(fs.readFileSync(COMMANDS[command], 'utf-8') || '{}')
    // 如果有enhance增强，处理
    // console.log(ENHANCES)
    // data = Enhance(data)
    if (ENHANCES[command]) {
      const enhanceHandle = require(ENHANCES[command])
      // console.log(enhanceHandle)
      data = enhanceHandle(data, a ? 'all' : '')
    }
  } catch (error) {
    throw error
  }

  if (argvs[1] === undefined) {
    // command后无参数
    snText.push({
      style: ['help'],
      text: `Avaliable ${command} keys: ${Object.keys(data)}.\n`
    })
    if (command === 'todo' && !a) {
      snText.push({
        style: ['grey'],
        text: `${FORMAT[0]} List recent 7 days ${commandUpperCase} keys ${FORMAT[1]}`
      })
    } else {
      snText.push({
        style: ['grey'],
        text: `${FORMAT[0]} List all ${commandUpperCase} keys ${FORMAT[1]}`
      })
    }
    Object.keys(data).forEach(key => {
      if (data[key] instanceof Object) {
        data[key] = JSON.stringify(data[key], null, 4)
      }
      snText.push(
        {
          style: ['help', 'bold'],
          text: `${key}: `
        },
        {
          style: ['default'],
          text: `${data[key]}\n`
        }
      )
    })
  } else {
    // 第二个参数起为文本（data）内的key值
    const restArgvs = argvs[1].split('.').slice()

    // console.log(data)
    // stopIdx为最深处可访问到obj值的key在restArgvs中的idx
    // 即slice第二个参数
    let stopIdx = 0
    let prevData = ''
    for (let i = 0; i < restArgvs.length; i++) {
      try {
        prevData = data
        data = data[restArgvs[i]]
      } catch (error) {
        // break
      } finally {
        if (data === undefined) {
          // 有无法访问的key存在
          snText.push({
            style: ['error'],
            text: `No ${command} -> ${restArgvs.join(' -> ')} key exists.\n`
          })
          // 还原data
          // 为防止在showBD中取到data=undefined
          data = prevData
          break
        }
        // 只有在值不为undefined的情况下+1
        stopIdx += 1
      }
    }
    // console.log(stopIdx, data)
    const allowKeys = restArgvs.slice(0, stopIdx)
    // console.log(allowKeys)
    // Object, Array, Function, Error instanceof Object === true
    if (isObject(data) && Object.keys(data).length) {
      // 如果该key对应的值为一个对象
      snText.push({
        style: ['help'],
        text: `Avaliable ${command} -> ${
          allowKeys.length ? allowKeys.join(' -> ') : ''
        } keys: ${Object.keys(data)}.\n`
      })
    }

    // 解决第一个key就不存在的问题
    // console.log(allowKeys)
    let head = ''
    let body = ''
    if (allowKeys.length) {
      // 有合法key
      if (isObject(data)) {
        data = JSON.stringify(data, null, 4)
      }
      head = `${FORMAT[0]} List  ${commandUpperCase} -> ${allowKeys
        .join(' -> ')
        .toUpperCase()}  keys ${FORMAT[1]}`
      body = `${restArgvs[stopIdx - 1]}: ${data}\n`
    } else {
      head = `${FORMAT[0]} List  ${commandUpperCase}  keys ${FORMAT[1]}`
      body = Object.keys(data)
        .map(
          key =>
            `${key}: ${
              isObject(data[key])
                ? // 若值为对象，按字符串输出
                  JSON.stringify(data[key], null, 4)
                : data[key]
            }`
        )
        .join('\n')
    }
    snText.push({
      style: ['grey'],
      text: head
    })
    snText.push({
      style: ['default'],
      text: body
    })
  }
  return snText
}
