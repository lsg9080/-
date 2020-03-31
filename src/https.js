import axios from 'axios'
import qs from 'qs'
import { baseURL } from "./config/env"
import store from './store'
import { Toast } from 'vant'

var instance = axios.create({
    baseURL: baseURL,
    timeout: 5000
});

//请求拦截
instance.interceptors.request.use(config => {
        console.log(config)
        let defaultOpstion = { weixinNo: store.getters.openid };
        if (config.params != '' || config.data != '') {
            if (!config.data.authCode) {
                Object.assign(defaultOpstion, { authCode: '' })
            }
        }

        if (config.method == 'get' || config.method == 'delete') {
            Object.assign(config.params, defaultOpstion)
        } else {
            Object.assign(config.data, defaultOpstion)
            config.data = qs.stringify(config.data);
        }
        // console.log(qs.parse(config.data))
        return config;
    },
    error => {
        Toast('网络异常，请稍后再试')
        return Promise.reject(error);
    }
)
instance.interceptors.response.use((res) => {
        if (!res.data.success) {
            return Promise.resolve(res)
        }
        return res
    }, (error) => {
        return Promise.reject(error)
    })
    // axios 参数处理
function request(url = url, data = {}, method = 'post', headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            url: url,
            method,
            headers
        }
        if (method.toLowerCase() === 'get') {
            options.params = data
        } else {
            options.data = data
        }
        instance(options)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                reject(error)
            })
    })
}


function axiosByJson(url = url, data = {}, method = 'post') {
    let defaultOpstion = { weixinNo: store.getters.openid };
    Object.assign(data, defaultOpstion);

    return new Promise((resolve, reject) => {
        axios({
                changeOrigin: true,
                method: method,
                baseURL: baseURL,
                url: url,
                data: data,
            })
            .then(res => {
                console.log(res)
                resolve(res.data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

function o_axiosByJson(url = url, data = {}, method = 'post') {
    let defaultOpstion = { weixinNo: store.getters.openid };
    Object.assign(data, defaultOpstion);

    return new Promise((resolve, reject) => {
        axios({
                changeOrigin: true,
                method: method,
                baseURL: baseURL,
                url: url,
                data: data,
            })
            .then(res => {
                console.log(res)
                resolve(res)
            })
            .catch(error => {
                reject(error)
            })
    })
}

export {
    request,
    axiosByJson,
    o_axiosByJson
}