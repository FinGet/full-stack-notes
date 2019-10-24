<template>
  <div>
    <h2>路由独享守卫</h2>
  </div>
</template>

<script>
  export default {
    beforeRouteEnter(to, from, next) {
      console.log('我是页面中的守卫!');
      next();
    },
    beforeRouteUpdate (to, from, next) {
      // 在当前路由改变，但是该组件被复用时调用
      // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
      // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
      // 可以访问组件实例 `this`
      next();
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      next();
    }
  }
</script>

<style lang="less" scoped>

</style>