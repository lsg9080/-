<template>
  <div>
    <div class="od_pay">
      <div class="od_pay_statusName">{{statusName}}</div>
      <div  class="o_wrap_status">
        <button v-if="status==2" class="o_wrap_status_cancel_order" @click="cancelOrder(orderId)">取消订单</button>
        <button v-if="status==2" class="o_wrap_status_pay_order" @click="payOrder">
          去支付(剩余
          <van-count-down :time="countdown" format="mm:ss" @finish="refundOrder(orderId)"/>)
        </button>
        <button v-if="status==3||status==4" class='o_wrap_status_cancel_order' @click='refundOrder(orderId)'>在线退餐</button>
        <div class="clearBoth"></div>
      </div>
    </div>

    <div class="od_detail">
      <div class="od_detail_title">订单明细</div>
      <div v-for="(repast,index) in repastList" :key="index" class="od_detail_cont">
        <div class="od_detail_cont_orderDate">
          {{orderDate}}
          <label class="od_detail_cont_orderDate_status">{{repast.statusName}}</label>
        </div>
        <div class="od_detail_cont_repasrName">{{repast.repastName}}</div>
        <div class="od_detail_cont_detail" v-for="(item,index) in menuList" :key="index">
          <section v-if="repast.repastId == item.repastId">
            <div class="orderDetail_menuList_list_menuName">{{item.menuName}}</div>
            <div class="orderDetail_menuList_list_qty">×{{item.qty}}</div>
            <div class="orderDetail_menuList_list_amount">¥{{item.price}}</div>
            <div class="clearBoth"></div>
          </section>
        </div>
        <div class="od_repast_total">¥{{repast.total}}</div>
      </div>
    </div>

    <div class="od_remark">
      <label class="od_remark_title">订单备注：</label>
      {{remark}}
    </div>

    <div class="od_delivery">
      <div class="od_delivery_title">配送信息</div>
      <div class="od_delivery_address">地址：{{addressAll}}</div>
      <div>{{staffName}} {{telephone}}</div>
    </div>

    <div class="od_billNum">
      <div class="od_billNum_num">
        <div class="od_billNum_num_title">订单号</div>
        <div class="od_billNum_num_num">{{orderCode}}</div>
        <div class="clearBoth"></div>
      </div>
      <div class="od_billNum_pay">
        <div class="od_billNum_pay_title">支付方式</div>
        <div class="od_billNum_pay_num">{{paymentName}}</div>
        <div class="clearBoth"></div>
      </div>
      <div>
        <div class="od_billNum_pay_title">下单时间</div>
        <div class="od_billNum_pay_num">{{createTime}}</div>
        <div class="clearBoth"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderCancel, orderPaid, getOrderDetail, getPrepayid ,orderRefund} from "@/serve"; //
