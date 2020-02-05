<template>
  <div>
    <div class="srn_diary">
      <div class="srn_diary_title">每日能量摄入推荐</div>
      <div class="srn_diary_panel">
        <div class="srn_diary_panel_num">{{srn_enc.energy}}</div>
        <div class="srn_diary_panel_tit">kcal</div>
      </div>
      <div class="srn_diary_repast">
        <!-- srn_enc_repast -->
        <div class="srn_diary_repast1" v-for="(item, index) in srn_enc_repast" :key="index">
          <div class="srn_diary_repast1_item">{{item.repastName}}</div>
          <div class="srn_diary_repast1_panel">
            <div class="srn_diary_repast1_panel_num">{{item.energy}}</div>
            <div class="srn_diary_repast1_panel_tit">kcal</div>
          </div>
        </div>
        <div class="clearboth"></div>
      </div>
      <div class="srn_diary_pro">
        <div class="srn_diary_pro_title">在订餐时，看到进度条接近彼岸时，能量已经足够，切勿贪嘴</div>
        <div class="srn_diary_pro_progress">
          <div class="srn_diary_pro_progress_act"></div>
        </div>
      </div>
    </div>
    <div class="srn_chart">
      <div class="srn_chart_title">三大能量来源比推荐</div>
      <div id="main"></div>
    </div>
    <div class="srn_btn">
      <button class="srn_btn_lef" @click="srn_btnMeal">订餐</button>
      <button class="srn_btn_rig" @click="srn_btnReco">重新推荐</button>
      <div class="clearboth"></div>
    </div>
  </div>
</template>

<script>
import {nutritionStandard} from '@/serve'

export default {
  data () {
    return {
      srn_reduceWeight: '',
      srn_sex: '',
      srn_age: '',
      srn_height: '',
      srn_weight: '',
      srn_activity: '',
      srn_diseaseIds: '',
      srn_enc: [],
      srn_enc_repast: [],
      srn_canvans: []
    }
  },
  // 自执行
  created: function () {
    // 获取营养推荐
    this.srn_reduceWeight = this.$route.query.reduceWeight
    this.srn_sex = this.$route.query.sex
    this.srn_age = this.$route.query.age
    this.srn_height = this.$route.query.height
    this.srn_weight = this.$route.query.weight
    this.srn_activity = this.$route.query.activity
    this.srn_diseaseIds = this.$route.query.diseaseIds
    this.srn_recomm()
  },
  methods: {
    srn_recomm () {
      let params = {
        'weixinNo': window.globalDataPool.openid,
        'authCode': '',
        'reduceWeight': this.srn_reduceWeight,
        'sex': this.srn_sex,
        'age': this.srn_age,
        'height': this.srn_height,
        'weight': this.srn_weight,
        'activity': this.srn_activity,
        'diseaseIds': this.srn_diseaseIds
      }
      nutritionStandard(params).then((res) => {
        if (res.result === '0') {
          let data= res.data;
          this.srn_enc = data
          this.srn_enc_repast = data.repastList

          var zfp = (data.fat / (data.fat + data.carbohydr + data.protein)) * 100
          var tsp = (data.carbohydr / (data.fat + data.carbohydr + data.protein)) * 100
          var dbp = (data.protein / (data.fat + data.carbohydr + data.protein)) * 100

          this.srn_canvans.push({name: '脂肪:(' + zfp + '%)', value: data.fat})
          this.srn_canvans.push({name: '碳水化合物:(' + tsp + '%)', value: data.carbohydr})
          this.srn_canvans.push({name: '蛋白质:(' + dbp + '%)', value: data.protein})

          this.src_charts()
        } else {
          this.$toast({
            message: res.msg,
            forbidClick: true,
            duration: 3000
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    src_charts () {
      var echarts = require('echarts')
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      // 绘制图表
      myChart.setOption({
        series: [{
          type: 'pie',
          radius: '55%',
          data: this.srn_canvans
        }]
      })
    },
    srn_btnMeal () {
      this.$router.push({
        path: '/smeals',
        name: 'Smeals'
      })
    },
    srn_btnReco () {
      this.$router.push({
        path: '/srecomm',
        name: 'Srecomm'
      })
    }
  }
}
</script>

<style scoped>
  .srn_diary{
    width: 100%;
    background: #7da6d4;
    text-align: center;
    font-size: 16px;
    color: #FFFFFF;
  }
  .srn_diary_title{
    width: 100%;
    text-align: center;
    padding-top: 10px;
  }
  .srn_diary_panel{
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: none;
    border: 1px solid #FFFFFF;
    margin: 0 auto;
    color: #fff;
    margin-top: 5px;
  }
  .srn_diary_panel_num{
    padding-top:8px;
    height: 46px;
    line-height: 46px;
    font-size: 25px;
    font-weight: bold;
  }
  .srn_diary_panel_tit{
    font-size: 22px;
    height: 16px;
    line-height: 16px;
  }
  .srn_diary_repast{
    text-align: center;
  }
  .srn_diary_repast1{
    width: 20%;
    margin-left: 10%;
    float: left;
  }
  .srn_diary_repast1_item{
    color: #fff;
    font-size: 16px;
    padding: 8px 0 4px 0;
  }
  .srn_diary_repast1_panel{
    width: 66px;
    height: 66px;
    background: none;
    border-radius: 50%;
    color: #fff;
    border: 1px solid #fff;
  }
  .srn_diary_repast1_panel_num{
    font-size: 22px;
    padding-top: 10px;
  }
  .srn_diary_repast1_panel_tit{
    font-size: 16px;
  }
  .srn_diary_pro{
    padding-bottom: 70px;
    width: 80%;
    margin: 0 auto;
    margin-top: 10px;
    font-size: 16px;
    text-align: left;
    color: #fff;
  }
  .srn_diary_pro_title{
    margin-bottom: 5px;
    font-size: 14px;
  }
  .srn_diary_pro_progress{
    width: 100%;
    height: 8px;
    border-radius: 5px;
    background: #FFFFFF;
  }
  .srn_diary_pro_progress_act{
    width: 90%;
    height: 8px;
    border-radius: 5px;
    background: #ee620b;
  }
  .srn_chart{
    width: 95%;
    margin-top: -51px;
    margin-left: 2.5%;
    background: #fff;
    border-radius: 5px;
    box-shadow: 1px 1px 2px #efefef;
  }
  .srn_chart_title{
    width: 100%;
    text-align: center;
    margin: 0 auto;
    font-size: 18px;
    background: #fff;
    padding-top: 10px;
    border-radius: 5px;
  }
  #main{
    height: 40vh;
  }
  .srn_btn{
    width: 90%;
    margin: 0 auto;
    margin-top: 8px;
    text-align: center;
    margin-bottom: 45px;
  }
  .srn_btn button{
    width: 45%;
    background: #7da6d4;
    color: #fff;
    border: none;
    outline: none;
    height: 38px;
    border-radius: 5px;
  }
  .srn_btn_lef{
    float: left;
  }
  .srn_btn_rig{
    float: right;
  }
</style>
