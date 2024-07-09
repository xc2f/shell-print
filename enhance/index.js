/**
 * @author Qin Fen
 * @email hellowd93@163.com
 * @create date 2019-03-22 23:56:49
 * @modify date 2019-03-22 23:59:02
 * @desc [以enhance目录下的文件名为key导出]
 */

// TODO: 设置.fileignore

const fs = require('fs')
const path = require('path')

const currentPath = path.resolve(`${__dirname}`)

const enhances = {}
const files = fs.readdirSync(currentPath)
files.forEach(file => {
  const fileSplit = file.split('.')
  // 将多于的.置换为_拼接为key
  enhances[
    fileSplit.slice(0, fileSplit.length - 1).join('_')
  ] = `${currentPath}/${file}`
})

delete enhances['index']

module.exports = enhances
