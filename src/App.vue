<!--
 * @Author: your name
 * @Date: 2021-03-16 10:49:24
 * @LastEditTime: 2021-03-24 09:51:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project\VUE3\temp\h5-ts\src\App.vue
-->
<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
  </div>
  <router-view />
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 15px;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
