import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'

import axios from 'axios'

import './thirdParty/UI'
import { defaultUrl } from './config/env'
import './common/base.css'

import 'vant/lib/index.css';

import components from './common/utils/components'
Vue.use(components)


Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$defaultUrl = defaultUrl

/**
 * 调试工具
 */ 
import vConsole from 'vconsole'
if (process.env.NODE_ENV == 'production') {
  Vue.prototype.$vConsole = new vConsole()
}
Vue.config.productionTip = false

// 路由在跳转之前执行 的全局钩子
router.beforeEach((to, from, next) => {
  /*console.log((!(sessionstorage.fetch('token').token)))
  if (!((sessionstorage.fetch('token').token))) {
    if (to.fullPath == "/login") {
      next()
    } else {
      next("/login")
    }
  } else {
    next();
  }*/

  document.title = to.meta.title;
  next();
})

/**
 * 读取build之后的代码 实现vue打包后生成配置文件用以外部修改公共路径
 * 
 */
// 请求文件内容
/*function getServerConfig() {
  return new Promise((resolve, reject) => {
    axios.get('./serverConfig.json').then((result) => {
      console.log(result)
      let config = result.data;
      for (let key in config) {
        Vue.prototype[key] = config[key];
      }
      // axios.defaults.baseURL = Vue.prototype.baseUrl;
      console.log(Vue.prototype.baseUrl)  // 验证是否已经把属性挂在了Vue上
      resolve();
    }).catch((error) => {
      console.log(error);
      reject()
    })
  })
}
// 请求文件内容及创建实例
async function main() {
  if (process.env.NODE_ENV == 'production') {
    await getServerConfig();
  }
  new Vue({
    router,
    store,
    render: h => h(App),
    created: function () {
      window.globalDataPool = {
        apiurl: 'https://staffapis.wincome.group/staffOrderingH5.API/',
        sckey: 'YkZgWXCz'
      }
    }
  }).$mount('#app')
}
// 方法初始执行
main();
*/

new Vue({
  router,
  store,
  render: h => h(App),
  created: function () {
    window.globalDataPool = {
      apiurl: 'https://staffapis.wincome.group/staffOrderingH5.API/',
      sckey: 'YkZgWXCz'
    }
  }
}).$mount('#app')
