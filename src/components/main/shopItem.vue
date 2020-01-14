<template>
  <div class="sm">
    <!-- food info -->
    <section ref="header" class="page-hd">
      <!-- business info -->
      <div class="sm_bi">
        <div class="sm_bi_img">
          <img class="sm_bi_img_logo" :src="sm_shopInfo.logo" />
        </div>
        <div class="sm_bi_cont">
          <div class="sm_bi_cont_name">
            <label>{{sm_shopInfo.shopName}}</label>

            <button @click="sm_shopList_overlay=true">换餐厅</button>
            <img
              v-if="sm_shopInfo.contact"
              src="../../assets/Smain/callphone.png"
              @click="callPhone"
            />
          </div>
          <div class="sm_bi_cont_time" @click="sm_bi_contTime">
            <label>服务时间</label>
            {{sm_shop_serverTime}}
          </div>
        </div>
        <div class="clearboth"></div>
      </div>
      <!-- select time info -->
      <div class="sm_sti" @click.stop="sm_stiReserve">
        <img class="sm_sti_reserve" src="../../assets/Smain/yudin.png" />
        <label class="sm_sti_txt">{{shop_select_time}}</label>
        <img class="sm_sti_down" src="../../assets/Smain/down.png" />
        <div class="clearboth"></div>
      </div>
      <!-- repast info -->
      <div class="sm_ri">
        <div
          class="sm_ri_item"
          @click="sm_ri_itemSelect(item.repastId)"
          v-for="(item, index) in shop_select_repast"
          :key="index"
        >
          <div
            :class="[{'sm_ri_item_contS':item.repastId==currRepastId},'sm_ri_item_cont']"
          >{{item.repastName}}</div>
        </div>
      </div>
    </section>
    <!-- <cube-scroll ref="scroll" :options="options" :scroll-events="['scroll']" :threshold="0"> -->
      <div class="sm_fi">
        <div v-if="isClosed">
          <div class="so_empty">
            <img src="../../assets/empty.png" />
            <div>当前餐厅已过服务时间</div>
          </div>
        </div>
        <div v-else-if="currMenuTypeId==-1&&sm_temp_menuTypeList.length==0">
          <div class="so_empty">
            <img src="../../assets/empty.png" />
            <div>当前餐次未配置</div>
          </div>
        </div>
        <shop-panel
          v-else-if="sm_fi_menulist.length"
          :menuList="sm_temp_menuTypeList"
          :goodsList="sm_fi_menulist"
          :currRepastId="currRepastId"
          :showDesc="true"
          @check-nutrient="sm_fi_menu_nutri"
          @add-cart="sm_panel_add"
          @remove-cart="sm_panel_reduce"
        ></shop-panel>
      </div>
    <!-- </cube-scroll> -->

    <!-- nutri program -->
    <div class="sm_np">
      <div class="sm_np_pro" :style="{'width': sm_totalPogress_pre}"></div>
    </div>
    <!-- submit info -->
    <div class="sm_si">
      <div class="sm_si_icon" @click="sm_shopcarts_oc">
        <div class="cart_icon">
          <van-icon
            class="sm_si_icon_icon"
            :name="sm_si_shop_num>0?sm_si_shop_icon:sm_si_shop_iconDis"
            size="50"
          />
          <van-tag
            round
            type="danger"
            class="sm_si_icon_iconNum"
            v-show="sm_si_shop_num>0"
          >{{sm_si_shop_num}}</van-tag>
        </div>
      </div>
      <div class="sm_si_price" @click="sm_shopcarts_oc">
        <div v-if="sm_si_shop_price>0" class="sm_si_price_price">¥{{sm_si_shop_price}}</div>
      </div>
      <div
        :class="[{'sm_si_submitS':sm_si_shop_num>0},'sm_si_submit']"
        @click.self.stop="sm_submit"
      >去结算</div>
      <div class="clearboth"></div>
    </div>
    <!-- 购物车面板(vant组件实现起来需要改动较多，自己手写panel) -->
    <div v-show="sm_shopcartsStatus" class="sm_shopcarts_mask"></div>
    <div v-show="sm_shopcartsStatus" class="sm_shopcarts_panel">
      <div class="sm_spp_close">
        <img src="../../assets/Smain/close.png" @click="sm_sppclose" />
      </div>
      <div v-show="sm_spp_panel_show" class="sm_spp_panel">
        <div class="sm_spp_panel_ev">
          <div class="sm_spp_panel_ev_clear" @click="sm_spp_panelEvClear">清空</div>
          <div class="sm_spp_panel_ev_nutri" @click="sm_spp_panelEvNutri">
            <img :src="sm_si_shop_nutri" />
            <label>营养分析</label>
          </div>
        </div>
        <div class="sm_spp_panel_data">{{shop_select_time}}</div>
        <div class="sm_spp_panel_list">
          <div v-if="sm_repast_un.length > 0">
            <div v-for="(itemRepast) in sm_repast_un" :key="itemRepast.repastId">
              <label class="sm_spp_panel_list_repastName">{{itemRepast.repastName}}</label>
              <div class="sm_spp_pl_item" v-for="(item, index) in sm_fi_menulist" :key="index">
                <div
                  class="sm_spp_pl_itemI"
                  v-if="itemRepast.repastId == item.repastId && item.num > 0"
                >
                  <div class="sm_spp_pl_item_name">{{item.menuName}}</div>
                  <div class="sm_spp_pl_item_num">¥{{item.price}}</div>
                  <div class="">
                    <label
                      class="sm_fi_list_mirpr_add"
                      @click.self.stop="sm_panel_add(item.id)"
                      v-if="item.remainingNum - item.num > 0"
                    >+</label>
                    <label class="sm_fi_list_mirpr_add_Dis" v-else>+</label>
                    <label class="sm_fi_list_mirpr_num" v-if="item.num > 0">{{item.num}}</label>
                    <label
                      class="sm_fi_list_mirpr_reduce"
                      @click.self.stop="sm_panel_reduce(item.id)"
                      v-if="item.num > 0"
                    >-</label>
                    <div class="clearboth"></div>
                  </div>
                  <!-- <div class="sm_spp_pl_item_price">
                    <div class="sm_spp_pl_item_price_reduce" @click="sm_panel_reduce(item.id)">-</div>
                    <div class="sm_spp_pl_item_price_num">{{item.num}}</div>
                    <div class="sm_spp_pl_item_price_add" @click="sm_panel_add(item.id)">+</div>
                  </div> -->
                  <div class="clearboth"></div>
                  <!-- ×{{item.num}} -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!sm_spp_panel_show" class="sm_spp_panel">
        <div class="sm_spppn_title">&nbsp;&nbsp;{{shop_select_time}}</div>
        <div class="sm_spppn_pxline"></div>
        <div class="sm_spppn_energy">
          <div class="sm_spppn_energy_title">能量摄入</div>
          <div class="sm_spppn_energy_panel">
            <div class="sm_spppn_energy_panel_title">实际</div>
            <div class="sm_spppn_energy_panel_panel">
              <div class="sm_spppn_energy_panel_panel_pro" :style="{'width': sm_spppn_acjcal_pro}"></div>
            </div>
            <div class="sm_spppn_energy_panel_kjcal">{{sm_spppn_acjcal}}cal</div>
            <div class="clearboth"></div>
            <div class="sm_spppn_energy_panel_title">推荐</div>
            <div class="sm_spppn_energy_panel_panel">
              <div class="sm_spppn_energy_panel_panel_act"></div>
            </div>
            <div class="sm_spppn_energy_panel_kjcal">{{sm_spppn_ekjcal}}Kcal</div>
            <div class="clearboth"></div>
          </div>
        </div>
        <div class="sm_spppn_energy">
          <div class="sm_spppn_energy_title">
            <div class="sm_spppn_energy_title_lef">三大能量来源比</div>
            <div class="sm_spppn_energy_title_rig">
              <label class="sm_spppn_etrD"></label>
              蛋白质
              <label class="sm_spppn_etrZ"></label>
              脂肪
              <label class="sm_spppn_etrT"></label>
              碳水化合物
            </div>
            <div class="clearboth"></div>
          </div>
          <div class="sm_spppn_energy_panel">
            <div class="sm_spppn_energy_panel_title">实际</div>
            <div class="sm_fin">
              <div class="sm_fin_D" :style="{'width': sm_s_finD}">{{sm_s_finD}}</div>
              <div class="sm_fin_Z" :style="{'width': sm_s_finZ}">{{sm_s_finZ}}</div>
              <div class="sm_fin_T" :style="{'width': sm_s_finT}">{{sm_s_finT}}</div>
            </div>
            <div class="clearboth"></div>
            <div class="sm_spppn_energy_panel_title">推荐</div>
            <div class="sm_fin">
              <div class="sm_fin_D" :style="{'width': sm_finD}">{{sm_finD}}</div>
              <div class="sm_fin_Z" :style="{'width': sm_finZ}">{{sm_finZ}}</div>
              <div class="sm_fin_T" :style="{'width': sm_finT}">{{sm_finT}}</div>
            </div>
            <div class="clearboth"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 遮罩层 -->
    <van-overlay :show="sm_shopList_overlay">
      <div class="sm_shopList_overlayC">
        <div class="sm_shopList_overlayCont">
          <div class="sm_shopList_overlayCont_shoplist">
            <div class="sm_shopList_overlayCont_shoplist_title">请选择餐厅</div>
            <div class="sm_shopList_overlayCont_shoplist_cont">
              <div
                @click="switchShop(index,item.shopId)"
                :class="[{'sm_slolcslc_itemS':switchShopId==item.shopId},'sm_slolcslc_item']"
                v-for="(item, index) in sm_shopList"
                :key="item.shopId"
              >
                <label class="sm_slolcslc_item_img">
                  <img src="../../assets/Smain/choose.png" v-show="switchShopId==item.shopId" />
                </label>
                <label class="sm_slolcslc_item_name">{{item.shopName}}</label>
              </div>
            </div>
            <div class="sm_shopList_overlayCont_shoplist_btn">
              <van-button @click.self.stop="sm_chooseShop" large color="#8db0d0">确 定</van-button>
            </div>
          </div>
          <div class="sm_shopList_overlayCont_close">
            <img
              class="sm_shopList_overlayCont_close_img"
              src="../../assets/Smain/close.png"
              @click.self.stop="sm_chooseShop_close"
            />
          </div>
        </div>
      </div>
    </van-overlay>
    <van-overlay :show="sm_sti_overlay">
      <div class="sm_sti_overlay_cont">
        <div class="sm_sti_overlay_contM">
          <div class="sm_sti_overlay_contM_item">
            <div class="sm_sti_overlay_contM_item_title">预定日期</div>
            <div class="sm_sti_overlay_contM_item_list">
              <div
                @click.self.stop="sm_chooseResverTime(item.orderDate)"
                class="sm_sti_overlay_contM_item_list_item"
                v-for="(item, index) in sm_sti_serverTimeList"
                :key="index"
              >{{item.orderDate}}</div>
            </div>
          </div>
          <div class="sm_sti_overlay_contM_close">
            <img
              class="sm_sti_overlay_contM_close_img"
              src="../../assets/Smain/close.png"
              @click.self.stop="sm_sti_overlay_contM_close_img_close"
            />
          </div>
        </div>
      </div>
    </van-overlay>
    <van-overlay :show="sm_ov_nutri_overlay">
      <div class="sm_ov_nutri">
        <div class="sm_ov_nutri_panel">
          <div class="sm_ov_nutri_panel_panel">
            <div class="sm_ov_nutri_panel_panel_title">营养素成分</div>
            <div class="sm_ov_nppp">
              <div class="sm_ov_nppp_item">
                <img :src="sm_nl" />
                <div>能量</div>
                <div style="color: rgb(145,198,52);">{{sm_item_nl}}kcal</div>
              </div>
              <div class="sm_ov_nppp_item">
                <img :src="sm_dbz" />
                <div>蛋白质</div>
                <div style="color: rgb(254,145,59);">{{sm_item_dbz}}g</div>
              </div>
              <div class="sm_ov_nppp_item">
                <img :src="sm_ss" />
                <div>脂肪</div>
                <div style="color: rgb(254,145,59);">{{sm_item_ss}}g</div>
              </div>
              <div class="sm_ov_nppp_item">
                <img :src="sm_ts" />
                <div>碳水化合物</div>
                <div style="color: rgb(64,177,247);">{{sm_item_ts}}g</div>
              </div>
              <div class="clearboth"></div>
            </div>
          </div>
          <div class="sm_ov_nutri_panel_close">
            <img @click="sm_ov_nutri_panelclose" src="../../assets/Smain/close.png" />
          </div>
        </div>
      </div>
    </van-overlay>
    <van-overlay :show="sm_ov_servertime_overlay">
      <div class="sm_ov_nutri">
        <div class="sm_ov_nutri_panel">
          <div class="sm_ov_nutri_panel_panel">
            <div class="sm_sti_overlay_contM_item_title">服务时间</div>
            <div class="sm_sti_overlay_contM_item_panel">
              <div v-for="(item, index) in sm_servertime" :key="index">
                <div
                  class="sm_sti_overlay_contM_item_panel_item"
                >{{item.repastName}}&nbsp;{{item.orderStartTime}}-{{item.orderEndTime}}</div>
              </div>
            </div>
          </div>
          <div class="sm_ov_nutri_panel_close">
            <img @click="sm_ov_servertime_overlay_close" src="../../assets/Smain/close.png" />
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import {
  getStandardNutrition,
  getMenuList,
  getRepastList,
  getShopList
} from "@/serve";
import { mapState } from "vuex";
let vm;

