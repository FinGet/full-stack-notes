let Vue;

class HistoryRoute{
  constructor(){
    this.current = null;
  }
}

class Router {
  constructor(options) {
    this.mode = options.mode || 'hash';
    this.routes = options.routes || [];

    this.routesMap = this.createMap(this.routes);
    // console.log(this.routesMap)
    // 路由中需要存放当前的路径 需要状态
    this.history = new HistoryRoute();

    this.init();
  }
  init() {
    if(this.mode === 'hash') {
      // 先判断用户打开时有没有hash，没有就跳到#/
      location.hash?'': location.hash = '/';
      window.addEventListener('load', () => {
        this.history.current = location.hash.slice(1);
      })
      window.addEventListener('hashchange', () => {
        this.history.current = location.hash.slice(1);
      })
    } else {
      location.pathname?'': location.pathname = '/';
      window.addEventListener('load', () => {
        this.history.current = location.pathname;
      })
      window.addEventListener('hashchange', () => {
        this.history.current = location.pathname;
      })
    }
  }

  // 格式化routes
  createMap(routes) {
    return routes.reduce((prev, next) => {
      prev[next.path] = next.component;
      return prev;
    },{})
  }

  go() {

  }
  back() {

  }
  push() {

  }
}
Router.install = (vue) => {
  Vue = vue;
  // 每个组件都有this.$router 和 this.$route
  // 在所有组件中获取同一个路由router实例
  Vue.mixin({
    beforeCreate(){
      if(this.$options && this.$options.router) {
        // this._root = this;
        // this._router = this.options.router;
        this.$router = this.$options.router;
        this.$route = this.$options.router.history.current;
        Vue.util.defineReactive(this,'xxx',this.$router.history)
      } else {
        // this._root = this.$parent._root;
        this.$router = this.$parent && this.$parent.$router;
        this.$route = this.$parent&&this.$parent.$router && this.$parent.$router.history.current;
      }
      // Object.defineProperty(this, '$router', {
      //   get() {
      //     return this._root._router
      //   }
      // })
      // Object.defineProperty(this, '$route', {
      //   get() {
      //       return this._root._router.history.current
      //   }
      // })
    }
    
  })
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true
      },
      tag: {
        type: String,
        default: 'a'
      }
    },
    methods: {
      handleClick(){
        
      }
    },
    render(h) {
      let mode = this.$router.mode;
      let tag = this.tag;
      return <tag on-click={this.handleClick} href={mode==='hash' ? `#${this.to}`: this.to}>{this.$slots.default}</tag>
    }
  })
  Vue.component('router-view', {
    render(h) {
      let current = this.$router.history.current || '/';
      let routesMap = this.$router.routesMap;
      return h(routesMap[current])
    }
  })
}
export default  Router