<template>
  <div>
    <div v-if="!so_noOrder" class="so">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
        <!-- <van-cell v-for="item in orderList" :key="item">{{item}}</van-cell> -->
        <div class="zhanwei"></div>
        <div class="order_o">
          <div class="o_wrap" v-for="(item,index) in orderList" :key="index">
            <!-- 订单名称、日期。状态、金额等 -->
            <div class="o_wrap_cont" @click="orderDetail(item.orderId,item.payId)">
              <div class="o_wrap_cont_logo">
                <img class="o_wrap_cont_logo_img" :src="item.logoUrl" />
              </div>
              <div class="o_wrap_cont_detail">
                <div class="o_wrap_cont_detail_ns">
                  <div class="o_wrap_cont_detail_name">{{item.shopName}}</div>
                  <div class="o_wrap_cont_detail_status">{{item.statusName}}</div>
                  <div class="clearBoth"></div>
                </div>
                <div class="o_wrap_cont_detail_tm">
                  <div class="o_wrap_cont_detail_time">{{item.createTime}}</div>
                  <div class="o_wrap_cont_detail_money">¥{{item.amount}}</div>
                  <div class="clearBoth"></div>
                </div>
              </div>
              <div class="clearBoth"></div>
            </div>
            <!-- 判断不同状态下的不同按钮 -->
            <div class="o_wrap_status">
              <button
                v-if="item.status==2"
                class="o_wrap_status_cancel_order"
                @click="cancel_order(item.orderId)"
              >取消订单</button>
              <button
                v-if="item.status==2"
                class="o_wrap_status_pay_order"
                @click="payOrder(item)"
              >
                去支付(剩余
                <van-count-down :time="item.left_time" format="mm:ss" />)
              </button>
              <div class="clearBoth"></div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <div v-else-if="so_noOrder" class="so_empty">
      <img src="../../assets/empty.png" />
      <div>亲！你还没有下单呦~</div>
    </div>
    <div v-show="!loading">
      <h2 class="van-doc-demo-block__title">仅显示三个月内的订单</h2>
    </div>
  </div>
</template>

