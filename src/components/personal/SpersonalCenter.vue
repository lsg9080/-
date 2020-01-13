<template>
  <div class="spc">
    <van-cell title="医院" :value="spc_hosptalName" />
    <van-cell title="工号" :value="spc_staffCode" />
    <van-cell title="姓名" :value="spc_name" />
    <van-cell title="职工卡号" :value="spc_employCode" />
    <van-cell title="手机号" :value="spc_phone" />
    <van-cell
      title="营养标准推荐"
      @click="spc_nutriRecommend"
      :icon="spc_icon_recomm"
      class="spc_recommd"
    />
    <div class="spc_unBind">
      <van-button
        type="primary"
        size="large"
        @click.self.stop="unBinding"
        color="#7da6d4"
        class=" custom-btn"
      >解除绑定</van-button>
    </div>
  </div>
</template>

<script>
import { getStaffInfo, bindingDelete } from "@/serve";

export default {
  data() {
    return {
      spc_hosptalName: "",
      spc_staffCode: "",
      spc_name: "",
      spc_employCode: "",
      spc_phone: "",
      spc_icon_recomm: require("../../assets/Personal/Recommend.png")
    };
  },
  // 自执行
  created: function() {
    // 获取个人信息
    this.getInfo();
  },
  methods: {
    // 获取员工信息
    getInfo() {
      getStaffInfo()
        .then(res => {
          if (res.result === "0") {
            let data = res.data;
            this.spc_hosptalName = data.companyName;
            this.spc_staffCode = data.code;
            this.spc_name = data.name;
            this.spc_employCode = data.cardId;
            this.spc_phone = data.mobile;
            // spc_hosptalName: '',
            // spc_staffCode: '',
            // spc_name: '',
            // spc_employCode: '',
            // spc_phone: ''
          } else {
            this.$toast({
              message: res.msg,
              forbidClick: true,
              duration: 3000
            });
            //('未获得单位信息')
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
    // 解绑
    unBinding() {
      bindingDelete()
        .then(res => {
          if (res.result === "0") {
            this.$store.commit("RECORD_OPENID", null);
            this.$toast({
              message: res.data.note,
              forbidClick: true,
              duration: 3000
            });
            setTimeout(()=> {
              this.$router.replace({ path: "/" });
            }, 3000);
          } else {
            this.$toast({
              message: res.msg,
              forbidClick: true,
              duration: 3000
            });
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
    //
    spc_nutriRecommend() {
      this.$router.push({
        path: "/srecomm",
        name: "Srecomm",
        query: {
          // from: 'mealNotice'
        }
      });
    }
  }
};
</script>

<style scoped>
.spc {
  padding-top: 15px;
}
.van-cell {
  font-size: 18px;
  line-height: 37px;
}
.van-icon__image {
  font-size: 26px;
  margin-top: 6px;
}
.spc_recommd {
  margin-top: 60px;
}
.spc_unBind {
  margin-top: 25px;
  width: 90%;
  margin-left: 5%;
  border-radius: 5px;
}
.van-button {
  font-size: 18px;
}
</style>
