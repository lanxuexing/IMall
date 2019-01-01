<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <router-view class="title" name="title"></router-view>
    <router-view class="image" name="image"></router-view>
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
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.title, .image{
  float: left;
  width: 48%;
  border: 1px solid #eee;
  margin-right: 1px;
}
</style>
