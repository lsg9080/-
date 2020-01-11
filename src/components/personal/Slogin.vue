<template>
  <div class="sl">
    <van-cell-group class="sl_cell">
      <van-field v-model="sl_companyName" disabled label="单位" />
    </van-cell-group>
    <van-cell-group class="sl_cell">
      <van-field
        @input="sl_getCurrentUserName"
        v-model="sl_userName"
        label="工号"
        placeholder="请输入"
        maxlength="20"
      />
    </van-cell-group>
    <van-cell-group class="sl_cell">
      <van-field
        type="number"
        @input="sl_getCurrentPhone"
        v-model="sl_userPhone"
        label="手机号"
        placeholder="请输入"
        maxlength="11"
      />
    </van-cell-group>

    <van-cell-group>
      <van-field
        type="number"
        @input="sl_getCurrentSms"
        v-model="sl_userSms"
        center
        label="验证码"
        placeholder="请输入"
        maxlength="4"
      >
        <van-button
          v-show="sl_userSmsBtnC"
          @click.self.stop="sl_getSms"
          slot="button"
          color="#323232"
          plain
          type="primary"
        >{{sl_userSmsBtn}}</van-button>
        <van-button
          v-show="sl_userSmsBtnTimeC"
          slot="button"
          disabled
          color="#323232"
          plain
          type="primary"
        >倒计时 {{sl_userSmsBtnTime}} s</van-button>
      </van-field>
    </van-cell-group>
    <div class="sl_userSubmit">
      <van-button
        type="primary"
        size="large"
        @click.self.stop="sl_getSubmit"
        color="#7da6d4"
        class="custom-btn"
      >确认绑定</van-button>
    </div>
  </div>
</template>

<script>
import { bindingStaff, getCompanyList, getSmsCode } from "@/serve";
let timer;
export default {
  data() {
    return {
      sl_companyName: "",
      sl_companyId: "",
      sl_userName: "",
      sl_userPhone: "",
      sl_userSms: "",
      sl_userSmsBtn: "发送验证码",
      sl_userSmsBtnTime: 60,
      sl_userSmsBtnC: true,
      sl_userSmsBtnTimeC: false
    };
  },
  // 自执行
  created: function() {
    // 获取单位信息
    this.getCompanyInfo();
  },
  methods: {
    // 获取单位信息
    getCompanyInfo() {
      getCompanyList()
        .then(res => {
          let data = res.data;
          if (res.result === "0") {
            this.sl_companyName = data[0].companyName;
            this.sl_companyId = data[0].companyId;
          } else {
            this.$toast({
              message: res.msg,
              forbidClick: true,
              duration: 3000
            });
            // alert('未获得单位信息')
          }
        })
        .catch(() => {
          this.$toast({
            message: "网络请求失败",
            forbidClick: true,
            duration: 3000
          });
        });
    },
    // 获取当前姓名
    sl_getCurrentUserName(e) {
      e = e.replace(/[\W]/g, "");
      this.sl_userName = e;
    },
    // 实时获取手机号
    sl_getCurrentPhone(e) {
      this.sl_userPhone = e;
    },
    // 获取验证码
    sl_getSms() {
      console.log(this.sl_userPhone);
      var $this = this;
      var phone = this.sl_userPhone;
      // 判断手机号码输入的格式/^1[0-9]{10}$/
      var regPhonNumber = /^1[3456789]\d{9}$/;
      //
      if (regPhonNumber.test(phone)) {
        getSmsCode(phone)
          .then(res => {
            if (res.result === "0") {
              $this.sl_userSmsBtnC = false;
              $this.sl_userSmsBtnTimeC = true;
              $this.sl_countDown();
              $this.$toast({
                message: res.data.note,
                forbidClick: true,
                duration: 3000
              });
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
            $this.$toast({
              message: "网络请求失败",
              forbidClick: true,
              duration: 3000
            });
          });
      } else {
        $this.$toast({
          message: "请输入有效手机号码",
          forbidClick: true,
          duration: 3000
        });
      }
    },
    // 倒计时
    sl_countDown() {
      // sl_userSmsBtnTime
      var $this = this;
      timer = setInterval(() => {
        $this.sl_userSmsBtnTime--;
        if ($this.sl_userSmsBtnTime > 0) {
          console.log("倒计时中:" + $this.sl_userSmsBtnTime);
        } else {
          clearInterval(timer);
          $this.sl_userSmsBtnTime = 60;
          $this.sl_userSmsBtnC = true;
          $this.sl_userSmsBtnTimeC = false;
        }
      }, 1000);
    },
    // 获取当前验证码
    sl_getCurrentSms(e) {
      this.sl_userSms = e;
    },
    // 确认绑定
    sl_getSubmit() {
      var $this = this;
      let params = {
        authCode: "101FCC56AB9147F69E75AC7AAC52D2BB",
        companyId: $this.sl_companyId,
        staffCode: $this.sl_userName,
        mobile: this.sl_userPhone,
        smsCode: this.sl_userSms
      };
      console.log(params);
      bindingStaff(params)
        .then(res => {
          if (res.result === "0") {
            $this.$toast({
              message: res.msg,
              forbidClick: true,
              duration: 3000
            });
            $this.$router.replace({
              path: "/srecomm",
              name: "Srecomm"
            });
            clearInterval(timer);
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
          $this.$toast({
            message: "网络请求失败",
            forbidClick: true,
            duration: 3000
          });
        });
    }
  },
  destroyed() {},
  mounted() {}
};
</script>

<style scoped>
.sl {
  width: 90%;
  margin: 0 auto;
  padding-top: 15px;
}
.van-cell {
  font-size: 18px;
  line-height: 30px;
  border: 1px solid #e2e2e2;
  border-radius: 5px;
}
.sl_cell {
  margin-bottom: 15px;
}
.sl_userSubmit {
  /* width: 100%; */
  margin-top: 15px;
  border-radius: 5px;
  font-size: 16px;
}
</style>
