<template>
  <div>
    <div class="rccb_status">
      <img v-if="this.$route.query.status=='ok'" src="../assets/face_happy.png" />
      <img v-else src="../assets/face_unhappy.png" />
      <div class="rccb_status_title">{{payStatus}}</div>
      <div v-if="paytitle" class="rccb_status_retitle">{{paytitle}}</div>
      <div v-if="price" class="rccb_status_money">{{price}}</div>
      <van-button type="primary" @click="confirm" class="rccb_status_btn user-testBtn">确定</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payStatus: "", // 充值状态
      paytitle: "",
      price: 0
    };
  },
  created() {
    if (this.$route.query.status == "ok") {
      this.price = "¥" + (this.$route.query.price / 1).toFixed(2);
      this.payStatus = "支付成功";
      this.paytitle = "充值金额";
    } else {
      this.payStatus = "支付失败";
    }
  },
  methods: {
    confirm() {
      this.$router.push({
        name: "Recharge"
      });
      console.log(1);
    }
  }
};
</script>

<style lang="stylus" scoped>
.rccb_status {
  width: 100%;
  margin-top: 10vh;
  text-align: center;
}

.rccb_status image {
  width: 50px;
  height: 50px;
}

.rccb_status_title {
  width: 100%;
  text-align: center;
  font-size: 18px;
  height: 24px;
  line-height: 24px;
}

.rccb_status_retitle {
  font-size: 18px;
  margin-top: 10vh;
  margin-bottom: 2vh;
  width: 100%;
  text-align: center;
}

.rccb_status_money {
  font-size: 34px;
  width: 100%;
  text-align: center;
  margin-bottom: 20vh;
}

.rccb_status_btn {
  width: 40%;
}
</style>