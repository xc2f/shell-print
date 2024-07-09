/**
 * @author Qin Fen
 * @email hellowd93@163.com
 * @create date 2019-03-23 16:33:32
 * @modify date 2019-03-23 16:33:32
 * @desc [Test is {}]
 */
module.exports = data => {
  return (
    data instanceof Object &&
    !(data instanceof Array) &&
    !(data instanceof Function) &&
    !(data instanceof Error)
  )
}
