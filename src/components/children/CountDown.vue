<template>
    <div>
                <van-count-down :time="item" format="mm:ss" />)

    </div>
</template>
<script>
export default {
  props: {
    item: Number
  },
  watch: {
    item(newVal) {
      if (newVal == 0) {
        this.$emit('finish');
      }
    }
  },
  methods: {}
};
</script>

