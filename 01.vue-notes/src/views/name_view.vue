<template>
  <div>
    <h2>这里是命名视图的父级页面！</h2> 
    <router-view></router-view>
    <router-view name="aView"></router-view>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="less" scoped>

</style>