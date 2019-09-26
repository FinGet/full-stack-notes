<template>
  <div>
    <div id="nav">
      <router-link to="/form">form表单</router-link> |
      <router-link to="/cart">购物车</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="less" scoped>
  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style>