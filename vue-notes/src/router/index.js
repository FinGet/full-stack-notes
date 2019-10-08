import Vue from 'vue'
// import Router from '../components/MixRouter'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    ...routes
  ]
})

// 导航守卫

// router.beforeEach((to, from, next) => {
//   // Vue.prototype.$message(`进入导航守卫${to.path} => ${from.path}`);
//   console.log(`将要进入${to.path}`)
//   next();
// })

// router.beforeResolve((to, from, next) => {
//   console.log('router resolve');
//   console.log(`进入${to.path}`)
//   next();
// })

// router.afterEach((to, from) => {
//   console.log(`退出${from.path}`)
//   // Vue.prototype.$message(`离开导航守卫${to.path} => ${from.path}`);
// })



export default router;