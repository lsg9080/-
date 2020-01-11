import md5 from 'js-md5'
export function urlQueryParams (url) {
  let queryParams = {}
  if (url.includes('?')) {
    let queryString = url.substr(url.indexOf('?') + 1)
    let pairs = queryString.split('&')
    for (let pair of pairs) {
      let splitArray = pair.split('=')
      let key = splitArray[0]
      let value = splitArray[1]
      if (value.indexOf('#') > -1) {
        value = value.substring(0, value.indexOf('#'))
      }
      queryParams[key] = value
    }
  }
  return queryParams
}
export function encryption (WechatNo, number) {
  let authCode = ''
  let date = new Date()
  let currentDate = formatDate(date, 'yyyyMMddhhmmss')
  var str = [WechatNo, currentDate, number].map(authCodeStr).join('+')
  authCode = md5(str)
  return authCode
}
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}
function authCodeStr (n) {
  n = n.toString()
  return n
}
function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