<script>
import { getOrderList, orderCancel,orderPaid ,getPrepayid} from "@/serve";
import payUtils from "@/common/js/wechat";
import { encryptDes } from "@/common/js/utils";
import { wechatAppId } from "@/config/auth";
import { formatDate } from "@/getParams";
export default {
  data() {
    return {
      pageSize: 20,
      pageNum: -1,
      so_noOrder: false,
      orderList: [],
      loading: false,
      finished: false
    };
  },
  methods: {
    loadMore() {
      this.pageNum += 1;
      this.loadOrder();
    },
    orderDetail(orderId, payId) {
      this.$router.push({
        name: "OrderDetail",
        params: {
          orderId,
          payId
        }
      });
    },
    loadOrder() {
      /* let params = {
        authCode: "101FCC56AB9147F69E75AC7AAC52D2BB",
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        weixinNo: window.globalDataPool.openid
      };
      this.$axios({
        method: "POST",
        url: "/api/api/StaffOrder/GetOrderList",
        data: params,
        transformRequest: [
          function(data) {
            return JSON.stringify(data);
          }
        ],
        headers: { "Content-Type": "application/json" }
      })*/

      getOrderList(this.pageSize, this.pageNum)
        .then(res => {
          if (res.data.result === "0") {
            if (res.data.data.length == 0) {
              // 数据全部加载完成
              this.finished = true;
              this.so_noOrder = this.pageNum === 0 ? true : false;
            } else {
       
              if (this.pageNum == 0) {
                this.orderList = res.data.data;
              } else {
                this.orderList = this.orderList.concat(res.data.data);
              }
              // 限时订单 倒计时
              this.orderList.forEach(item => {
                if (item.status == 2) {
                  this.cuntDown(item);
                }
              });
            }
            this.loading = false;
          } else {
            this.loading = false;
            this.finished = true;
            this.$toast({ message: res.msg });
          }
          // 加载状态结束
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    /**
     * 倒计时：订单有效期（1小时）,设置订单毫秒数， 3*60*1000
     */
    cuntDown: function(order) {
      // order.createTime = "2020-01-11 13:55:21";
      var time =
        new Date(order.createTime).getTime() +
        1 * 60 * 60 * 1000 -
        new Date().getTime();
      if (time > 0) {
        order.left_time = time;
      } else {
        //超时，订单自动取消
        // this.cancelOrder(order.orderId);
      }
    },
    
    cancelOrder(id) {
      orderCancel(id).then(res => {
        if (res.data.result == 0) {
          this.$toast({ message: res.data.note });
          this.loadOrder(this.pageSize,0);
        }else{
          this.$toast({ message: res.msg });
        }
      });
    },
    payOrder(item) {
      console.log(item)
      if (item.paymentId == 1) {
        orderPaid(item.orderId)
          .then(res => {
            if (res.result == "0") {
              this.$toast({ message: "支付成功！" });
              this.init();
            } else {
              this.$toast.fail(res.msg);
              setTimeout(function() {
                this.init();
              }, 2000);
            }
          })
      } else {
        var body = "订单消费" + item.amount + "元";
        var price = item.amount;
        price = parseFloat(price).toFixed(2);

        let currentDate = formatDate(new Date(), "yyyyMMddhhmmss");
        let currrentTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
        var str = "wincome+" + currentDate + "+" + price;
        let amountEncrypt = encryptDes(str);

        let params = {
          authCode: "101FCC56AB9147F69E75AC7AAC52D2BB",
          callFrom: "wincome",
          appId: wechatAppId,
          body: body,
          callTime: currrentTime,
          price: price,
          paymentId: item.paymentId,
          payId: item.payId,
          orderCode: item.orderCode,
          amountEncrypt: amountEncrypt
        };
        getPrepayid(params).then(res => {
          console.log(res)
          if (res.result == "0") {
            let wxOptions = {
              appId: res.appId,
              nonceStr: res.nonceStr,
              package: res.package,
              payId: res.payId,
              paySign: res.paySign,
              prepay_id: res.prepay_id,
              timeStamp: res.timeStamp
            };
            console.log("从后端取到的微信参数：" + JSON.stringify(wxOptions));
            if (res.prepay_id) {
              payUtils.WXJSApi(wxOptions);
            }
          }else{
            this.$toast(res.msg)
          }
        });
      }
    },
  }
};
</script>

<style scoped>
.van-count-down {
  font-size: 0.48rem;
  color: #8db0d0;
  display: inline;
}

.van-doc-demo-block__title {
  margin: 0;
  padding: 32px 16px 16px;
  color: rgba(69, 90, 100, 0.6);
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
}
.zhanwei {
  height: 10px;
}
.order_o {
  width: 100%;
}
.o_wrap {
  margin-bottom: 10px;
  width: 100%;
  border-bottom: 1px solid #e2e2e2;
}

.o_wrap_cont {
  width: calc(100% - 40px);
  margin-left: 20px;
}
/* f7a35c */
.o_wrap_cont_logo {
  float: left;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  border-radius: 5px;
}
.o_wrap_cont_logo_img {
  width: 60px;
  height: 60px;
}
.o_wrap_cont_detail {
  float: right;
  width: calc(100% - 10px - 60px);
  font-size: 18px;
  padding-bottom: 3px;
}
.o_wrap_cont_detail_ns {
  width: 100%;
}
.o_wrap_cont_detail_name {
  width: calc(100% - 75px);
  float: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 36px;
  line-height: 36px;
  font-size: 19px;
}
.o_wrap_cont_detail_status {
  width: 75px;
  text-align: right;
  float: right;
  height: 36px;
  line-height: 36px;
  font-weight: bold;
}
.o_wrap_cont_detail_time {
  width: calc(100% - 75px);
  float: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 36px;
  line-height: 36px;
  font-weight: lighter;
  color: #928e8e;
  font-size: 16px;
}
.o_wrap_cont_detail_money {
  width: 75px;
  text-align: right;
  float: right;
  height: 36px;
  line-height: 36px;
  color: #ee620b;
}
.o_wrap_status button {
  margin-left: 20px;
  margin-bottom: 5px;
}
.o_wrap_status_cancel_order {
  width: 25%;
  float: left;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  background: #fff;
  border: 1px solid #8db0d0;
  color: #8db0d0;
  border-radius: 4px;
}
.o_wrap_status_pay_order {
  float: left;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  background: #fff;
  border: 1px solid #8db0d0;
  color: #8db0d0;
  border-radius: 4px;
}

.o_wrap_status_retreat_order {
  width: 35%;
  float: right;
  margin-right: 10px;
}
.o_wrap_else {
  text-align: center;
  height: calc(100vh - 10px);
  /* line-height: 100vh; */
  font-size: 24px;
  color: #e2e2e2;
}
.o_wrap_else_img {
  width: 150px;
  height: 150px;
  margin-top: calc(50% - 75px);
  /* margin-left: calc(50% - 150px) */
}
.o_wrap_else_title {
  width: 100%;
  text-align: center;
}
.o_mp_mask {
  width: 100%;
  height: 100vh;
  position: fixed;
  background: #000;
  opacity: 0.7;
  z-index: 1;
  top: 0;
  left: 0;
}
.o_mp_cont {
  width: 65%;
  height: 45vh;
  position: fixed;
  background: #fff;
  z-index: 2;
  top: 0;
  left: 0;
  margin-top: 20vh;
  margin-left: 17.5%;
}
.o_mp_cont_panel {
  width: 100%;
  height: 45vh;
}
.o_mp_cont_panel_title {
  width: 100%;
  text-align: center;
  height: 60px;
  line-height: 60px;
  color: #13227a;
}
.o_mp_cont_panel_panel {
  height: calc(45vh - 60px - 1px - 36px - 10px - 10px);
  background: none;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  border-top: 1px solid #efefef;
}
.ms_pm_panl_content {
  height: calc(40vh - 48px - 10px);
  /* border: 1px solid red; */
  width: 90%;
  margin: 0 auto;
  padding-top: 15px;
}
.group {
  height: calc(40vh - 48px - 30px);
  overflow: hidden;
  overflow-y: auto;
}

.label-1 label {
  /* border: 1px solid red; */
  display: inline-block;
  width: 100%;
}
.label-1-label {
  padding-top: 13px;
  padding-bottom: 13px;
  height: 30px;
}
.label-1 label text {
  /* border: 1px solid red; */
  width: calc(85% - 30px - 10px);
  padding-left: 5px;
}
.label-1__icon {
  /* border: 1px solid red; */
  /* width: 15%; */
  /* padding-left: 5px; */
  text-align: right;
  float: right;
}
.label-1 {
  margin-bottom: 10px;
}
.label-1__text {
  display: inline-block;
  vertical-align: middle;
  height: 30px;
  line-height: 30px;
}
.label-1__text_img {
  width: 30px;
  height: 30px;
  float: left;
}
.label-1__icon {
  position: relative;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
  width: 18px;
  height: 18px;
  background: #fcfff4;
  border: 1px solid #dddddd;
  margin-top: 6px;
}
.label-1__icon-checked {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 12px;
  height: 12px;
  background: #1aad19;
}
.o_mp_cont_panel_pay {
  height: 36px;
  line-height: 36px;
  width: calc(100% - 20px);
  margin-left: 10px;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  background: #8db0d0;
  margin-top: 10px;
}
.o_mp_cont_close {
  width: 100%;
  text-align: center;
}
.o_mp_cont_close_img {
  margin-top: 50px;
  width: 30px;
  height: 30px;
}
.zhanwei18px {
  height: 36px;
}
.o_title {
  width: 100%;
  color: #928e8e;
  text-align: center;
  font-size: 14px;
  height: 18px;
  line-height: 18px;
  margin-top: 18px;
  margin-bottom: 10px;
}
/* 清除浮动 */
.clearBoth {
  clear: both;
}
.jline {
  width: calc(100% - 10px - 110px);
  height: 1px;
  background: #e2e2e2;
  float: right;
}
</style>
