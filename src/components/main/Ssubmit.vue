<template>
  <div class="container">
    <div class="ss">
      <!-- 地址 -->
      <div class="ss_distri" @click="ss_distriInfo">
        <div class="ss_distriInfo">
          <div class="ss_distriInfo_title">配送信息</div>
          <div class="ss_distriInfo_panel">
            <div class="ss_distriInfo_panel_esc">{{scope?ss_distii_esc:'请选择配送地址'}}</div>
            <img class="ss_distriInfo_panel_ico" :src="ss_left_icon" />
            <div class="clearboth"></div>
          </div>
          <div class="ss_dist_namephone">{{ss_dist_namephone}}</div>
        </div>
      </div>
      <!-- 支付方式 -->
      <div class="ss_payMethod" @click="ss_paymethod">
        <div class="ss_payMethod_esc">
          <div class="ss_payMethod_esc_title">支付方式</div>
          <div class="ss_payMethod_esc_panel">{{ss_paymethod_list_chooseName}}</div>
        </div>
        <img class="ss_payMethod_ico" :src="ss_left_icon" />
        <div class="clearboth"></div>
      </div>
      <!-- 备注 -->
      <div class="ss_payMethod" @click="ss_note">
        <div class="ss_payMethod_esc">
          <div class="ss_payMethod_esc_title">备注</div>
          <div class="ss_payMethod_esc_panel">{{ss_payMethodescpanel}}</div>
        </div>
        <img class="ss_payMethod_ico" :src="ss_left_icon" />
        <div class="clearboth"></div>
      </div>
      <!-- 订单明细 -->
      <div class="ss_payMethod">
        <div class="ss_detail_title">订单明细</div>
        <div>
          <div class="ss_detail_panel" v-for="(repast) in ssRepast" :key="repast.repastId">
            <div class="ss_detail_panel_repast">{{repast.repastName}}</div>

            <div v-for="(item, index) in ssMenu" :key="index">
              <section class="ss_dpr_item" v-if="repast.repastId == item.repastId">
                <div class="ss_dpr_item_name">{{item.menuName}}</div>
                <div class="ss_dpr_item_num">×{{item.num}}</div>
                <div class="ss_dpr_item_price">¥{{item.price}}</div>
                <div class="clearboth"></div>
              </section>
            </div>
            <div class="ss_dpr_repastTotal">¥{{repast.amount.toFixed(2)}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部总和 -->
    <div class="ss_order">
      <div class="ss_order_total">
        需支付
        <label>¥{{ssTotalPrice}}</label>
      </div>
      <van-button
        type="primary"
        @click="ss_submitOrder"
        class="ss_order_submit"
        :disabled="disabled"
      >提交订单</van-button>
      <div class="clearboth"></div>
    </div>
    <!-- 弹出框 -->
    <van-popup v-model="ss_paymPop" position="bottom" class="ss_paympop">
      <div class="ss_paympop_close">
        <img :src="ss_pop_close" @click="ss_popclose" />
      </div>
      <div class="ss_paympop_panel">
        <div class="ss_paympop_panel_title">选择支付方式</div>
        <div class="ss_paympop_panel_panel">
          <van-radio-group v-model="ss_paymethod_list_chooseId">
            <van-cell-group>
              <van-cell
                class="ss_paympop_panel_panel_cell"
                :title="item.paymentName"
                clickable
                v-for="(item, index) in ss_paymethod_list"
                :key="index"
                @click="ss_choosepayMethod(item.paymentName,item.paymentId)"
              >
                <img slot="icon" :src="item.icon" class="van-icon van-cell__left-icon" />
                <van-radio slot="right-icon" :name="item.paymentId" checked-color="#1aad19"></van-radio>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  submitOrder,
  getAddressList,
  getPaymentList,
  getStaffInfo,
  getPrepayid,
  orderPaid
} from "@/serve";
import payUtils from "@/common/js/wechat";
import { encryptDes } from "@/common/js/utils";
import { wechatAppId } from "@/config/env";
import { formatDate } from "@/getParams";
import { mapState } from "vuex";

