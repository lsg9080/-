import { sessionstorage } from '@/common/utils/mUtils'
import Vue from 'vue'

export default {
    // 记录用户信息
	RECORD_USERINFO(state, info) {
		state.login = true;
        state.userInfo = info;
		sessionstorage.save('userInfo', info);
    },
    
    // 记录openid
    RECORD_OPENID(state, info) {
        state.openid = info
    },

    // 记录选中餐厅的 就餐日期
    RECORD_ORDERDATE(state, info) {
        state.orderDate = info
    },

    // 记录商品列表的父id
    RECORD_COOKBOOK_ID(state, info) {
        state.cookbookId = info
    },

    //记录订单页面用户选择的备注, 传递给订单确认页面
	CONFIRM_REMARK(state,info) {
        console.log(info)
		state.remarkText = info;
	},

    
    // 记录下单前 选中的
    RECORD_RESTAURANT_ID(state, info) {
        state.restaurantId = info
     console.log(info)
    },

    // 记录选中超市的id
    RECORD_SUPERMARKET_ID(state, info) {
        state.supermarketId = info
    },

    // 当前商店、餐厅的商品列表
    RECORD_MENULIST(state, info) {
        state.menuList = info
    },
    
    // 记录当前店铺位置
    CURRENT_SHOPINFO(state, info) {
        state.shopInfo = info;
    },

   
    // 加入购物车
    ADD_CART(state, item) {
        // cartList 多个商品
        let cart = (state.cartList|| {});
        let food_id = item.cookbookDetailId
    
        if (cart[food_id]) {
            cart[food_id]['num']++;
        } else {
            cart[food_id] = item;
        }
        state.cartList = { ...cart };
        //存入localStorage
        sessionstorage.save('buyCart', state.cartList);
    },

    // 移出购物车
    REDUCE_CART(state, item) {
        let cart = (state.cartList|| {});
        let food_id = item.cookbookDetailId;

        if (cart && cart[food_id]) {
            if (cart[food_id]['num'] >1) {
                cart[food_id]['num']--;
            } else {
                //商品数量为0，则清空当前商品的信息
                delete cart[food_id]
            }
        }
        state.cartList = { ...cart };
        //存入localStorage
        sessionstorage.save('buyCart', state.cartList);
    },

    // 清空店铺下的购物车数据
    CLEAR_SHOP_CART(state,shopId){
        state.cartList[shopId]={}
    },

    UPDATE_SHOP_CART(state,cart){
        state.cartList = {...cart}
        //存入localStorage
        sessionstorage.save('buyCart', state.cartList);
    },

    //退出登录
    LOGOUT(state) {
        Object.keys(state).forEach((k) => {
            Vue.delete(state, k);
        })
        sessionstorage.clear();
    }
   
}