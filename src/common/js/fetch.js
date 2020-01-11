import axios from 'axios'
import store from '@/store'
import { baseURL } from "../../config/env"
// import router from '../router'

// create an axios instance
const service = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 30000,

})


// request interceptor
service.interceptors.request.use(
  config => {

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === '200') {
      return res
    } else {
    
      if (res.code === '401') {
        console.log('401')
        store.dispatch('user/logout')
        // router.replace({ path: '/login' })
      }
      return Promise.reject(res.msg || 'error')
    }
  },
  error => {
  
    if (/Network Error/.test(error)) {
    //   router.replace({ path: '/login' })
    }
    return Promise.reject(error)
  }
)


export default service