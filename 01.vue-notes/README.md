
```
vue add router 
vue add element
....
```

## Vue核心

### 组件递归调用，内存溢出
```import name from 'xxxx'```

> `name` 就是组件的`name`,如果定义了`name`,要注意父级`name`和子级`name`是否重复,导致递归调用,内存溢出

## 骚操作

```html
<f-input type="text" :value="value" @input="value = arguments[0]"></f-input>
```

子组件派发了`input`事件，传了一个值回来，父组件监听这个事件，并赋值操作。

## provide & inject

```javascript
// 把整个父级实例，传递给子级
provide() {
  return {
    // rules: this.rules
    formBox: this
  }
}
```

## 表单验证


在 `input` 组件中，当`input`时，让`formitem`($parent)派发一个`validate`方法，然后再`mounted`时，自己监听。

```javascript
// input.vue
onInput(e) {
  let value = e.target.value;
  this.$emit("input", value);
  this.$parent.$emit('validate',value)
}
```

```javascript
// formitem.vue
mounted() {
  this.$on('validate', this.validator)
}
```

这样子存在最大的弊端是，如果input再嵌套一层父级，这个方法就挂了。

**elementui的处理方式：**

```javascript
// input
this.dispatch('ElFormItem', 'el.form.blur', [this.value]);
```

```javascript
// form-item
this.$on('el.form.blur', this.onFieldBlur);
```

它们自己实现了一个`dispatch`方法:

```javascript
// 定义 dispatch 方法，接受三个参数，分别是：组件名称、将要触发的事件名称、回调函数传递的参数
dispatch(componentName, eventName, params) {
  // 获取基于当前组件的父组件实例，这里对父组件实例和根组件实例做了兼容处理
  var parent = this.$parent || this.$root;
  
  // 通过父组件的 $option 属性获取组件的名称
  var name = parent.$options.componentName;

  // 当相对当前组件的父组件实例存在，而且当父组件的名称不存在或者父组件的名称不等于传入的组件名称时，执行循环
  while (parent && (!name || name !== componentName)) {
    // 记录父组件的父组件
    parent = parent.$parent;

    // 当父组件的父组件存在时，获取祖父组件的名称
    if (parent) {
      name = parent.$options.componentName;
    }
  }
  
  // 当循环结束是，parent 的值就是最终匹配的组件实例
  if (parent) {
    // 当 parent 值存在时调用 $emit 方法
    // 传入 parent 实例、事件名称与 params 参数组成的数组
    // 触发传入事件名称 eventName 同名的事件
    parent.$emit.apply(parent, [eventName].concat(params));
  }
}
```

## 通过props获取动态路由参数

```html
<div>
  这是路由上的params的id：{{id}}, 通过props接收。

  <pre class="border">
    {
      path: '/router-prop/:id',
      <b class="red">props: true,</b>
      name: 'routerProp',
      component: () => import(/* webpackChunkName: "router" */ '../views/router_prop.vue')
    }

    --------

    export default {
      props:['id']
    }
  </pre>
</div>
```

## Vuex原理

