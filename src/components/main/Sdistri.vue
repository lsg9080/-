<template>
  <div class="sd">
    <div class="sd_cell" @click="sd_distri_address">&nbsp; 区域 &nbsp;&nbsp; {{sd_distri_name}}</div>
    <div class="sd_cell" @click="sd_build_address">&nbsp; 楼号 &nbsp;&nbsp; {{sd_build_name}}</div>
    <div class="sd_cell" @click="sd_floor_address">&nbsp; 楼层 &nbsp;&nbsp; {{sd_flood_name}}</div>
    <div class="sd_cell">
      &nbsp; 详细位置 &nbsp;&nbsp;
      <input
        @input="sd_celldetail"
        class="sd_cell_detail"
        maxlength="50"
        type="text"
        :value="sd_address"
      />
    </div>
    <!-- {{sd_address}} -->
    <div class="sd_cell">
      &nbsp; 联系手机号 &nbsp;&nbsp;
      <input
        @input="sd_cellphone"
        class="sd_cell_phone"
        type="number"
        :value="sd_phone"
      />
    </div>
    <!-- {{sd_phone}} -->
    <div class="sd_btn" @click="sd_modify_address">确定</div>
    <!-- 区域 -->
    <van-popup v-model="sd_disPop" position="bottom" class="sd_distri_pop">
      <div class="sd_distri_pop_close">
        <img @click="sd_distripopclose" :src="sd_pop_close" />
      </div>
      <div class="sd_distri_pop_panel">
        <div
          v-for="(item, index) in sd_ads"
          :key="index"
          @click="sd_distripopchoose(item.districtName, item.districtId)"
        >{{item.districtName}}</div>
      </div>
    </van-popup>
    <!-- 楼号 -->
    <van-popup v-model="sd_buildPop" position="bottom" class="sd_distri_pop">
      <div class="sd_distri_pop_close">
        <img @click="sd_buildpopclose" :src="sd_pop_close" />
      </div>
      <div class="sd_distri_pop_panel">
        <div v-if="sd_build_list.length > 0">
          <div
            v-for="(item, index) in sd_build_list"
            :key="index"
            @click="sd_buildpopchoose(item.buildingName, item.buildingId)"
          >{{item.buildingName}}</div>
        </div>
      </div>
    </van-popup>
    <!-- 楼层 -->
    <van-popup v-model="sd_floorPop" position="bottom" class="sd_distri_pop">
      <div class="sd_distri_pop_close">
        <img @click="sd_floorpopclose" :src="sd_pop_close" />
      </div>
      <div class="sd_distri_pop_panel">
        <div v-if="sd_flood_list.length > 0">
          <div
            v-for="(item, index) in sd_flood_list"
            :key="index"
            @click="sd_floorpopchoose(item.floorName, item.floorId)"
          >{{item.floorName}}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getStaffInfo, staffAddress, getAddressList } from "@/serve";