export default {
  data() {
    return {
      sm_shopList_overlay: true,
      sm_shopList: [],
      sm_shop_choose_id: "",
      currShopId: "",
      sm_shopInfo: {}, // 商家信息
      shop_select_time: "", // 当前时间
      shop_select_repast: [], // 当前时间餐次数组
      sm_shop_serverTime: "", // 服务时间
      sm_sti_overlay: false,
      sm_sti_serverTimeList: [],
      currRepastId: "", // 当前餐次id
      currMenuTypeId: "", // 当前菜谱类别id
      sm_fi_menulist: [], // 菜谱数据
      sm_temp_menuTypeList: [], // 临时存放菜谱类型数据数组

      sm_si_shop_icon: require("../../assets/Smain/shopCar.png"),
      sm_si_shop_iconDis: require("../../assets/Smain/shopCar1.png"),
      sm_si_shop_num: 0, // 选中的菜谱总数
      sm_si_shop_price: 0, // 选中的菜谱总价
      sm_shop_carts_panel: true,
      sm_shopcartsStatus: false, // 购物车面板显示与隐藏
      sm_si_shop_nutri: require("../../assets/Smain/nutri.png"),
      sm_repast_un: [], // 餐次数组
      // sm_nutri_more: require("../../assets/Smain/more.png"),
      sm_ov_nutri_overlay: false,
      sm_ov_servertime_overlay: false,
      sm_dbz: require("../../assets/Smain/zg_DBZ.png"),
      sm_nl: require("../../assets/Smain/zg_NL.png"),
      sm_ss: require("../../assets/Smain/zg_SS.png"),
      sm_ts: require("../../assets/Smain/zg_TS.png"),
      sm_item_dbz: "",
      sm_item_nl: "",
      sm_item_ts: "",
      sm_item_ss: "",
      sm_totalPogress: 0,
      sm_totalPogress_pre: "0%",
      sm_sti_show: true,
      sm_servertime: [],
      sm_spp_panel_show: true,
      sm_spppn_ekjcal: 0,
      sm_spppn_acjcal: 0,
      sm_spppn_acjcal_pro: "0%",
      sm_finD: "0%",
      sm_finZ: "0%",
      sm_finT: "0%",
      sm_s_finD: "0%",
      sm_s_finZ: "0%",
      sm_s_finT: "0%",
      isClosed: false,
      switchShopId:null
    };
  },
  // 自执行
  created: function() {
    vm = this;
    this.sm_totalPogress = parseFloat(
      window.localStorage.getItem("energy"),
      10
    );
   
    // 获取上一次选择商家的id
    var CurShopId = this.restaurantId;
    if (CurShopId === null || CurShopId ===undefined ||CurShopId ==='') {
      this.currShopId = "";
    } else {
      this.currShopId = CurShopId;
      this.sm_shopList_overlay = false;
    }
    // 获取商家列表
    this.getShopList();

  },
  computed: {
    ...mapState(["restaurantId"]),
    options() {
      return { click: false, stopPropagation: true, bounce: false };
    }
  },
  methods: {
    // 获取商家列表
    getShopList() {
      var $this = this;
      getShopList()
        .then(res => {
          if (res.result === "0") {
            let cateringShop = res.data.filter(item => item.typeId != 119); // 119 商超类
            $this.sm_shopList = cateringShop;
            // 判断商家类别并默认选中商家，默认选中上一次选中的商家，若没有选中的，则默认显示第一条
            var chooseSId = this.restaurantId;
            if (chooseSId === null|| chooseSId ===undefined ||chooseSId ==='') {
              $this.currShopId = cateringShop[0].shopId;
              this.switchShopId = cateringShop[0].shopId;
            } else {
              $this.currShopId = chooseSId;
              this.switchShopId = chooseSId;
              cateringShop.forEach(item => {
                if (JSON.stringify(item.shopId) == chooseSId) {
                  $this.sm_shopInfo = item;
                  if ($this.sm_shopInfo.dateList.length < 2) {
                    $this.sm_sti_show = false;
                  }
                  $this.shop_select_time =
                    $this.sm_shopInfo.dateList[0].orderDate;
                  $this.shopRepastInfo();
                }
              });
            }
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
    // 选择商家
    switchShop(index, id) {
      this.switchShopId = id;
    },
    // 确定选择的商家
    sm_chooseShop() {
      this.currShopId = this.switchShopId;
      this.$store.commit("RECORD_RESTAURANT_ID", this.currShopId);
      this.sm_shopList_overlay = false;
      this.sm_shopList.forEach(item => {
        if (item.shopId === this.currShopId) {
          this.sm_shopInfo = item;
          this.shop_select_time = item.dateList[0].orderDate;
        }
      });
      this.shopRepastInfo();
      this.sm_si_shop_num = 0;
      this.sm_si_shop_price = 0;
      this.sm_totalPogress_pre = "0%";
    },
    // 关闭选择的商家
    sm_chooseShop_close() {
      this.sm_shopList_overlay = false;
      this.switchShopId = this.currShopId
    },
    // 查看服务时间
    sm_bi_contTime() {
      this.sm_ov_servertime_overlay = true;
    },
    sm_ov_servertime_overlay_close() {
      this.sm_ov_servertime_overlay = false;
    },
    // 加载商家餐次信息
    shopRepastInfo() {
      // 商家信息
      getRepastList(this.sm_shopInfo.shopId, this.shop_select_time)
        .then(res => {
          if (res.result === "0") {
            let data = res.data;
            // 服务时间
            var servertime = res.repast;
            this.sm_servertime = servertime;

            this.sm_shop_serverTime = "";
            for (var i = 0; i < servertime.length; i++) {
              this.sm_shop_serverTime =
                this.sm_shop_serverTime +
                servertime[i].repastName +
                " " +
                servertime[i].orderStartTime +
                "-" +
                servertime[i].orderEndTime +
                " ";
            }
            // 当前日期的餐次数组
            this.shop_select_repast = data;
            if (data.length) {
              // 加载默认餐次
              this.currRepastId = data[0].repastId;
              // 加载菜谱数据
              this.getShopMenuList();
              this.isClosed = false;
            } else {
              this.isClosed = true;
              this.sm_fi_menulist = [];
              this.sm_temp_menuTypeList = [];
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

    // 切换订餐日期
    sm_stiReserve() {
      var $this = this;

      $this.sm_sti_serverTimeList = $this.sm_shopInfo.dateList;
      console.log($this.sm_sti_serverTimeList);
      $this.sm_sti_overlay = true;
    },
    // 关闭 切换订餐日期  遮罩层
    sm_sti_overlay_contM_close_img_close() {
      this.sm_sti_overlay = false;
    },
    // 选择新的订餐时间
    sm_chooseResverTime(time) {
      var $this = this;
      this.$dialog
        .confirm({
          title: "提示",
          message: "更改订单时间，购物车数据将清空"
        })
        .then(() => {
          // on confirm
          $this.shop_select_time = time;
          $this.sm_sti_overlay = false;
          $this.shopRepastInfo();
          $this.sm_si_shop_num = 0;
          $this.sm_si_shop_price = 0;
          $this.sm_totalPogress_pre = "0%";
        })
        .catch(() => {
          // on cancel
          console.log("cancel");
        });
    },
    // 切换餐次
    sm_ri_itemSelect(repastId) {
      this.currRepastId = repastId;
      // this.sm_getMeal()
      this.menuListDeal();
    },
    // 拨号
    callPhone() {
      this.$dialog
        .confirm({
          message: `拨打${vm.sm_shopInfo.contact}?`
        })
        .then(() => {
          window.location.href = "tel:" + vm.sm_shopInfo.contact;
        })
        .catch(() => {});
    },
    // 获取菜谱数据
    getShopMenuList() {
      getMenuList(this.sm_shopInfo.shopId, this.shop_select_time)
        .then(res => {
          if (res.result === "0") {
            let data = res.data;
            window.localStorage.setItem("cookbookId", data.cookbookId);
            for (var i = 0; i < data.menuList.length; i++) {
              data.menuList[i].num = 0;
              data.menuList[i].id = i + 1;
            }
            this.sm_fi_menulist = data.menuList;
            this.menuListDeal();
          } else {
            this.sm_temp_menuTypeList = [];
            this.currMenuTypeId = -1;
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
    // 处理菜谱数据
    menuListDeal() {
      // 当前餐次下的所有菜品
      let currRepastMenu = this.sm_fi_menulist.filter(
        item => item.repastId === this.currRepastId
      );
      // 当前餐次下无菜品时，不做后续操作
      if (!currRepastMenu.length) {
        this.sm_temp_menuTypeList = [];
        this.currMenuTypeId = -1;
        return;
      }
      // 当前餐次下的菜品类型
      let obj = {};
      let menuTypeList = currRepastMenu.reduce((cur, next) => {
        next = { menuTypeName: next.menuTypeName, menuTypeId: next.menuTypeId };
        obj[next.menuTypeId]
          ? ""
          : (obj[next.menuTypeId] = true && cur.push(next));
        return cur;
      }, []); //设置cur默认类型为数组，并且初始值为空的数组
      console.log(menuTypeList);

      this.sm_temp_menuTypeList = menuTypeList;
      this.currMenuTypeId = menuTypeList[0].menuTypeId;
    },
    // 选择不同菜谱类别
    sm_select_menuType(typeId) {
      this.currMenuTypeId = typeId;
    },

    // 菜谱面板 添加菜谱
    sm_panel_add(id, item) {
      var $this = this;
      for (var i = 0; i < $this.sm_fi_menulist.length; i++) {
        if (
          $this.sm_fi_menulist[i].remainingNum - $this.sm_fi_menulist[i].num <
          0
        ) {
          return;
        }
        if ($this.sm_fi_menulist[i].id === id) {
          $this.sm_fi_menulist[i].num++;
        }
      }
      // 处理submit信息
      $this.sm_subPanel();

      this.$store.commit("ADD_CART", item);
    },
    // 菜谱面板 减少菜谱
    sm_panel_reduce(id) {
      var $this = this;
      for (var i = 0; i < $this.sm_fi_menulist.length; i++) {
        if ($this.sm_fi_menulist[i].id === id) {
          $this.sm_fi_menulist[i].num--;
        }
      }
      // 处理submit信息
      $this.sm_subPanel();

    },
    // 处理submit信息
    sm_subPanel() {
      var $this = this;
      // sm_fi_menulist
      var totalnum = 0;
      var totalprice = 0;
      var totalProgress = 0;
      for (var i = 0; i < $this.sm_fi_menulist.length; i++) {
        totalnum = totalnum + $this.sm_fi_menulist[i].num;
        totalprice =
          totalprice +
          $this.sm_fi_menulist[i].num * $this.sm_fi_menulist[i].price;
        totalProgress =
          totalProgress +
          $this.sm_fi_menulist[i].num * $this.sm_fi_menulist[i].energy;
      }
      // sm_totalPogress
      $this.sm_si_shop_num = totalnum;
      $this.sm_si_shop_price = totalprice.toFixed(2);
      $this.sm_totalPogress_pre =
        (totalProgress / $this.sm_totalPogress) * 100 + "%";
    },
    // 购物车面板显示与影藏
    sm_shopcarts_oc() {
      var $this = this;
      if ($this.sm_si_shop_num <= 0) {
        $this.sm_shopcartsStatus = false;
        return;
      }
      // 显示与影藏购物车面板
      if ($this.sm_shopcartsStatus === false) {
        $this.sm_shopcartsStatus = true;
        $this.sm_spp_panel_show = true;
        $this.sm_shopcarts_repast(); // 处理菜谱餐次数组，用于显示购物车面板
      } else {
        $this.sm_shopcartsStatus = false;
      }
    },

    // 关闭购物车面板
    sm_sppclose() {
      this.sm_shopcartsStatus = false;
    },
    // 处理菜谱餐次数组，用于显示购物车面板
    sm_shopcarts_repast() {
      var $this = this;
      console.log(this.sm_fi_menulist);
      var repastArr = [];
      for (var i = 0; i < $this.sm_fi_menulist.length; i++) {
        if ($this.sm_fi_menulist[i].num > 0) {
          repastArr.push({
            repastId: $this.sm_fi_menulist[i].repastId,
            repastName: $this.sm_fi_menulist[i].repastName
          });
        }
      }
      //
      console.log(repastArr);
      // 剔除数组中重复数组
      var uniques = [];
      var stringify = {};
      for (var s = 0; s < repastArr.length; s++) {
        var keys = Object.keys(repastArr[s]);
        keys.sort(function(a, b) {
          return Number(a) - Number(b);
        });
        var str = "";
        for (var t = 0; t < keys.length; t++) {
          str += JSON.stringify(keys[t]);
          str += JSON.stringify(repastArr[s][keys[t]]);
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(repastArr[s]);
          stringify[str] = true;
        }
      }
      console.log(uniques);
      // this.sm_temp_menuTypeList = uniques// 品类数组(已处理)(剔除重复数据)
      $this.sm_repast_un = uniques;
      //
    },
    // 去结算
    sm_submit() {
      var $this = this;
      if ($this.sm_si_shop_num > 0) {
        window.localStorage.setItem("orderDate", $this.shop_select_time);
        // 去结算
        console.log(this.sm_fi_menulist);
        this.$store.commit('RECORD_MENULIST',this.sm_fi_menulist)
        // console.log('去结算')
        this.$router.push({
          name: "Ssubmit",params:{shopId:this.restaurantId}
        });
      }
    },
    // 查看具体营养素
    sm_fi_menu_nutri(info) {
      let { energy, protein, fat, carbohydr } = info;
      this.sm_ov_nutri_overlay = true;
      this.sm_item_dbz = protein;
      this.sm_item_nl = energy;
      this.sm_item_ts = carbohydr;
      this.sm_item_ss = fat;
    },
    // 关闭查看具体营养素
    sm_ov_nutri_panelclose() {
      this.sm_ov_nutri_overlay = false;
      this.sm_item_dbz = "";
      this.sm_item_nl = "";
      this.sm_item_ts = "";
      this.sm_item_ss = "";
    },
    // 清空购物车
    sm_spp_panelEvClear() {
      var $this = this;
      this.$dialog
        .confirm({
          title: "提示",
          message: "是否清空购物车"
        })
        .then(() => {
          // on confirm
          console.log("confirm");
          for (var i = 0; i < $this.sm_fi_menulist.length; i++) {
            $this.sm_fi_menulist[i].num = 0;
          }
          $this.sm_shopcartsStatus = false;
          $this.sm_si_shop_num = 0;
          $this.sm_si_shop_price = 0;
          $this.sm_totalPogress_pre = "0%";
        })
        .catch(() => {
          // on cancel
          console.log("cancel");
        });
    },
    // 营养分析
    sm_spp_panelEvNutri() {
      this.sm_spp_panel_show = false;
      // 获取推荐营养素
      var $this = this;
      getStandardNutrition()
        .then(data => {
          console.log(data);
          if (data.data.result === "0") {
            $this.sm_spppn_ekjcal = data.data.data.energy; // 推荐的能量
            // sm_fi_menulist
            var actEnergy = 0;
            var actDBZ = 0;
            var actZF = 0;
            var actTS = 0;
            for (var i = 0; i < $this.sm_fi_menulist.length; i++) {
              actEnergy =
                actEnergy +
                $this.sm_fi_menulist[i].num * $this.sm_fi_menulist[i].energy;
              actDBZ =
                actDBZ +
                $this.sm_fi_menulist[i].num * $this.sm_fi_menulist[i].protein;
              actZF =
                actZF +
                $this.sm_fi_menulist[i].num * $this.sm_fi_menulist[i].fat;
              actTS =
                actTS +
                $this.sm_fi_menulist[i].num * $this.sm_fi_menulist[i].carbohydr;
            }
            $this.sm_spppn_acjcal = actEnergy.toFixed(2); // 实际的能量
            // sm_spppn_acjcal
            // actEnergy * 95 / parseFloat(data.data.data.energy, 10)
            console.log(
              (actEnergy * 95) / parseFloat(data.data.data.energy, 10)
            );
            $this.sm_spppn_acjcal_pro =
              (actEnergy * 95) / data.data.data.energy + "%";

            var actDBZP = ((actDBZ / (actDBZ + actZF + actTS)) * 100).toFixed(
              2
            );
            var actZFP = ((actZF / (actDBZ + actZF + actTS)) * 100).toFixed(2);
            var actTSP = 100 - actDBZP - actZFP;
            $this.sm_s_finD = actDBZP + "%";
            $this.sm_s_finZ = actZFP + "%";
            $this.sm_s_finT = actTSP + "%";
            //
            // sm_s_finD: '0%', protein
            // sm_s_finZ: '0%', fat
            // sm_s_finT: '0%'  carbohydr
            //
            var fd =
              (data.data.data.protein /
                (data.data.data.protein +
                  data.data.data.fat +
                  data.data.data.carbohydr)) *
              100;
            var fz =
              (data.data.data.fat /
                (data.data.data.protein +
                  data.data.data.fat +
                  data.data.data.carbohydr)) *
              100;
            $this.sm_finD = fd + "%";
            $this.sm_finZ = fz + "%";
            $this.sm_finT = 100 - fz - fd + "%";
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
@import "../../common/styles/market.css";
</style>