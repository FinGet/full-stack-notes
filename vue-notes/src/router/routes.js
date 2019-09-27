let routes = [
  {
    path: '/form',
    name: 'form',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "form" */ '../views/form.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import(/* webpackChunkName: "cart" */ '../views/cart.vue')
  },
  {
    path: '/router',
    name: 'router',
    component: () => import(/* webpackChunkName: "router" */ '../views/router.vue')
  },
  {
    path: '/router-prop/:id',
    props: true,
    name: 'routerProp',
    component: () => import(/* webpackChunkName: "routerProp" */ '../views/router_prop.vue')
  },
  {
    path: '/name-view',
    name: 'nameView',
    component: () => import(/* webpackChunkName: "nameView" */ '../views/name_view.vue'),
    children: [{
      path: 'view',
      components: {
        default: () => import(/* webpackChunkName: "view" */ '../views/b_view.vue'),
        aView: () => import(/* webpackChunkName: "aView" */ '../views/a_view.vue')
      }
    }]
  },
  {
    path: '/router-guard',
    name: 'routerGuard',
    component: () => import(/* webpackChunkName: "routerGuard" */ '../views/router_guard.vue'),
    beforeEnter: (to, from, next) => {
      if(window.confirm('你将要进入了我的独有守卫，你知道到了吗')) {
        next();
      }
    }
  },
  {
    path: '/vuex',
    name: 'vuex',
    component: () => import(/* webpackChunkName: "vuex" */ '../views/vuex.vue')
  },
]
export default routes