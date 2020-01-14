<template>
  <div>
    <div class="sr_top">
      <img :src="sr_title" />
      <div class="sr_top_tips">
        <div class="sr_top_tips1">想要每餐都吃的健康？</div>
        <div class="sr_top_tips2">请花1分钟回答几个小问题吧</div>
        <div class="sr_top_tips3">（仅适合正常非孕期健康成年人）</div>
      </div>
    </div>
    <div class="sr_cont">
      <div class="sr_cont_item">
        <van-cell title="性别" :icon="sr_request" style="border: none;">
          <van-tabs type="card" @click="sc_switchSex" color="#ee620b">
            <van-tab title="男" name="1"></van-tab>
            <van-tab title="女" name="0"></van-tab>
          </van-tabs>
        </van-cell>
      </div>
      <div class="sr_cont_item">
        <van-cell
          title="年龄"
          title-class="sr_cont_item_cell"
          :icon="sr_request"
          :value="age"
          size="large"
        />
        <van-slider v-model="age" active-color="#ee620b" :min="18" :max="120" :step="1"></van-slider>
      </div>
      <div class="sr_cont_item">
        <van-cell
          title="体重"
          title-class="sr_cont_item_cell"
          :icon="sr_request"
          :value="weight"
          size="large"
        />
        <van-slider v-model="weight" active-color="#ee620b" :min="20" :max="200" :step="1"></van-slider>
      </div>
      <div class="sr_cont_item">
        <van-cell
          title="身高"
          title-class="sr_cont_item_cell"
          :icon="sr_request"
          :value="height"
          size="large"
        />
        <van-slider v-model="height" active-color="#ee620b" :min="90" :max="230" :step="1"></van-slider>
      </div>
    </div>
    <div class="sc_recommNutri">
      <van-button
        type="primary"
        size="large"
        @click.self.stop="sc_recommNutri"
        color="#7da6d4"
        class="custom-btn"
      >查看营养素推荐</van-button>
    </div>
  </div>
</template>

<script>
import { getStaffInfo } from "@/serve";
export default {
  data() {
    return {
      sr_title: require("../../assets/Personal/t3.jpg"),
      sr_request: require("../../assets/Personal/icon6.png"),
      sex: "1",
      age: 0,
      weight: 0,
      height: 0
    };
  },
  // 自执行
  created: function() {
    this.getInfo();
  },
  methods: {
    sc_switchSex(name) {
      this.sex = name;
    },
    getInfo() {
      getStaffInfo()
        .then(res => {
          console.log(res)
          let data = res.data;
          this.sex = data.sex;
          this.age = data.age<18?18:data.age;
          this.weight = data.weight<20?20:data.weight;
          this.height = data.height<90?90:data.height;
        })
        .catch(err => {
          console.log(err);
        });
    },
    sc_recommNutri() {
      var $this = this;
      this.$router.push({
        path: "/srecommnutri",
        name: "SrecommNutri",
        query: {
          sex: $this.sex,
          age: $this.age,
          weight: $this.weight,
          height: $this.height
        }
      });
    }
  }
};
</script>

<style scoped>
.sr_top {
  width: 100%;
  height: 20vh;
  overflow: hidden;
  position: relative;
}
.sr_top img {
  width: 100%;
}
.sr_top_tips {
  position: absolute;
  top: 5vh;
  width: 100%;
  color: #ffffff;
}
.sr_top_tips1,
.sr_top_tips2 {
  width: 100%;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  line-height: 1.2;
}

.sr_top_tips3 {
  width: 100%;
  text-align: center;
  font-weight: lighter;
  font-size: 14px;
  line-height: 1.2;
}
.sr_cont_item {
  width: 95%;
  margin: 15px auto 0 auto;
  background: #ffffff;
  padding: 15px 0;
  border-radius: 5px;
  border: 1px solid #e2e2e2;
}
.van-cell {
  border-bottom: 1px solid #e2e2e2;
  font-size: 18px;
}
.sr_cont_item_cell {
  font-size: 18px;
}
.van-slider {
  width: 90%;
  margin-left: 5%;
  margin-top: 24px;
  margin-bottom: 12px;
}
.sc_recommNutri {
  margin-top: 25px;
  width: 90%;
  margin-left: 5%;
  border-radius: 5px;
  margin-bottom: 25px;
}
</style>