![](https://vuex.vuejs.org/vuex.png)

### 全局mixins

这里就体现出来了，vuex就是一个全局变量。在组件初始化的时候，把$store挂载到每一个组件实例上。

```javascript
Vue.mixin({
  beforeCreate() {
    // console.log('每一个组件都会执行');
    // 需要先判别是父组件还是自组件，如果是子组件 应该把父组件的store增加给子组件
    
    // 首先 store 作为 Vue 实例的一个 option 被注入到根部组件，
    // 而后所有的子组件都从其父组件的 options 中去寻找这个 store 属性，
    // 这样层层传递下去，所有的组件就都可以通过 this.$store 来访问全局的 store 了。
    
    if(this.$options && this.$options.store) {
      this.$store = this.$options.store
    } else {
      this.$store = this.$parent && this.$parent.$store;
    }
  }
})
```

### state的双向绑定

为啥要实现这个，因为getters需要发布订阅实时监听state的变化，所以可以直接通过`this.$store.state.count = 10`,但是官方不推荐这样使用。

```javascript
// 方式一
// this._state = options.state;
// 方式二
// this._state = new Vue({
//   data: {
//     state: options.state
//   }
// })
// 方式三 推荐 vue2.6.x出的新语法
this._state = Vue.observable({
  state: options.state
});
```

### getters

```javascript
let getters = options.getters || {};
  this.getters = {};

  // 把getters属性定义到 this.getters中,并且根据状态的变化 重新执行此函数
  forEach(getters, (propName) => {
    Object.defineProperty(this.getters, propName, {
      get: () => {
        return getters[propName](this.state);
      }
    })
  })
```

### mustations 和 actions

```javascript
let mutations = options.mutations || {};
this.mutations = {};

forEach(mutations, (propName, val) => {
  this.mutations[propName] = (payload) => {
    val(this.state, payload)
  }
})

let actions = options.actions || {};
this.actions = {};

forEach(actions, (propName, val) => {
  this.actions[propName] = (payload) => {
    val(this, payload)
  }
})

commit(type, payload) {
  this.mutations[type](payload);
}
dispatch(type, payload) {
  this.actions[type](payload)
}
```

### this绑定的问题

- 方式一 手动绑定this，在实例上新增方法（骚操作）
```javascript
// bind commit and dispatch to self
/*将dispatch与commit调用的this绑定为store对象本身，
否则在组件内部this.dispatch时的this会指向组件的vm*/
// 先调用实例上的方法，找不到才会去原型上查找

const store = this
const { dispatch, commit } = this
/* 为dispatch与commit绑定this（Store实例本身） */
this.dispatch = function boundDispatch (type, payload) {
  return dispatch.call(store, type, payload)
}
this.commit = function boundCommit (type, payload) {
  return commit.call(store, type, payload)
}
```

- 方式二 箭头函数
```javascript
commit = (type, payload) => {
  this.mutations[type](payload);
}
dispatch = (type, payload) => {
  this.actions[type](payload)
}
```

## vue-router

和 vuex很像，是一开始就在各个组件上挂载一个`$router`和`$route`。

三种模式：

- history   history Api
- hash      hash值
- abstract  用在服务端

### hash原理

```html
<a href="#home">首页</a>
<a href="#about">关于</a>
<div id="html"></div>
```
```javascript
 // hash 原理
window.addEventListener('load', function(){
  html.innerHTML = location.hash.slice(1)
})
window.addEventListener('hashchange', function() {
  html.innerHTML = location.hash.slice(1)
})
```

### history原理

History interface是浏览器历史记录栈提供的接口，通过back(),forward(),go()等方法，我们可以读取浏览器历史记录栈的信息，进行各种跳转操作。

HTML5引入了history.pushState()和history.replaceState()方法，他们分别可以添加和修改历史记录条目。

```javascript
window.history.pushState(stateObject,title,url)
window.history,replaceState(stateObject,title,url)
```

- stateObject:当浏览器跳转到新的状态时，将触发popState事件，该事件将携带这个stateObject参数的副本
- title:所添加记录的标题
- url:所添加记录的url(可选的)

```html
<a onclick="go('/home')">首页</a>
<a onclick="go('/about')">关于</a>
<div id="html"></div>
```

```javascript
function go(pathname){
  history.pushState({},null,pathname)
  html.innerHTML = pathname;
}
window.addEventListener('popstate',() => {
  go(location.pathname);
})
```

### router-link

```javascript
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
```

### router-view

根据路由生成一个路由表`（key-value）`，`key`表示当前路由，`value`表示对应的组件。
通过`h`函数渲染组件。

```javascript
Vue.component('router-view', {
  render(h) {
    let current = this.$router.history.current || '/';
    let routesMap = this.$router.routesMap;
    return h(routesMap[current])
  }
})
```

## Vue工作机制

### 初始化

在 new Vue()之后。Vue会调用进行初始化，会初始化`生命周期`、`事件`、`props`、`methods`、`data`、`computed`与`watch`等。其中最重要的是通过`Object.defineProperty`设置`setter`与`getter`，用来实现「**响应式**」以及「**依赖收集**」。
初始化之后调用$mount挂载组件。
![](http://pz1uhohzm.bkt.clouddn.com/13128B24-5ABD-47BE-89F7-6ED696088F4A.png)


[这里实现了一个简化版的MVVM-Vue。](https://github.com/FinGet/MVVM)
 
## Vue实战技巧和坑

[更多实战整理。](https://www.zybuluo.com/Bios/note/880207)


### 路由拦截以及回跳

```javascript
...
routes: [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {auth: true}
  },
]
...

router.beforeEach((to, from, next) => {
  if(to.meta.auth) {
    const token = localStorage.getItem('token');

    if(token){
      next()
    } else {
      // 没有登录跳到登录页，登录之后，直接跳转到to.path
      next({
        path: '/login',
        query: {redirect: to.path}
      })
    }
  } else {
    next()
  }
})
```

### 请求拦截

```javascript
// 用于拦截请求和响应
const axios = require('axios')

export default function(vm){
  // 设置请求拦截器
  axios.interceptors.request.use(config => {
      // 获取token
      const token = localStorage.getItem('token')
      if (token) { // 如果存在令牌这添加token请求头
          config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
  })

  // 响应拦截器
  // 参数1表示成功响应
  // 这里只关心失败响应
  axios.interceptors.response.use(null, err => {
    if (err.response.status === 401) { // 没有登录或者令牌过期
      // 清空vuex和localstorage
      vm.$store.dispatch("logout");
      // 跳转login
      vm.$router.push("/login");
    }
    return Promise.reject(err);
  });
}
```

### JWT（JSON web Token）

```javascript
const Koa = require("koa");
const Router = require("koa-router");
// 生成令牌、验证令牌
const jwt = require("jsonwebtoken");
const jwtAuth = require("koa-jwt");

// 生成数字签名的秘钥
const secret = "it's a secret";

const app = new Koa();
const router = new Router();

router.get("/api/login", async ctx => {
  const { username, passwd } = ctx.query;
  console.log(username, passwd);

  if (username == "kaikeba" && passwd == "123") {
    // 生成令牌
    const token = jwt.sign(
      {
        data: { name: "kaikeba" }, // 用户信息数据
        exp: Math.floor(Date.now() / 1000) + 60 * 60 // 过期时间
      },
      secret
    );
    ctx.body = { code: 1, token };
  } else {
    ctx.status = 401;
    ctx.body = { code: 0, message: "用户名或者密码错误" };
  }
});

router.get(
  "/api/userinfo",
  jwtAuth({ secret }),
  async ctx => {
    ctx.body = { code: 1, data: { name: "jerry", age: 20 } };
  }
);
app.use(router.routes());
app.listen(3000);
```


### 开发一个api方式调用的组件

```javascript
export default (Vue) => {
	Vue.component(MToast.name, MToast);
	Vue.prototype.$mtoast = toast;
}
```
1. 先写好一个vue组件
2. 新建一个js文件作为api
3. 在这个js文件中`extend`一个该组件，并新建一个组件实例
4. 将该实例挂载到`body`中
```javascript
const ToastConstructor = Vue.extend(Component) // 创建一个组件
const toast = (options) => {
  const { 
		autoClose, // autoClose 不是props， 所以要单独处理
		...rest
	} = options
	const instance = new ToastConstructor({
		propsData: {
			...rest
		},
		data: {
			autoClose: autoClose === undefined ? 3000 : autoClose // 没有传就设置默认3000
		}
  })
  
  instance.vm = instance.$mount() // 这样没有指定挂载位置，但会生成一个节点(vue实例)
  document.body.appendChild(instance.vm.$el) // 放到body中
}
```