 <template>
  <section class="cart_module">
    <transition name="showReduce">
      <span @click.stop="removeOutCart" v-if="foodNum">
        <i class="cubeic-remove icon"></i>
      </span>
    </transition>
    <transition name="fade">
      <span class="cart_num" v-if="foodNum">{{foodNum}}</span>
    </transition>
    <i class="cubeic-add icon" @click.stop="addToCart"></i>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      showMoveDot: [] //控制下落的小圆点显示隐藏
    };
  },
  mounted() {},
  computed: {
    ...mapState(["cartList"]),
    /**
     * 监听cartList变化，更新当前商铺的购物车信息shopCart，同时返回一个新的对象
     */
    shopCart: function() {
      return Object.assign({}, this.cartList[this.shopId]);
    },
    //shopCart变化的时候重新计算当前商品的数量
    foodNum: function() {
      if (this.shopCart && this.shopCart[this.food.id]) {
        return this.shopCart[category_id][food_id].num;
      } else {
        return 0;
      }
    }
  },
  props: ["food", "shopId"],
  methods: {
    ...mapMutations(["ADD_CART", "REDUCE_CART"]),
    //移出购物车
    removeOutCart(event) {
      event.stopPropagation();
      if (this.foodNum > 0) {
        this.$store.commit("REDUCE_CART", this.food);
      }
    },
    //加入购物车，计算按钮位置。
    addToCart(event) {
      event.stopPropagation();
      this.$store.commit("ADD_CART", this.food);
    }
  }
};
</script>

<style scoped>
</style>