import payUtils from "@/common/js/wechat";
import { wechatAppId } from "@/config/auth";
import { encryptDes } from "@/common/js/utils"; //encryptionPay,
import { formatDate } from "@/getParams";
let timer = null;
export default {
  data() {
    return {
      amount: 0, // 总额
      payId: "",
      shopId: "",
      addressAll: "",
      telephone: "",
      staffName: "", // 用户名
      orderCode: "", // 订单号
      createTime: "", // 下单时间
      orderDate: "", // 格式化 星期
      paymentId: "", //支付方式
      paymentName: "",
      status: "", // 订单状态
      statusName: "",
      remark: "", // 备注
      menuList: "", //商品列表
      repastList: "", // 餐次
      validTime: "", //订单剩余时间
      orderId: "",
      countdown: 0,
      goods:null
    };
  },
  // 自执行
  created: function() {
    this.orderId = this.$route.params.orderId;
    this.init();
  },

  methods: {
    init() {
      getOrderDetail(this.orderId).then(res => {
        if (res.result == 0) {
          let data = res.data;
          let obj = {
            amount: 0, // 总额
            payId: "",
            shopId: "",
            addressAll: "",
            telephone: "",
            staffName: "", // 用户名
            orderCode: "", // 订单号
            createTime: "", // 下单时间
            orderDate: "", // 格式化 星期
            paymentId: "", //支付方式
            paymentName: "",
            status: "", // 订单状态
            statusName: "",
            remark: "", // 备注
            menuList: "", //商品列表
            repastList: "", // 餐次
            orderId: ""
          };
          for (let key in data) {
            if (key == "orderDate") {
              var weekDay = [
                "星期日",
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六"
              ];
              var myDate = new Date(data[key]);
              this[key] = obj[key] = data[key] + " " + weekDay[myDate.getDay()];
            } else {
              this[key] = obj[key] = data[key];
            }
          }
          //加载页面倒计时
          if (data.status == 2) {
            this.cuntDown(data);
          }
          this.goodsList();
        } else {
          this.$toast(res.msg);
        }
      });
    },

    payOrder() {
      if (this.paymentId == 1) {
        orderPaid(this.orderId)
          .then(res => {
            if (res.result == "0") {
              this.$toast({ message: "支付成功！" });
              clearInterval(timer);
              this.init();
            } else {
              this.$toast.fail(res.msg);
              setTimeout(function() {
                clearInterval(timer);
                this.init();
              }, 2000);
            }
          })
          .catch(() => {
            this.$toast.fail("支付失败！");
            setTimeout(function() {
              clearInterval(timer);
              this.init();
            }, 2000);
          });
      } else {
        var body = "订单消费" + this.amount + "元";
        var price = this.amount;
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
          paymentId: this.paymentId,
          amountEncrypt: amountEncrypt,
          payId: this.payId,
          orderCode: this.orderCode
        };
        getPrepayid(params).then(res => {
          if (res.result == "0") {
            let wxOptions = {
              appId: res.appId,
              nonceStr: res.nonceStr,
              package: res.package,
              paySign: res.paySign,
              prepay_id: res.prepay_id,
              timeStamp: res.timeStamp,

              orderCode: this.orderCode,
              payId: this.payId
            };
            console.log("从后端取到的微信参数：" + JSON.stringify(wxOptions));
            if (res.prepay_id) {
              payUtils.WxConfig(wxOptions);
              payUtils.WXJSApi(
                wxOptions,
                () => {
                  this.$router.push({ name: "OrderCallback" });
                },
                () => {
                  this.$toast("支付失败");
                }
              );
            }
          }
        });
      }
    },
   
    goodsList() {
      //给餐次列表中添加 total 字段，记录每个餐次的总价
      for (var i = 0; i < this.repastList.length; i++) {
        var total = 0;
        for (var j = 0; j < this.menuList.length; j++) {
          if (this.repastList[i].repastId == this.menuList[j].repastId) {
            total = total + this.menuList[j].amount;
          }
        }
        this.repastList[i].total = total.toFixed(2);
      }
      this.goods = this.repastList.sort((a, b)=> {
      return a.sortId - b.sortId;
    });
      console.log(this.goods);
    },
    /**
     * 倒计时：订单有效期（10分钟）,设置订单毫秒数，
     */
    cuntDown: function(order) {
      var time =
        new Date(order.createTime.replace(/-/g, "/")).getTime() +
        10 * 60 * 1000 -
        new Date().getTime();
      if (time > 0) {
        this.countdown = time;
      } else {
        //超时，订单自动取消
        this.cancelOrder(order.orderId);
      }
    },
    cancelOrder(id) {
      orderCancel(id).then(res => {
        if (res.data.result == 0) {
          this.$toast({ message: res.data.note });
          this.init();
        } else {
          this.$toast({ message: res.msg });
        }
      });
    },
    refundOrder(id){
      orderRefund(id).then(res => {
        if (res.data.result == 0) {
          this.$toast({ message: res.data.note });
        } else {
          this.$toast({ message: res.msg });
        }
        this.init();
      });
    },
  }
};
</script>


<style lang="stylus" scoped>
.van-count-down {
  font-size: 0.48rem;
  color: #8db0d0;
  display: inline;
}

body {
  font-size: 18px;
}

.od_pay {
  width: calc(100% - 20px - 2px);
  margin-left: 10px;
  margin-top: 10px;
  border: 1px solid #e2e2e2;
}

.od_pay_statusName {
  text-align: center;
  height: 54px;
  line-height: 54px;
  font-size: 24px;
  color: #ee620b;
}

