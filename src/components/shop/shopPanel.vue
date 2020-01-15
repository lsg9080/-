<template>
  <div class="container">
    <scroll-nav
      ref="scrollNav"
      :side="true"
      :data="menuList"
      :current="current"
      @change="changeHandler"
      @sticky-change="stickyChangeHandler"
      @refresh="refreshHandler"
    >
      <!-- ,index -->
      <cube-scroll-nav-panel
        v-for="(item) in menuList"
        :key="item.menuTypeName"
        :label="item.menuTypeName"
        :title="item.menuTypeName"
      >
        <div class="content">
          <div class="sm_fi_list_menu" v-for="(itemMenu, index) in goodsList" :key="index">
            <div
              class="sm_fi_list_menu_item"
              v-if="itemMenu.repastId == currRepastId && itemMenu.menuTypeId == item.menuTypeId"
            >
              <div class="sm_fi_list_menu_item_left">
                <img :src="itemMenu.picture" v-lazy="itemMenu.picture" />
                <img
                  v-if="itemMenu.remainingNum - itemMenu.num==0"
                  src="../../assets/Smain/sellout.png"
                  class="sellout_img"
                  alt
                />
              </div>
              <div class="sm_fi_list_menu_item_right">
                <div class="sm_fi_list_menu_item_right_menuName">{{itemMenu.menuName}}</div>
                <div
                  class="sm_fi_list_menu_item_right_remain"
                >还剩{{itemMenu.remainingNum - itemMenu.num}}份</div>
                <div class="sm_fi_list_menu_item_right_price">
                  <div class="sm_fi_list_menu_item_right_price_left">¥{{itemMenu.price}}</div>
                </div>
                <div class="sm_fi_list_menu_item_right_num">
                  <label
                    class="sm_fi_list_mirpr_add"
                    @click.self.stop="addToCart(itemMenu,itemMenu.id)"
                    v-if="itemMenu.remainingNum - itemMenu.num > 0"
                  >+</label>
                  <label class="sm_fi_list_mirpr_add_Dis" v-else>+</label>
                  <label class="sm_fi_list_mirpr_num" v-if="itemMenu.num > 0">{{itemMenu.num}}</label>
                  <label
                    class="sm_fi_list_mirpr_reduce"
                    @click.self.stop="removeOutCart(itemMenu,itemMenu.id)"
                    v-if="itemMenu.num > 0"
                  >-</label>
                  <div class="clearboth"></div>
                </div>
              </div>
              <div class="clearboth"></div>
              <div
                @click.stop="onNutri(itemMenu.energy, itemMenu.protein, itemMenu.fat, itemMenu.carbohydr)"
                class="sm_fi_nutri"
                v-show="(itemMenu.hasNutrient == 0&&showDesc)?true:false"
              >
                <div
                  class="sm_fi_nutri_panel"
                >能量{{itemMenu.energy}}kcal&nbsp;蛋白质{{itemMenu.protein}}g&nbsp;脂肪{{itemMenu.fat}}g&nbsp;碳水化合物{{itemMenu.carbohydr}}g</div>
                <img class="sm_fi_nutri_img" src="../../assets/Smain/more.png" />
                <div class="clearboth"></div>
              </div>
            </div>
          </div>
        </div>
      </cube-scroll-nav-panel>
    </scroll-nav>
  </div>
</template>

<script type="text/ecmascript-6">
import scrollNav from "@/components/scroll/scroll-nav";
export default {
  data() {
    return {
      current: "" //当前导航 active 项的 key 值
    };
  },
  props: {
    //食品列表
    menuList: {
      type: Array
    },
    goodsList: {
      type: Array
    },
    currRepastId: {
      type: [String, Number]
    },
    showDesc: {
      type: Boolean
    }
  },
  components: {
    scrollNav
  },
  computed: {
    // current() {
    //   return this.menuList[0].menuTypeName;
    // }
  },
  created() {
    // console.log(this.menuList);
    // this.current = this.menuList[0].menuTypeName;
  },

  methods: {
    // 查看营养素
    onNutri(energy, protein, fat, carbohydr) {
      this.$emit("check-nutrient", { energy, protein, fat, carbohydr });
    },
    changeHandler(label) {
      console.log("changed to:", label);
    },
    stickyChangeHandler(current) {
      console.log("sticky-change", current);
    },
    refreshHandler(a) {
      console.log("a:", a);
    },

    // 菜谱面板 添加菜谱
    addToCart(id, itemMenu) {
      this.$emit("add-cart", itemMenu, id);
    },
    // 菜谱面板 减少菜谱
    removeOutCart(id, itemMenu) {
      this.$emit("remove-cart", itemMenu, id);
    }
  },
  watch: {
    /**
     * 1.切换餐次时：监听商品商品类型的改变，刷新显示，实现选中导航的第一个！！！
     */
    menuList(newVal) {
      this.$refs.scrollNav.refresh();
      this.current = newVal[0].menuTypeName;
    }
  }
};
</script>

<style lang="stylus" >
@import '../../common/styles/market.css';

.cube-scroll-nav-bar .cube-scroll-list-wrapper {
  border-right: 1px solid #fff;
  border-bottom: 1px solid #f8f8f8;
}
// .cube-scroll-nav-panel-title
.cube-scroll-nav-panels {
  padding-bottom: 10px !important;
}

.cube-scroll-nav_side > .cube-sticky > .cube-scroll-wrapper {
  margin-top: -2px;
  background: #fff;
}

.container {
  height: 100%;
  background-color: #f8f8f8;

  .cube-scroll-nav-bar {
    width: 80px;
    background-color: transparent;

    .cube-scroll-wrapper {
      width: 100%;

      .cube-scroll-nav-main {
        padding-bottom: 100px;
      }

      .cube-scroll-nav-bar-item {
        position: relative;
        padding: 13px 0;
        color: #8e8e8e;

        &_active {
          color: #323232;
          background-color: #fff;

          span {
            font-weight: 700;
          }
        }
      }
    }
  }

  .cube-scroll-nav-panel-title {
    // padding: 6px 15px;
    padding: 6px 10px 0;
    line-height: 24px;
    background-color: #fff;
    scw($fontsize-small, #6e6e6e, 600);
  }
}
</style>
