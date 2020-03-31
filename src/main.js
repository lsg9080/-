import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'

import axios from 'axios'

import './thirdParty/UI'
import './common/base.css'
import './common/styles/index.styl'

import 'vant/lib/index.css';

import components from './common/utils/components'
Vue.use(components)

import 'swiper/dist/css/swiper.css';
import VueAwesomeSwiper from "vue-awesome-swiper";
Vue.use(VueAwesomeSwiper)

Vue.config.productionTip = false
Vue.prototype.$axios = axios

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



new Vue({
    router,
    store,
    render: h => h(App),
    created: function() {
        window.globalDataPool = {
            sckey: 'YkZgWXCz'
        }
    }
}).$mount('#app')