.o_wrap_status button {
  /* width: calc(100% - 20px); */
  margin-left: 20px;
  margin-bottom: 15px;
  /* border: 1px solid red; */
}

.o_wrap_status_cancel_order {
  width: 35%;
  float: left;
  height: 36px;
  line-height: 36px;
  font-size: 18px;
  background: #fff;
  border: 1px solid #8db0d0;
  color: #8db0d0;
}

.o_wrap_status_pay_order {
  /* width: 35%; */
  float: left;
  height: 36px;
  line-height: 36px;
  font-size: 18px;
  background: #fff;
  border: 1px solid #8db0d0;
  color: #8db0d0;
}

.o_wrap_status_retreat_order {
  width: 35%;
  float: right;
  margin-right: 10px;
}

.od_pay_cancel_sts {
  margin-bottom: 25px;
  margin-top: 15px;
}

.od_pay_cancel_btn1 {
  width: 35%;
  margin-left: 25px;
  float: left;
}

.od_pay_cancel_btn {
  width: calc(100% - 50px);
  margin: 15px auto 25px auto;
}

.od_pay_cancel_btn_cancel {
  width: calc(100% - 50px);
  margin: 15px auto 25px auto;
}

.od_detail {
  width: calc(100% - 20px - 2px - 20px);
  margin-left: 10px;
  margin-top: 10px;
  border: 1px solid #e2e2e2;
  padding-left: 10px;
  padding-right: 10px;
}

.od_detail_title {
  font-size: 18px;
  height: 36px;
  line-height: 36px;
  font-weight: bold;
}

.od_detail_cont {
  border-top: 1px dashed #e2e2e2;
  font-size: 18px;
}

.od_detail_cont_orderDate {
  height: 36px;
  line-height: 36px;
}

.od_detail_cont_orderDate_status {
  float: right;
  color: #ee620b;
}

/* #ee620b */
.od_detail_cont_repasrName {
  /* margin-top: 10px; */
  margin-bottom: 10px;
  width: 75px;
  text-align: center;
  height: 28px;
  line-height: 28px;
  color: #fff;
  background: #ee620b;
  border-radius: 5px;
}

.od_detail_cont_detail {
  margin-bottom: 10px;
}

.orderDetail_menuList_list_menuName {
  width: 65%;
  float: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.orderDetail_menuList_list_qty {
  width: 15%;
  float: left;
  text-align: center;
}

.orderDetail_menuList_list_amount {
  width: 20%;
  float: left;
  text-align: right;
  /* color: #ee620b */
}

.od_repast_total {
  width: 100%;
  text-align: right;
  color: #ee620b;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 15px;
}

.od_remark {
  width: calc(100% - 20px - 2px - 20px);
  margin-left: 10px;
  margin-top: 10px;
  border: 1px solid #e2e2e2;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 36rp;
  /* height: 36px; */
  line-height: 36px;
}

.od_remark_title {
  font-weight: bold;
}

.od_delivery {
  width: calc(100% - 20px - 2px - 20px);
  margin-left: 10px;
  margin-top: 10px;
  border: 1px solid #e2e2e2;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 36rp;
  line-height: 36px;
}

.od_delivery_title {
  font-size: 18px;
  height: 36px;
  line-height: 36px;
  font-weight: bold;
}

.od_billNum {
  width: calc(100% - 20px - 2px - 20px);
  margin-left: 10px;
  margin-top: 10px;
  border: 1px solid #e2e2e2;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 18px;
  line-height: 36px;
  margin-bottom: 10px;
}

.od_billNum_num_title {
  width: 125px;
  float: left;
  height: 36px;
  line-height: 36px;
}

.od_billNum_num_num {
  float: right;
  width: calc(100% - 125px);
  line-height: 36px;
  text-align: right;
}

.od_billNum_pay_title {
  width: 100px;
  float: left;
  height: 36px;
  line-height: 36px;
}

.od_billNum_pay_num {
  float: right;
  width: calc(100% - 100px);
  line-height: 36px;
  text-align: right;
}

.clearBoth {
  clear: both;
}
</style>
