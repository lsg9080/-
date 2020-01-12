/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseURL: 域名地址
 * globalUrlFile: 文件所在域名地址
 * defaultImg: 图片所在域名地址
 */
let globalUrlFile = '';
let baseURL = '';
let defaultUrl ='';

if (process.env.NODE_ENV == 'development') {
    baseURL = "https://staffapis.wincome.group/staffOrderingH5.API/";
    globalUrlFile = "";
}
if (process.env.NODE_ENV == 'production') {
    
    baseURL = "https://staffapis.wincome.group/staffOrderingH5.API/";
    globalUrlFile = "";
}

defaultUrl = 'http://ceshi.wincome.group'

export {
    baseURL,
    globalUrlFile,
    defaultUrl
}