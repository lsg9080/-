<template>
  <div id="app">
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #fff;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  -webkit-overflow-scrolling:touch;
  line-height: 20px;
}
/* 清楚浮动 */
.clearboth{
  clear: both;
}
</style>
