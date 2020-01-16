<template>
  <div>
    <div class="rc_title">
      <img class="rc_title_img" src="../assets/money.png" />
      <div class="rc_title_title">当前余额</div>
      <div class="rc_title_conte">¥{{balance}}</div>
    </div>
    <div class="rc_form">
      <div class="rc_formM">
        <div class="rc_form_title">充值金额</div>
        <div class="formSubmitV">
          <label class="rc_form_inputNumTitle">¥</label>
          <van-field
            v-model="value"
            type="number"
            maxlength="4"
            clearable
            placeholder="充值最小为¥1，最高¥9999"
            class="rc_form_inputNum"
          />
          <div class="clearboth"></div>
        </div>
        <!-- 确认 -->
        <div class="rc_form_submint">
          <van-button
            type="primary"
            size="large"
            class="custom-btn"
            color="#7da6d4"
            @click="formSubmit"
          >充 值</van-button>
        </div>
        <div class="zhanwie"></div>
      </div>
    </div>
  </div>
</template>  

<script>
import { getStaffInfo , getPrepayid} from "@/serve"; //
import payUtils from "@/common/js/wechat";
import { encryptDes } from "@/common/js/utils"; //encryptionPay,
import { wechatAppId } from "@/config/auth";
import { formatDate } from "@/getParams";

