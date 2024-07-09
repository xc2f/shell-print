/**
 * @author Qin Fen
 * @email hellowd93@163.com
 * @create date 2019-03-23 18:07:54
 * @modify date 2019-03-23 18:07:54
 * @desc [replace caseMediaContainerName]
 */
const moment = require('moment')

// now
const NOW = Date.now()
const caseMediaContainerName = `case_media:${moment().format('YYMMDD')}_${NOW}`

// const caseMediaContainerName = 'caseMediaContainerName'

const replacer = (k, v) => {
  switch (k) {
    case 'build':
      v = v || ''
      v = v.replace(/\$\{.+?\}/gi, caseMediaContainerName)
      break

    default:
      break
  }
  return v
}

module.exports = data => {
  data = JSON.stringify(data, replacer)
  return JSON.parse(data)
}
