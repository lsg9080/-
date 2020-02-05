<template>
  <div>
    <img class="si_cover" src="../assets/Sindex/t3.jpg" />
    <div class="si_cell">
      <div
        v-for="(item,index) in cells"
        :key="index"
        class="si_cell_item si_cell_items"
        @click="toLink(index)"
      >
        <div class="si_cell_item_title">
          <h4 class="si_cell_item_title_cn">{{item.desc}}</h4>
          <div class="si_cell_item_title_en">{{item.en}}</div>
        </div>
        <img class="si_cell_item_icon" :src="item.icon" />
        <div class="clearboth"></div>
      </div>
    </div>

    <!-- 遮罩层 -->
    <van-overlay :show="si_overlay">
      <div class="si_overlay_wrapper">
        <img class="si_overlay_wrapper_img" src="../assets/loading.png" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { getStaffInfo, getOpenid } from "@/serve";
import { urlQueryParams, encryption } from "../getParams.js";
import { mapState } from "vuex";
import { wechatAppId, homePage } from "@/config/auth.js";
export default {
  data() {
    return {
      cells: [
        {
          desc: "在线订餐",
          en: "FOOD & BEVERAGE",
          icon: require("../assets/Sindex/icon1.png"),
          route: "Smeals"
        },
        {
          desc: "商超便利",
          en: "CONVENIENT STORE",
          icon: require("../assets/Sindex/icon2.png"),
          route: "Smarket"
        },
        {
          desc: "我的订单",
          en: "MY ORDERS",
          icon: require("../assets/Sindex/icon3.png"),
          route: "Sorder"
        },
        {
          desc: "我的职工卡",
          en: "EMPLOYEE CARD",
          icon: require("../assets/Sindex/icon4.png"),
          route: "Recharge"
        },
        {
          desc: "个人中心",
          en: "PERSONAL CENTER",
          icon: require("../assets/Sindex/icon5.png"),
          route: "SpersonalCenter"
        }
      ],
      si_overlay: true
    };
  },
  // 自执行
  created: function() {
    // this.$store.commit("RECORD_OPENID", "ocWCVwjK_kseL-qYB83YuQYk6l3Q");
    // window.localStorage.removeItem("openid")
    // window.localStorage.setItem("openid", "o1ixfwI3WBM1zq91r_Rh7vvcJj-s");
    // window.localStorage.setItem("openid", "oMrcc5A7etjdfb9ClHbNJ97d0UVM");
    // this.$store.commit("RECORD_OPENID", 'o1ixfwI3WBM1zq91r_Rh7vvcJj-s');
    // 获取openid
    //  this.$store.commit("LOGOUT");
    this.staffOpenid();
  },
  computed: {
    ...mapState(["openid"])
  },
  methods: {
    /**
     * 授权回调后的地址
     * http://ceshi.wincome.group/?code=071DQjed0w0uiz1hZPed0vAxed0DQjeR&state=123
     *
     **/
    staffOpenid() {
      var soOpenid = this.openid;
      if (soOpenid == null) {
        var queryParams = urlQueryParams(window.location.href);
        var opencode = queryParams.code;
        if (opencode === "" || opencode == undefined || opencode == null) {
          // 通过Aauth2 进行微信授权，获取openid
          window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
            wechatAppId +
            "&redirect_uri=" +
            homePage +
            "&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
        } else {
          let authCode = encryption("wincome", 230);
          getOpenid(authCode, opencode)
            .then(data => {
              console.log(data);
              if (data.result == 0) {
                this.$store.commit("RECORD_OPENID", data.openid);
                console.log("openid||" + data.openid);
              }
              this.si_overlay = false;
            })
            .catch(err => {
              console.log(err);
              this.si_overlay = false;
            });
        }
      } else {
        this.$store.commit("RECORD_OPENID", this.openid);
        this.si_overlay = false;
      }
    },

    toLink(index) {
      if (index == 3) {
        this.employeeCard();
      } else {
        this.getStaffInfo(index);
      }
    },
    /**
     * 1. 目的判断有没有登录，登录后跳转对应页面
     * 2. 绑定后，(在线订餐、商超便利)先进行营养推荐后使用
     */
    getStaffInfo(index) {
      getStaffInfo()
        .then(res => {
          if (res.result === "0") {
            console.log("已经绑定过");
            if (res.data.age == 0 && (index == 0||index == 1)) {
              this.$router.push({
                name: "Srecomm"
              });
            } else {
              this.$router.push({
                name: this.cells[index].route
              });
            }
          } else {
            this.$router.push({ name: "Slogin" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    employeeCard() {
      getStaffInfo()
        .then(res => {
          if (res.result === "0") {
            if (res.data.cardId) {
              this.$router.push({
                name: "Recharge"
              });
            } else {
              this.$toast({
                message: "未绑定职工卡",
                forbidClick: true
              });
            }
          } else {
            this.$router.push({ name: "Slogin" });
          }
        })
        .catch(() => {
          this.$toast({
            message: "请先绑定职工卡",
            forbidClick: true
          });
        });
    }
  }
};
</script>

<style scoped>
.si_cover {
  width: 100%;
}
.si_cell {
  width: 90%;
      padding: 0 5%;
  background: #fff;
}
.si_cell_item {
  width: 100%;
  padding-bottom: 20px;
  padding-top: 20px;
}
.si_cell_items {
  border-bottom: 1px solid #e2e2e2;
}
.si_cell_item_title {
  width: calc(100% - 45px);
  float: left;
}
.si_cell_item_icon {
  width: 45px;
  float: right;
}
.si_cell_item_title_cn {
  line-height: 1.4;
  font-size: 22px;
  font-weight: bold;
}
.si_cell_item_title_en {
  font-size: 14px;
}
.si_overlay_wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.si_overlay_wrapper_img {
  width: 45px;
  animation: a 1s steps(12) infinite;
}
@keyframes a {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}
</style>
