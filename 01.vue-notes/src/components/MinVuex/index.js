let Vue; // Vue的构造函数

const forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(key, obj[key])
  })
}
// 收集模块
class ModuleCollection{
  constructor(options) {
    this.register([], options)
  }
  register(path, rootModule) {
    let newModule = {
      _raw: rootModule,
      _children: {},
      state: rootModule.state
    }

    if(path.length === 0) {
      this.root = newModule;
    } else {
      let parent = path.slice(0, -1).reduce((root,current) => {
        return this.root._children[current]
      }, this.root)
      parent._children[path[path.length-1]] = newModule;
    }
    if(rootModule.modules) {
      forEach(rootModule.modules, (moduleName, module) => {
        this.register(path.concat(moduleName), module);
      })
    }
  }
}
// 递归数，将结果挂载到getters mutations actions
const installModule = (store,state,path,rootModule) => {
  let getters = rootModule._raw.getters;
  let mutations = rootModule._raw.mutations;
  let actions = rootModule._raw.actions;

  if(path.length > 0) { // 把子模块的状态，放到父模块上
    let parent = path.slice(0, -1).reduce((state, current) => {
      return state[current]
    }, state);
    Vue.set(parent, path[path.length-1],rootModule.state);
  }

  if(getters) {
    forEach(getters, (getterName, fn) => {
      Object.defineProperty(store.getters, getterName, {
        get: () => {
          return fn(rootModule.state)
        }
      })
    })
  }

  if(mutations) {
    forEach(mutations, (mutationName, fn) => {
      let mutationsArr = store.mutations[mutationName] || (store.mutations[mutationName] = []);
      mutationsArr.push((payload) => {
        fn(rootModule.state,payload);
      })
    })
  }
  if(actions) {
    forEach(actions, (actionName, fn) => {
      let actionsArr = store.actions[actionName] || (store.actions[actionName] = []);
      actionsArr.push((payload) => {
        fn(store,payload);
      })
    })
  }

  forEach(rootModule._children, (moduleName, module) => {
    installModule(store, state, path.concat(moduleName), module);
  })
}
class Store {
  constructor(options) {
    // 方式一
    // this._state = options.state;
    // 方式二
    this._state = new Vue({
      data: {
        state: options.state
      }
    })
    // // 方式三 推荐
    // this._state = Vue.observable({
    //   state: options.state
    // });


    // let getters = options.getters || {};
    // this.getters = {};

    // // 把getters属性定义到 this.getters中,并且根据状态的变化 重新执行此函数
    // forEach(getters, (propName) => {
    //   Object.defineProperty(this.getters, propName, {
    //     get: () => {
    //       return getters[propName](this.state);
    //     }
    //   })
    // })

    // let mutations = options.mutations || {};
    // this.mutations = {};

    // forEach(mutations, (propName, val) => {
    //   this.mutations[propName] = (payload) => {
    //     val(this.state, payload)
    //   }
    // })

    // let actions = options.actions || {};
    // this.actions = {};

    // forEach(actions, (propName, val) => {
    //   this.actions[propName] = (payload) => {
    //     val(this, payload)
    //   }
    // })

    // 源码中解决异步更新 this绑定的方法
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

    // modules
    // 需要先格式化一下当前用户传递来的数据

    /*
    let root = {
      _raw: rootModule,
      state: rootModule.state,
      _children: {
        a: {
          _raw: aModule,
          state: aModule.state
          _children: {}
        },
        ...
      }
    }
    */

    this.getters = {};
    this.mutations = {};
    this.actions = {};


    // 收集所有模块
    this.modules = new ModuleCollection(options);
    // console.log(this.modules)
    installModule(this, this.state,[],this.modules.root);

  }

  // 当异步更新state，最大的问题就是this的指向
  // 可以在这里用箭头函数，commit 和 dispatch的this就始终指向stroe实例
  commit(type, payload) {
    this.mutations[type].forEach(fn => fn(payload));
  }
  dispatch(type, payload) {
    this.actions[type].forEach(fn => fn(payload));
  }
  get state() { // 只读属性
    return this._state.state;
  }
  set state (v) {
    alert(false, `Use store.replaceState() to explicit replace store state.`)
  }
}

// vue的组件渲染 先渲染父组件 再渲染子组件 深度优先
const install = (_Vue) => {
  Vue = _Vue;// 这样赋值，就不用再单独import vue了

  // 需要给每个组件都注册一个this.$store的属性
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
}

export default {
  install,
  Store
}