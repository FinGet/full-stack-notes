<template>
  <div>
    <h2>MinVuex</h2>
    <p>state: {{this.$store.state.count}}</p>
    <p>getter: {{this.$store.getters.count10}}</p>
    <button @click="addCount">增加count</button>
    <button @click="minuCount">减少count</button>
  </div>
</template>

<script>
  export default {
    mounted() {
      console.log(this.$store)
      setTimeout(() => {
        this.$store.state.count = 100;
      },1000)
    },
    methods: {
      addCount() {
        this.$store.commit('addCount', 10);
      },
      minuCount(){
        this.$store.dispatch('minuCount', 1);
      }
    }
  }
</script>

<style lang="less" scoped>

</style>