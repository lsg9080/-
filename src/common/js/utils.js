import md5 from 'js-md5';
import cryptoJs from 'crypto-js';

// DES加密
//CBC模式
export const encryptDes = (message) => {
    var key = 'YkZgWXCz';
    var keyHex = cryptoJs.enc.Utf8.parse(key);
    var ivHex = cryptoJs.enc.Utf8.parse(key);
    var option = { iv: ivHex, mode: cryptoJs.mode.CBC, padding: cryptoJs.pad.Pkcs7 };
    var encrypted = cryptoJs.DES.encrypt(message, keyHex, option);
    return (encrypted.ciphertext.toString()).toUpperCase()
}

// DES解密
export const decryptDes = (message) => {
    var key = 'YkZgWXCz';
    var keyHex = cryptoJs.enc.Utf8.parse(key);
    var ivHex = cryptoJs.enc.Utf8.parse(key);
    var decrypted = cryptoJs.DES.decrypt(
        {
            ciphertext: cryptoJs.enc.Hex.parse(message)
        },
        keyHex,
        {
            iv: ivHex,
            mode: cryptoJs.mode.CBC,
            padding: cryptoJs.pad.Pkcs7
        }
    )
    return decrypted.toString(cryptoJs.enc.Utf8)
}

/**
 * 首页未登录
 * @param {*} WechatNo [openid]
 * @param {*} number [接口编号]
 */
export function defaultParam2(WechatNo, number) {
    let defaultParams = {
        wexinNo: WechatNo,
        authCode: encryption(WechatNo, number)
    }
    return defaultParams
}

/**
 * API接口参数加密
 * @example authCode内容为：微信号+当前日期+接口编号
 * @return 64196cb63ebf712f750ede4c0584222d
 */
export function encryption(WechatNo, number) {
    let authCode = ''
    let date = new Date();
    let currentDate = formatDate(date, 'yyyyMMddhhmmss');
    var str = [WechatNo, currentDate, number].map(authCodeStr).join('+');
    authCode = md5(str)
    // console.log(str)
    return authCode
}



export function encryptionRechange(WechatNo, number, price) {
    let authCode = ''
    let date = new Date();
    let currentDate = formatDate(date, 'yyyyMMddhhmmss');
    var str = [WechatNo, currentDate, number, price].map(authCodeStr).join('+');
    authCode = md5(str)
    // console.log(str)
    return authCode
}




//预支付authCode加密
export function encryptionPay(WechatNo, number, price) {
    let authCode = ''
    let date = new Date();
    let currentDate = formatDate(date, 'yyyyMMddhhmmss');
    var str = [WechatNo, currentDate, number, price].map(authCodeStr).join('+');
    authCode = md5(str)
    // console.log(str)
    return authCode
}
function authCodeStr(n) {
    n = n.toString()
    return n
}
/**
 * 获取当前日期
 * @param {*} date
 * @param {*} fmt
 */
export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
/**
 *
 * @param {*} url
 */
export function extractQueryParams(url) {
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

/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse() {
    let url = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    if (arr) {
        arr.forEach((item) => {
            let tempArr = item.substring(1).split('=');
            let key = decodeURIComponent(tempArr[0]);
            let val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        });
    }
    return obj;
}

/**
 * 分组
 * list:原始数据。
 * fn:分组条件判断函数，之后会根据该函数返回的结果进行分组，其有一个参数表示数组的某一项数据。
 */
export const groupBy = (list, fn) => {
    const groups = {};
    list.forEach(function (o) {
        const group = JSON.stringify(fn(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return groups;
}
