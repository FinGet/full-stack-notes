
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
