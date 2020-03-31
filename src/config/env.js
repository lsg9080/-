/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseURL: 域名地址
 * globalUrlFile: 文件所在域名地址
 * defaultImg: 图片所在域名地址
 */
let baseURL = '';
let homePage = '';
let wechatAppId = '';
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'production') {
    homePage = `http://ceshi.wincome.group/`
    wechatAppId = 'wx99fcb86f4cb3700a'
    baseURL = "https://staffapis.wincome.group/staffOrderingH5.API"
}
// if (process.env.NODE_ENV == 'production') {
//     homePage = `http://njet.wincome.group:8082/`
//     wechatAppId = 'wx20610f5e0c212bdb'
//     baseURL = "http://njet.wincome.group:8082/staffOrderingH5.API/";
// }
export {
    homePage,
    wechatAppId,
    baseURL
}