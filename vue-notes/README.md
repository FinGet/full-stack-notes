
```
vue add router 
vue add element
....
```

## 踩了一个坑

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