let vm;
/**
 * 支付方式分 4种；
 * 1. 职工卡支付       paymentId：1      tempOrder：1
 * 2. 到付            paymentId：2      tempOrder：1
 * 3. 微信支付        paymentId：3      tempOrder：2
 * 6.一卡通支付       paymentId：6      tempOrder：1
 * 7.雄伟一卡通支付   paymentId：7      tempOrder：1
 *
 * tips:
 * tempOrder  2：临时订单(微信支付)； 1：正常订单
 * 方式1： 提交订单后 + 确认订单 => 订单状态由预支付到已支付
 * 方式2： 提交订单
 * 方式3： 提交订单 + 获取prepay_id + 微信sdk => 订单状态由最后支付操作决定
 *         参数中‘orderCode,payId’ 必须传 并 在先后调用的接口中保持一致
 * 方式4： 只有四川版！！的环境才能正常使用，其它都是不成功的
 */
export default {
  data() {
    return {
      ss_left_icon: require("../../assets/Smain/more.png"),
      ss_menuList: [], // 商品信息
      ss_paymPop: false,
      ss_pop_close: require("../../assets/Smain/close.png"),
      ss_paymethod_list: [],
      ss_paymethod_list_chooseId: "", // 当前选择的支付方式id
      ss_paymethod_list_chooseName: "", // 当前选择的支付方式name
      ss_distii_esc: "",
      ss_dist_namephone: "",
      ssMenu: [], // 有效的商品
      ssRepast: [], // 有效餐次
      ssTotalPrice: 0,

      ss_distri_id: "",
      ss_distri_name: "",
      ss_build_id: "",
      ss_build_name: "",
      ss_floor_id: "",
      ss_floor_name: "",
      ss_address: "",
      ss_mobile: "",
      ss_submitPram: {},
      ss_payMethodescpanel: "",
      cardId: "",
      disabled: false,
      deliveryScope: null, // 配送范围
      scope: true // 在配送范围内
    };
  },
  computed: {
    ...mapState([
      "openid",
      "cartList",
      "restaurantId",
      "menuList",
      "orderDate",
      "cookbookId",
      "remarkText"
    ])
  },
  // 自执行
  created: function() {
    vm = this;
    // 获取商品信息
    this.ss_menuList = this.menuList;
    this.ss_shopid = this.$route.params.shopId;
    console.log(this.ss_shopid);

    // 获取地址信息
    this.getStaffInfo();
    // 显示具体商品信息
    this.shopInfo();

    // 备注信息
    this.ss_payMethodescpanel = this.remarkText;

    // 2、微信初始化
    /* if (/MicroMessenger/.test(window.navigator.userAgent)) {
      weChatConfig(window.location.href).then(res => {
        if (msg.code == 0) {
          payUtils.WxConfig(msg.data);
        }
      });
    }*/
  },

  methods: {
    // 获取支付方式
    paymeth() {
      var $this = this;
      getPaymentList(this.ss_shopid)
        .then(res => {
          if (res.result === "0") {
            let data = res.data;
            if ($this.cardId == "") {
              // 没有职工卡号，剔出职工卡支付
              data = data.filter(function(item) {
                return item.paymentId != 1;
              });
            }
            let newData = data.map(item => {
              if (item.paymentId == 1) {
                item.icon = require("../../assets/Smain/pay_staffcard.png");
              } else if (item.paymentId == 2) {
                item.icon = require("../../assets/Smain/pay_cash.png");
              } else {
                item.icon = require("../../assets/Smain/pay_wechat.png");
              }
              return item;
            });

            $this.ss_paymethod_list = newData;
            $this.ss_paymethod_list_chooseId = newData[0].paymentId;
            $this.ss_paymethod_list_chooseName = newData[0].paymentName;
          } else {
            $this.$toast({
              message: res.msg,
              forbidClick: true,
              duration: 3000
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 弹出支付方式
    ss_paymethod() {
      var $this = this;
      $this.ss_paymPop = true;
    },
    // 影藏支付方式
    ss_popclose() {
      var $this = this;
      $this.ss_paymPop = false;
    },
    // 选择支付方式
    ss_choosepayMethod(name, id) {
      var $this = this;
      $this.ss_paymethod_list_chooseId = id;
      $this.ss_paymethod_list_chooseName = name;
      $this.ss_paymPop = false;
    },
    // 选择送货地址
    ss_distriInfo() {
      this.$router.push({
        path: "/sdistri",
        name: "Sdistri",
        query: {
          scope: this.scope,
          shopId: this.ss_shopid
        }
      });
    },
    // 备注
    ss_note() {
      this.$router.push({
        path: "/ssubmitnote",
        name: "Ssubmitnote",
        query: {
          // from: 'mealNotice'
        }
      });
    },
    // 获取用户信息
    getStaffInfo() {
      var $this = this;
      getStaffInfo()
        .then(res => {
          if (res.result === "0") {
            let data = res.data;
            if (data.districtName) {
              $this.ss_distii_esc =
                data.districtName +
                " " +
                data.buildingName +
                " " +
                data.floorName +
                " " +
                (data.address ? data.address : "");
            }

            $this.ss_dist_namephone = data.name + " " + data.mobile;
            $this.ss_distri_id = data.districtId;
            $this.ss_distri_name = data.districtName;
            $this.ss_build_id = data.buildingId;
            $this.ss_build_name = data.buildingName;
            $this.ss_floor_id = data.floorId;
            $this.ss_floor_name = data.floorName;
            $this.ss_address = data.address ? data.address : "";
            $this.ss_mobile = data.mobile == null ? "" : data.mobile;

            this.deptId = data.deptId;
            this.deptName = data.deptName;
            this.cardId = data.cardId;

            // 获取支付方式
            this.paymeth();
            // 配送范围
            this.getDeliveryScope();
          } else {
            $this.$toast({
              message: res.msg,
              forbidClick: true,
              duration: 3000
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 显示具体商品信息
    shopInfo() {
      // 当前餐次下的所有菜品
      let cartList = [];
      cartList = this.ss_menuList.filter(item => item.num > 0);
      this.ssMenu = cartList;

      // 当前餐次下的菜品类型
      let obj = {};
      let uniques = cartList.reduce((cur, next) => {
        next = { repastName: next.repastName, repastId: next.repastId };
        obj[next.repastId] ? "" : (obj[next.repastId] = true && cur.push(next));
        return cur;
      }, []); //设置cur默认类型为数组，并且初始值为空的数组
      console.log(uniques);
      console.log(this.ssMenu);

      /*{repastId: 43,
            OrderId: 0,
            repastName: "夜宵",
            amount: 55,
            SortId: }*/
      var submitRepast = [];
      var totalPrice = 0;
      for (var m = 0; m < uniques.length; m++) {
        submitRepast.push(uniques[m]);
        var repastPrice = 0;
        for (var n = 0; n < this.ssMenu.length; n++) {
          if (uniques[m].repastId === this.ssMenu[n].repastId) {
            repastPrice =
              repastPrice + this.ssMenu[n].price * this.ssMenu[n].num;
          }
        }
        submitRepast[m].amount = repastPrice;
        submitRepast[m].OrderId = 0;
      }
      for (var k = 0; k < submitRepast.length; k++) {
        totalPrice = totalPrice + submitRepast[k].amount;
      }
      this.ssRepast = submitRepast;
      this.ssTotalPrice = totalPrice.toFixed(2);
      console.log(submitRepast);
    },
    // 配送信息范围判断
    getDeliveryScope() {
      getAddressList(this.ss_shopid)
        .then(res => {
          if (res.result === "0") {
            this.deliveryScope = res.data;
            var dist = res.data; // 区域数组
            // dist = [{
            //   buildingList: [{
            //     floorList: [
            //       { floorId: 65, floorName: "1层" },
            //       { floorId: 66, floorName: "2层" },
            //       { floorId: 67, floorName: "3层" }
            //     ],
            //     buildingId: 24,
            //     buildingName: "五号楼"
            //   }],
            //   districtId: 9,
            //   districtName: "中心区"
            // }];
            var buildArr = [];
            var floorArr = [];
            // 区域
            const item = dist.findIndex(
              item => item.districtId === this.ss_distri_id
            );
            if (item != -1) {
              buildArr = dist[item].buildingList;
            } else {
              this.scope = false;
              this.$toast({
                message: "不在配送范围内！",
                forbidClick: true,
                duration: 3000
              });
              return;
            }
            // 楼号
            const itemB = buildArr.findIndex(
              item => item.buildingId === this.ss_build_id
            );
            if (itemB != -1) {
              floorArr = buildArr[itemB].floorList;
            } else {
              this.scope = false;
              this.$toast({
                message: "不在配送范围内！",
                forbidClick: true,
                duration: 3000
              });
              return;
            }
            // 楼层
            const itemF = floorArr.findIndex(
              itemF => itemF.floorId === this.ss_floor_id
            );
            if (itemF != -1) {
              console.log("地址在配送范围之内，可以配送");
              this.scope = true;
            } else {
              this.scope = false;
              this.$toast({
                message: "不在配送范围内！",
                forbidClick: true,
                duration: 3000
              });
            }
          } else {
            this.$toast({
              message: res.msg,
              forbidClick: true,
              duration: 3000
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 提交订单前判断
    async ss_submitOrder() {
      // 1、若后台将配送地址设为不配送，则提示
      this.getDeliveryScope();

      if (!this.scope) {
        this.$toast({
          message: "不在配送范围内！",
          forbidClick: true,
          duration: 3000
        });
        return;
      }
      // 2、若后台取消支付方式的勾选，则提示
      let payments = await getPaymentList(this.ss_shopid);
      if (payments.result === "0") {
        let data = payments.data;
        if (this.cardId == "") {
          // 没有职工卡号，剔出职工卡支付
          data = data.filter(function(item) {
            return item.paymentId != 1;
          });
        }
        // data = [{ kind: 0, paymentId: 3, paymentName: "微信支付" }];
        var payment = data.findIndex(item => {
          return item.paymentId == this.ss_paymethod_list_chooseId;
        });
        if (payment == -1) {
          this.$toast({
            message: "请选择其他支付方式！",
            forbidClick: true,
            duration: 3000
          });
          this.paymeth()
          return;
        }
      }

      // 3、若绑定方式通过自动绑定（url携带职工卡号作为openid，则自动登录），则手机号强验证
      if (!this.ss_mobile) {
        this.$toast({
          message: "请填写正确的手机号！",
          forbidClick: true,
          duration: 3000
        });
        return;
      }
      this.ss_orderParam();
    },
    // 根据订单参数，选择支付类型
    ss_orderParam() {
      var timestamp = new Date().getTime(); // 当前的时间戳
      timestamp = timestamp + 30 * 60 * 1000;
      var dateAfter = new Date(timestamp);
      var getHours = dateAfter.getHours();
      var getMinutes = dateAfter.getMinutes();
      if (getHours < 10) {
        getHours = "0" + getHours;
      }
      if (getMinutes < 10) {
        getMinutes = "0" + getMinutes;
      }
      var deliveryTime = getHours + ":" + getMinutes;
      console.log(deliveryTime);
      // 微信支付：3  到付：2  职工卡支付：1
      var tempOrder = "";
      if (this.ss_paymethod_list_chooseId === 3) {
        tempOrder = 2;
      } else {
        tempOrder = 1;
      }
      for (var i = 0; i < this.ssMenu.length; i++) {
        this.ssMenu[i].qty = this.ssMenu[i].num;
      }
      var randomstr =
        (Math.random() * 10000000).toString(16).substr(0, 4) +
        "-" +
        new Date().getTime() +
        "-" +
        Math.random()
          .toString()
          .substr(2, 5);
      var orderCode = "oc" + randomstr;
      var payId = "pi" + orderCode;

      var params = {
        authCode: "101FCC56AB9147F69E75AC7AAC52D2BB",
        // weixinNo: this.openid,
        shopId: this.ss_shopid,

        districtId: this.ss_distri_id,
        districtName: this.ss_distri_name,
        buildingId: this.ss_build_id,
        buildingName: this.ss_build_name,
        floorId: this.ss_floor_id,
        floorName: this.ss_floor_name,
        deptName: this.deptName,
        deptId: this.deptId,
        address: this.ss_address,
        mobile: this.ss_mobile,
        deliveryTime: deliveryTime,
        note: this.ss_payMethodescpanel,
        repastList: this.ssRepast,
        menuList: this.ssMenu,

        paymentId: this.ss_paymethod_list_chooseId,
        tempOrder: tempOrder, // 2：临时订单(微信支付), 1 正常订单
        orderCode: orderCode,
        payId: payId,

        orderDate: this.orderDate,
        cookbookId: this.cookbookId
      };

      console.log(params);

      this.ss_submitPram = params;
      this.$dialog
        .confirm({
          title: "提示",
          message:
            "已选择" + vm.ss_paymethod_list_chooseName + "方式，确认提交订单?"
        })
        .then(() => {
          // 微信支付：3  到付：2  职工卡支付：1 一卡通支付：6   雄伟一卡通支付：7
          let p = this.ss_paymethod_list_chooseId;
          if (p === 3) {
            // 微信支付
            this.wechatPay(params);
          } else if (p == 1 || p == 6 || p == 7) {
            // 职工卡支付
            this.empCarPay(params);
          } else {
            // 到付
            this.arrivePay(params);
          }
        })
        .catch(() => {
          // this.disabled = false;
          console.log("cancel");
        });
    },
    // 到付
    arrivePay(params) {
      console.log(params);
      submitOrder(params).then(res => {
        if (res.result == "0") {
          this.$toast("订单提交成功");
          setTimeout(() => {
            this.$router.push({ name: "OrderCallback" });
          }, 1000);
          // this.disabled = false;
        } else {
          // this.disabled = false;
          this.$toast(res.msg);
        }
      });
    },
    // 【职工卡、一卡通、雄伟一卡通】支付
    empCarPay(params) {
      submitOrder(params).then(res => {
        if (res.result == "0") {
          this.confirmOrder(res.data.orderId);
        } else {
          this.disabled = false;
          this.$toast(res.msg);
        }
      });
    },
    confirmOrder(orderId) {
      orderPaid(orderId)
        .then(res => {
          if (res.result == "0") {
            setTimeout(() => {
              this.$router.replace({ name: "OrderCallback" });
            }, 1000);
          } else {
            this.$toast.fail(res.msg);
          }
          this.disabled = false;
        })
        .catch(() => {
          // this.disabled = false;
          this.$toast.fail("支付失败！");
        });
    },

    // 微信支付
    wechatPay(params) {
      this.getWXPrepayid(params);
    },

    getWXPrepayid(params) {
      let price = this.ssTotalPrice ? this.ssTotalPrice : 0.01;

      //获取当前的日期yy-mm-dd hh:mm:ss
      let callTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
        currentDate = formatDate(new Date(), "yyyyMMddhhmmss"),
        str = "wincome+" + currentDate + "+" + price,
        amountEncrypt = encryptDes(str);
      //获取body
      var body = "订单消费" + price + "元";

      let options = {
        authCode: "101FCC56AB9147F69E75AC7AAC52D2BB",
        callFrom: "wincome",
        appId: wechatAppId,
        body: body,
        callTime: callTime,
        price: price,
        paymentId: this.ss_paymethod_list_chooseId,
        amountEncrypt: amountEncrypt,
        orderCode: params.orderCode,
        payId: params.payId
      };
      console.log(options);

      getPrepayid(options)
        .then(res => {
          if (res.result == "0") {
            let wxOptions = {
              appId: res.appId,
              nonceStr: res.nonceStr,
              package: res.package,
              paySign: res.paySign,
              prepay_id: res.prepay_id,
              timeStamp: res.timeStamp
            };
            if (res.prepay_id) {
              let options = {
                deliveryTime: formatDate(new Date(), "hh:ss"),
                tradeId: "",
                tempOrder: 2
              };
              Object.assign(params, options);
              this.wechatSubmit(params, wxOptions);
            }
            // this.disabled = false;
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true
            });
            // this.disabled = false;
          }
        })
        .catch(() => {
          this.$toast({
            message: "请稍后再试",
            forbidClick: true
          });
        });
    },
    wechatSubmit(params, wxOptions) {
      submitOrder(params)
        .then(res => {
          if (res.result == "0") {
            this.wechatPaySDK(wxOptions);
          } else {
            this.$toast(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    wechatPaySDK(wxOptions) {
      let opt = {
        signType: "MD5"
      };
      console.log(wxOptions, opt);
      Object.assign(wxOptions, opt);
      console.log("从后端取到的微信参数：" + JSON.stringify(wxOptions));

      payUtils.WXJSApi(
        wxOptions,
        () => {
          this.$router.push({ name: "OrderCallback" });
        },
        () => {
          this.$toast("支付失败");
          setTimeout(() => {
            this.$router.push({ name: "Sorder" });
          }, 1000);
        }
      );
    }
  },
  activated() {
    this.getStaffInfo();
  },

  /**
   * 1.去到备注页，则保存备注内容
   * 2.离开下单页，则清空备注内容
   */
  beforeRouteLeave(to, from, next) {
    if (to.name != "Ssubmitnote") {
      this.$store.commit("CONFIRM_REMARK", "");
    }
    next();
  }
};
</script>

<style scoped>
body {
  line-height: 1.4;
}

.ss {
  width: calc(100% - 9px - 9px);
  height: calc(100vh - 45px - 9px);
  padding-top: 9px;
  margin-left: 9px;
  overflow: hidden;
  overflow-y: auto;
  font-size: 17px;
}
/* 地址 */
.ss_distri {
  width: 100%;
  border: 1px solid #e2e2e2;
  background: #fff;
  color: #7b7b7b;
  font-size: 17px;
}
.ss_distriInfo {
  width: calc(100% - 18px);
  margin: 9px;
}
.ss_distriInfo_title {
  font-weight: bold;
  height: 22px;
  color: #000000;
}
.ss_distriInfo_panel {
  height: 22px;
}
.ss_distriInfo_panel_esc {
  width: calc(100% - 22px);
  height: 22px;
  float: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ss_dist_namephone {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
}
.ss_distriInfo_panel_ico {
  width: 16px;
  float: right;
  margin-top: 4px;
}
/* 支付方式 + 备注 */
.ss_payMethod {
  width: calc(100% - 18px);
  margin-top: 9px;
  border: 1px solid #efefef;
  background: #fff;
  padding: 9px;
}
.ss_payMethod_esc {
  width: calc(100% - 22px);
  height: 22px;
  line-height: 22px;
  float: left;
}
.ss_payMethod_ico {
  width: 16px;
  float: right;
  margin-top: 2px;
}
.ss_payMethod_esc_title {
  width: 50%;
  font-weight: bold;
  float: left;
}
.ss_payMethod_esc_panel {
  float: right;
  text-align: right;
  color: #ee620b;
  width: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 订单明细 */
.ss_detail_title {
  font-weight: bold;
  border-bottom: 1px solid #efefef;
  padding-bottom: 9px;
}
.ss_detail_panel {
  margin-top: 9px;
}
.ss_detail_panel_repast {
  width: 70px;
  text-align: center;
  line-height: 1.4;
  background: #ee620b;
  color: #fff;
  border-radius: 4px;
}
.ss_dpr_item {
  width: 100%;
  color: #7b7b7b;
  height: 34px;
  line-height: 34px;
}
.ss_dpr_item_name {
  width: 60%;
  float: left;
  height: 34px;
  line-height: 34px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ss_dpr_item_num {
  width: 10%;
  float: left;
  height: 34px;
  line-height: 34px;
}
.ss_dpr_item_price {
  width: 30%;
  float: left;
  height: 34px;
  line-height: 34px;
  text-align: right;
}
.ss_dpr_repastTotal {
  width: 100%;
  text-align: right;
  color: #ee620b;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 20px;
}
/* 总和 */
.ss_order {
  width: 100%;
  height: 45px;
  line-height: 45px;
  background: #434348;
  position: relative;
}
.ss_order_total {
  margin-left: 18px;
  width: calc(60% - 18px);
  height: 45px;
  line-height: 45px;
  color: #ffffff;
}
.ss_order_total label {
  display: inline-block;
  font-size: 22px;
  font-weight: bold;
  height: 45px;
  line-height: 45px;
}
.ss_order_submit {
  width: 40%;
  /* float: right; */
  font-size: 18px;
  text-align: center;
  background: #ee620b;
  border: 1px solid #ee620b;
  color: #fff;
  height: 45px;
  line-height: 45px;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
}
/* 弹出层 */
.ss_paympop {
  width: 100%;
  height: 100vh;
  background: none;
}
.ss_paympop_close {
  width: 100%;
  height: 50vh;
  background: none;
  text-align: center;
  position: relative;
}
.ss_paympop_close img {
  position: absolute;
  width: 28px;
  bottom: 0;
  margin-bottom: 42px;
}
.ss_paympop_panel {
  width: 100%;
  height: 50vh;
  background: #ffffff;
}
.ss_paympop_panel_title {
  width: 100%;
  text-align: center;
  height: 54px;
  line-height: 54px;
  border-bottom: 1px solid #efefef;
  font-size: 18px;
}
.ss_paympop_panel_panel {
  width: 100%;
  height: calc(50vh - 54px - 10px);
  overflow: hidden;
  overflow-y: auto;
}
.ss_paympop_panel_panel_cell {
  font-size: 16px;
  padding: 15px;
}
.ss_paympop_panel_panel_cell span {
  vertical-align: middle;
}
</style>
