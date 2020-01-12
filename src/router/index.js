import Vue from 'vue'
import Router from 'vue-router'

import Sindex from '@/components/Sindex'
import Slogin from '@/components/personal/Slogin'
import SpersonalCenter from '@/components/personal/SpersonalCenter'
import Srecomm from '@/components/personal/Srecomm'

import SrecommNutri from '@/components/personal/SrecommNutri'
import Smeals from '@/components/main/shopItem'//Smeals
import Smarket from '@/components/main/Smarket'
import Ssubmit from '@/components/main/Ssubmit'
import Sdistri from '@/components/main/Sdistri'
import Ssubmitnote from '@/components/main/Ssubmitnote'
import Sorder from '@/components/personal/Sorder'
import OrderDetail from '@/components/personal/OrderDetail'
import Recharge from '@/components/Recharge'
import RechargeCallback from '@/components/RechargeCallback'


// const Sindex = () => import(/* webpackChunkName: "Sindex" */ '@/components/Sindex')
// const Slogin = () => import(/* webpackChunkName: "Slogin" */ '@/components/personal/Slogin')
// const SpersonalCenter = () => import(/* webpackChunkName: "SpersonalCenter" */ '@/components/personal/SpersonalCenter')
// const Srecomm = () => import(/* webpackChunkName: "Srecomm" */ '@/components/personal/Srecomm')
// const SrecommNutri = () => import(/* webpackChunkName: "SrecommNutri" */ '@/components/personal/SrecommNutri')
// const Smeals = () => import(/* webpackChunkName: "Smeals" */ '@/components/main/shopItem')
// const Smarket = () => import(/* webpackChunkName: "Smarket" */ '@/components/main/Smarket')
// const Ssubmit = () => import(/* webpackChunkName: "Ssubmit" */ '@/components/main/Ssubmit')
// const Sdistri = () => import(/* webpackChunkName: "Sdistri" */ '@/components/main/Sdistri')
// const Ssubmitnote = () => import(/* webpackChunkName: "Ssubmitnote" */ '@/components/main/Ssubmitnote')
// const Sorder = () => import(/* webpackChunkName: "Sorder" */ '@/components/personal/Sorder')
// const OrderDetail = () => import(/* webpackChunkName: "OrderDetail" */ '@/components/personal/OrderDetail')
// const Recharge = () => import(/* webpackChunkName: "Recharge" */ '@/components/Recharge')


Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    // {
    //   path:'/',
    //   redirect:'Sindex'
    // },
    {
      path: '/',
      name: 'Sindex',
      component: Sindex,
      meta: { title: '职工订餐'}
    },
    {
      path: '/slogin',
      name: 'Slogin',
      component: Slogin,
      meta: { title: '登录'}
    },
    {
      path: '/spersonalCenter',
      name: 'SpersonalCenter',
      component: SpersonalCenter,
      meta: { title: '个人中心'}
    },
    {
      path: '/srecomm',
      name: 'Srecomm',
      component: Srecomm,
      meta: { title: '个人中心', keepAlive: true }
    },
    {
      path: '/srecommnutri',
      name: 'SrecommNutri',
      component: SrecommNutri,
      meta: { title: '个人中心' }
    },
    {
      path: '/smeals',
      name: 'Smeals',
      component: Smeals,
      meta: { title: '在线订餐' }
    },
    {
      path: '/smarket',
      name: 'Smarket',
      component: Smarket,
      meta: { title: '在线订餐' }
    },
    {
      path: '/ssubmit',
      name: 'Ssubmit',
      component: Ssubmit,
      meta: { title: '提交订单' }
    },
    {
      path: '/sdistri',
      name: 'Sdistri',
      component: Sdistri,
      meta: { title: '个人地址' }
    },
    {
      path: '/ssubmitnote',
      name: 'Ssubmitnote',
      component: Ssubmitnote,
      meta: { title: '个人备注', keepAlive: true }
    },
    {
      path: '/sorder',
      name: 'Sorder',
      component: Sorder,
      meta: { title: '我的订单' }
    }, 
    {
      path: '/orderDetail/:orderId',
      name: 'OrderDetail',
      component: OrderDetail,
      meta: { title: '订单详情' }
    },
    {
      path: '/recharge',
      name: 'Recharge',
      component: Recharge,
      meta: { title: '我的职工卡' }
    },
    {
      path: '/rechargeCallback',
      name: 'RechargeCallback',
      component: RechargeCallback,
      meta: { title: '我的职工卡' }
    }
  ]
})
