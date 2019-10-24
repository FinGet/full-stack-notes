<template>
  <div>
    这是路由上的params的id：{{id}}, 通过props接收。
    <br>
    $route.params.id: {{$route.params.id}}
    <pre class="border">
      {
        path: '/router-prop/:id',
        <b class="red">props: true,</b>
        name: 'routerProp',
        component: () => import(/* webpackChunkName: "router" */ '../views/router_prop.vue')
      }

      --------

      export default {
        <b class="red">props:['id']</b>
      }
    </pre>
  </div>
</template>

<script>
  export default {
    props:['id']
  }
</script>

<style lang="less" scoped>

</style>