export default {
  data() {
    return {
      balance: 0,
      value: null
    };
  },

  created() {
    this.initLoadStaffInfo();
  },
  methods: {
    initLoadStaffInfo() {
      getStaffInfo()
        .then(res => {
          if (res.result === "0") {
            this.balance = res.data.balance;
          } else {
            this.$toast({
              message: res.msg,
              forbidClick: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    formSubmit() {
      var price = this.value;

      //判断是否填写充值金额
      if (price == null) {
        this.$toast({
          message: "输入充值金额!",
          forbidClick: true
        });
        return;
      }
      if (price == 0) {
        this.$toast({
          message: "金额必须大于0",
          forbidClick: true
        });
        return;
      }
      this.unifiedPay(price);
    },
    unifiedPay(price) {

      price = parseInt(price, 10).toFixed(2); //价格单位‘元’


      //获取当前的日期yy-mm-dd hh:mm:ss
      let currentDate = formatDate(new Date(), "yyyyMMddhhmmss");
      let callTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      var str = "wincome+" + currentDate + "+" + price;
      var amountEncrypt = encryptDes(str);
      //获取body
      var body = "已充值" + price + "元";

     /* var randomstr =
        (Math.random() * 10000000).toString(16).substr(0, 4) +
        "-" +
        new Date().getTime() +
        "-" +
        Math.random()
          .toString()
          .substr(2, 5);
      var orderCode = "oc" + randomstr;
      var payId = "pi" + orderCode;*/
      let params = {
        authCode: "101FCC56AB9147F69E75AC7AAC52D2BB",
        callFrom: "wincome",
        appId: wechatAppId,
        body: body,
        callTime: callTime,
        price: price,
        amountEncrypt: amountEncrypt,
        /*payId: payId,
        orderCode: orderCode,
        paymentId: 0, //预支付充值*/
      };
      console.log(params)
      /*let a = {
        appId: "wxdf3faecaa389c105",
        body: "已充值11.00元",
        price: 11.0,
        paymentId: 0,
        orderCode: "oc7d41 - 1578373942999 - 28126",
        payId: "pioc7d41-1578373942999 - 28126",
        amountEncrypt:
          "B37C906108B5A9A3F613134CDD3BDA60CC39A88C448442B1D5EA8FF1F29275A8",
        authCode: "101FCC56AB9147F69E75AC7AAC52D2BB",
        weixinNo: "oMrcc5A7etjdfb9ClHbNJ97d0UVM",
        callFrom: "wincome",
        callTime: "2020-01 - 07 13: 12: 22"
      };*/
    
      getPrepayid(params)
        .then(res => {
          if (res.result == "0") {
            let wxOptions = {
              appId: res.appId,
              nonceStr: res.nonceStr,
              package: res.package,
              paySign: res.paySign,
              prepay_id: res.prepay_id,
              timeStamp: res.timeStamp,
              price: params.price
            };
            if (res.prepay_id) {
              this.wechatPay(wxOptions);
            }
          } else {
            this.$toast({
              message: res.msg,
              forbidClick: true
            });
          }
        })
        .catch(() => {
          this.$toast({
            message: "请稍后再试",
            forbidClick: true
          });
        });
    },
    wechatPay(wxOptions) {
      console.log("微信支付");
      /*wxOptions = {
        prepay_id: "wx10183618537375bdc6483fea1794844000",
        appId: "wxcf2261853abfc265",
        timeStamp: "1578652578",
        nonceStr: "2870CDFBFDCAD08B530ADD463788D92B",
        package: "prepay_id=wx10183618537375bdc6483fea1794844000",
        paySign: "0C97952B2C3B38499078F09CE51453C6",
        payId: "WX20200110183618765311926182",
        tradeId: null,
        orderCode: "WX202001101836187653"
      };*/
      let opt = {
        tradeId: "",
        signType: "MD5"
      };
      Object.assign(wxOptions, opt);
      console.log("从后端取到的微信参数：" + JSON.stringify(wxOptions));
      payUtils.WxConfig(wxOptions);
      payUtils.WXJSApi(
        wxOptions,
        () => {
          this.$toast('充值成功')
          this.initLoadStaffInfo();
          // this.$router.push({
          //   path: "/rechargeCallback",
          //   query: { status: "ok", price: wxOptions.price }
          // });
        },
        () => {
          this.$toast('充值失败')
          // this.$router.push({
          //   path: "/rechargeCallback",
          //   query: { status: "fail" }
          // });
        }
      );
    }
  }
};
</script>

<style scoped>
page {
  background: #fbfbfb;
}
.rc_title {
  width: calc(100% - 30px);
  text-align: center;
  background: #fff;
  /* color: #fff;  */
  padding-bottom: 24px;
  margin-top: 15px;
  margin-left: 15px;
}
.rc_title_img {
  width: 80px;
  height: 80px;
  margin-top: 25px;
}
.rc_title_title {
  font-size: 18px;
  width: 100%;
  text-align: center;
  padding-top: 25px;
}
.rc_title_conte {
  font-size: 26px;
  height: 54px;
  line-height: 54px;
  width: 100%;
  text-align: center;
  color: #ee620b;
}
.rc_form {
  width: calc(100% - 30px);
  margin-left: 15px;
  margin-top: 25px;
  font-size: 18px;
  background: #fff;
}
.rc_formM {
  width: calc(100% - 30px);
  margin-left: 15px;
}
.rc_form_title {
  height: 54px;
  line-height: 54px;
}
.formSubmitV {
  border-bottom: 1px solid #e2e2e2;
}
.rc_form_inputNumTitle {
  width: 24px;
  font-size: 24px;
  height: 54px;
  line-height: 54px;
  font-weight: bold;
  float: left;
}
.rc_form_inputNum {
  width: calc(100% - 24px);
  height: 54px;
  padding: 0;
  line-height: 54px;
  font-size: 24px;
  float: left;
}
::-webkit-input-placeholder {
  color: #e2e2e2;
}
.rc_form_submint {
  margin-top: 25px;
  border-radius: 5px;
}
.rc_form_submint .van-button {
  font-size: 18px;
}
.rc_form_fixed {
  margin-bottom: 15px;
}
.rc_form_fixed1 {
  width: 30%;
  float: left;
  background: #fff;
  color: #7da6d4;
  border: 1px solid #7da6d4;
}
.rc_form_fixed2 {
  width: 30%;
  float: left;
  margin-left: 5%;
  background: #fff;
  color: #7da6d4;
  border: 1px solid #7da6d4;
}
.rc_form_fixed3 {
  width: 30%;
  float: left;
  margin-left: 5%;
  background: #fff;
  color: #7da6d4;
  border: 1px solid #7da6d4;
}
.rc_form_fixed4 {
  width: 30%;
  float: left;
  background: #fff;
  color: #7da6d4;
  border: 1px solid #7da6d4;
}
.rc_form_fixed5 {
  width: 30%;
  float: left;
  margin-left: 5%;
  background: #fff;
  color: #7da6d4;
  border: 1px solid #7da6d4;
}
.rc_form_fixed6 {
  width: 30%;
  float: left;
  margin-left: 5%;
  background: #fff;
  color: #7da6d4;
  border: 1px solid #7da6d4;
}
.rc_form_fixed7 {
  width: 30%;
  float: left;
  background: #fff;
  color: #7da6d4;
  border: 1px solid #7da6d4;
}
.rc_form_fixed8 {
  width: 30%;
  float: left;
  margin-left: 5%;
  background: #fff;
  color: #7da6d4;
  border: 1px solid #7da6d4;
}
.zhanwie {
  height: 25px;
}
/* 清除浮动 */
.clearboth {
  clear: both;
}
</style>