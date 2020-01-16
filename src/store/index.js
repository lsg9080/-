import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
	login:false,
	userInfo:{},
	shopInfo:{},// 当前店铺信息
	cartList: {}, // 单个店铺 加入购物车的商品列表
	
	menuList:{}, // 当前商店、餐厅的商品列表
	openid:null,
	restaurantId:null,
	supermarketId:null,
	remarkText:null,//备注
}


export default new Vuex.Store({
	plugins: [persistedState()],
	state,
	actions,
	mutations,
	getters:{
		openid(state){
			return state.openid
		}
	},
})