export default {
  data() {
    return {
      sd_pop_close: require("../../assets/Smain/close.png"),
      sd_shopid: "",
      sd_distri_id: "",
      sd_distri_name: "",
      sd_build_id: "",
      sd_build_name: "",
      sd_build_list: [],
      sd_flood_id: "",
      sd_flood_name: "",
      sd_flood_list: [],
      sd_address: "",
      sd_phone: "",
      sd_ads: [], // 地址信息
      sd_disPop: false,
      sd_buildPop: false,
      sd_floorPop: false
    };
  },
  // 自执行
  created: function() {
    // 获取商家id
    this.sd_shopid = this.$route.query.shopId;
    // 获取个人信息
    this.getUserInfo();
    // 获取配送地址
    this.getAddress();
  },
  methods: {
    // 获取个人信息
    getUserInfo() {
      var $this = this;
      let scope = this.$route.query.scope;
      console.log(scope);
      getStaffInfo()
        .then(res => {
          if (res.result === "0") {
            let data = res.data;
            if (scope) {
              $this.sd_distri_name = data.districtName;
              $this.sd_build_name = data.buildingName;
              $this.sd_flood_name = data.floorName;
              $this.sd_address = data.address;
            }
            $this.sd_distri_id = data.districtId;
            $this.sd_build_id = data.buildingId;
            $this.sd_flood_id = data.floorId;
            $this.sd_phone = data.mobile;
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
    // 获取配送地址
    getAddress() {
      /**
       * {"data":[{"buildingList":[{"floorList":[{"floorId":51,"floorName":"2层"},{"floorId":64,"floorName":"4层"}],"buildingId":5,"buildingName":"三号楼"}],"districtId":3,"districtName":"南区"}],"result":"0","msg":"成功"}
       */
      var $this = this;
      getAddressList(this.sd_shopid)
        .then(res => {
          if (res.result === "0") {
            $this.sd_ads = res.data;
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
    // 区域弹框
    sd_distri_address() {
      this.sd_disPop = true;
    },
    sd_distripopclose() {
      this.sd_disPop = false;
    },
    sd_distripopchoose(name, id) {
      if (this.sd_distri_id !== id) {
        this.sd_build_id = "";
        this.sd_build_name = "";
        this.sd_flood_id = "";
        this.sd_flood_name = "";
      }
      this.sd_distri_id = id;
      this.sd_distri_name = name;
      this.sd_disPop = false;
    },
    // 楼号弹框
    sd_build_address() {
      this.sd_buildPop = true;
      this.sd_buildpop_list();
    },
    sd_buildpopclose() {
      this.sd_buildPop = false;
    },
    sd_buildpop_list() {
      for (var i = 0; i < this.sd_ads.length; i++) {
        if (this.sd_ads[i].districtId === this.sd_distri_id) {
          this.sd_build_list = this.sd_ads[i].buildingList;
        }
      }
    },
    sd_buildpopchoose(name, id) {
      if (this.sd_build_id !== id) {
        this.sd_flood_id = "";
        this.sd_flood_name = "";
      }
      this.sd_build_id = id;
      this.sd_build_name = name;
      this.sd_buildPop = false;
    },
    // 楼层弹窗
    sd_floor_address() {
      this.sd_floorPop = true;
      this.sd_floorpop_list();
    },
    sd_floorpopclose() {
      this.sd_floorPop = false;
    },
    sd_floorpop_list() {
      // sd_ads
      for (var i = 0; i < this.sd_ads.length; i++) {
        if (this.sd_ads[i].districtId === this.sd_distri_id) {
          this.sd_build_list = this.sd_ads[i].buildingList;
        }
      }
      for (var j = 0; j < this.sd_build_list.length; j++) {
        if (this.sd_build_list[j].buildingId === this.sd_build_id) {
          this.sd_flood_list = this.sd_build_list[j].floorList;
        }
      }
    },
    sd_floorpopchoose(name, id) {
      this.sd_flood_id = id;
      this.sd_flood_name = name;
      this.sd_floorPop = false;
    },
    // 详细地址
    sd_celldetail(e) {
      console.log(e);
      console.log(e.target.value);
      this.sd_address = e.target.value;
    },
    sd_cellphone(e) {
      console.log(e);
      console.log(e.target.value);
      this.sd_phone = e.target.value;
    },
    // 确认修改地址
    sd_modify_address() {
      var $this = this;
      if ($this.sd_distri_id === "") {
        $this.$toast({
          message: "无效的区域，请重新选择!",
          forbidClick: true,
          duration: 3000
        });
        return;
      } else if ($this.sd_build_id === "") {
        $this.$toast({
          message: "无效的楼号，请重新选择!",
          forbidClick: true,
          duration: 3000
        });
        return;
      } else if ($this.sd_flood_id === "") {
        $this.$toast({
          message: "无效的楼层，请重新选择!",
          forbidClick: true,
          duration: 3000
        });
        return;
      }
      let params = {
        districtId: $this.sd_distri_id,
        districtName: $this.sd_distri_name,
        buildingId: $this.sd_build_id,
        buildingName: $this.sd_build_name,
        floorId: $this.sd_flood_id,
        floorName: $this.sd_flood_name,
        address: $this.sd_address,
        mobile: $this.sd_phone
      };
      staffAddress(params)
        .then(res => {
          if (res.result === "0") {
            $this.$router.go(-1);
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
    }
  },
  destroyed() {},
  mounted() {}
};
</script>

<style scoped>
.sd {
  width: calc(100% - 18px);
  margin-left: 10px;
  padding-top: 10px;
}
.sd_cell {
  width: 100%;
  height: 38px;
  line-height: 38px;
  margin-top: 18px;
  background: #fff;
  border: 1px solid #efefef;
  font-size: 16px;
  overflow: hidden;
}
.sd_btn {
  width: 100%;
  height: 38px;
  line-height: 38px;
  margin-top: 18px;
  background: #7da6d4;
  border: 1px solid #7da6d4;
  font-size: 16px;
  border-radius: 5px;
  text-align: center;
  color: #fff;
}
.sd_distri_pop {
  width: 100%;
  height: 100vh;
  background: none;
}
.sd_distri_pop_close {
  width: 100%;
  height: 60vh;
  background: none;
  text-align: center;
  position: relative;
}
.sd_distri_pop_close img {
  position: absolute;
  width: 28px;
  bottom: 0;
  margin-bottom: 42px;
}
.sd_distri_pop_panel {
  width: 100%;
  height: 40vh;
  background: #ffffff;
  overflow: hidden;
  overflow-y: auto;
}
.sd_distri_pop_panel div {
  width: 100%;
  text-align: center;
  height: 45px;
  line-height: 45px;
}
.sd_cell_detail {
  width: 60%;
  height: 38px;
  line-height: 38px;
  border: none;
  outline: none;
}
.sd_cell_phone {
  width: 50%;
  height: 38px;
  line-height: 38px;
  border: none;
  outline: none;
}
</style>
