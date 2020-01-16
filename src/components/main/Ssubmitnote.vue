<template>
  <div>
    <van-cell-group class="ssn_textarea">
      <van-field
        v-model="message"
        rows="10"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入50个汉字以内的备注"
        show-word-limit
      />
    </van-cell-group>
    <button class="ssn_btn" @click="confirm">确定</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ""
    };
  },
  
  methods: {
    confirm() {
      this.$store.commit("CONFIRM_REMARK",this.message)
      this.$router.go(-1)
    }
  }
  
};
</script>

<style scoped>
.ssn_textarea {
  margin-top: 18px;
  width: calc(100% - 38px);
  margin-left: 18px;
  border: 1px solid #efefef;
}
 .van-field__control{
  height: 40vh !important;

 }
.ssn_btn {
  margin-top: 18px;
  width: calc(100% - 38px);
  background: #7da6d4;
  color: #fff;
  height: 38px;
  margin-left: 18px;
  border: none;
  outline: none;
  border-radius: 5px;
}
</style>
