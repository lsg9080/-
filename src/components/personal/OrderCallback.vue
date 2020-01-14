<template>
  <div class="PaymentResults">
    <!-- 支付成功 -->
    <div class="success">
      <img src="../../assets/Personal/success@2x.png" class="img" />
      <h3>支付成功</h3>
      <div class="operationBtn">
        <div class="home" @click="goHome"></div>
        <van-button type="primary" @click="orderList" class="custom-btn btn">查看订单</van-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import store from '../store'
// import storage from '../common/js/storage'
export default {
  data() {
    return {
      patId: "",
      mealDate: ""
    };
  },
  created() {
   
  },
  methods: {
    goHome() {
      this.$router.replace({
        path: "/"
      });
    },
    orderList() {
      this.$router.replace({
        name: "Sorder"
      });
    }
  }
};
</script>

<style lang="stylus" scope>
.PaymentResults {
  position: fixed;
  z-index: 52;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #ffffff;
  padding-top: 66px;
  text-align: center;

  h3 {
    font-size: 18px;
    color: #505050;
    padding-top: 24px;
  }

  p {
    font-size: 18px;
    color: #aaaaaa;
    padding-top: 12px;
  }

  img {
    width: 220px;
    height: 220px;
  }

  .operationBtn {
    display: flex;
    justify-content: space-between;
    margin-top: 99px;
    padding: 0 18px;

    &.fail {
      margin-top: 69px;
    }

    .home {
      width: 57px;
      height: 46px;
      border: 1px solid #d8d8e4;
      border-radius: 27px;
      background: url('../../assets/Personal/home@2x.png') center center no-repeat;
      background-size: 24px 23px;
    }

    .btn {
      // background: #7574f5;
      border-radius: 27px;
      width: 126px;
      height: 46px;
      font-size: 16px;
      // color: #ffffff;
      margin-left: 15px;

      // .box-c();
      &.btn2 {
        border: 1px solid #d8d8e4;
        background: #ffffff;
        color: #aaaaaa;
        width: 162px;
        margin-left: 0;
      }

      &.w162 {
        width: 162px;
      }
    }
  }
}
</style>