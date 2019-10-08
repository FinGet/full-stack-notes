<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  mounted() {
    console.log(this.$router)
    // console.log(this.$route)
  }
}
</script>

<style>
</style>
