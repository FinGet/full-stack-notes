import Vue from 'vue'
import Vuex from '../components/MinVuex'
// import Vuex from 'vuex'

// 用插件，会默认调用这个库的install方法
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    a: {
      state: {
        name: 'finget'
      },
      modules: {
        namespaced: true,
        c: {
          state: {
            name: '阿斯顿发手机'
          }
        },
        mutations: {
          changeName(state,payload) {
            state.name = payload;
          }
        }
      }
    },
    b: {
      state: {
        name: 'bios'
      }
    }
  },
  state: {
    count: 1
  },
  getters: {
    count10(state) {
      return state.count + 10
    }
  },
  mutations: {
    addCount(state, payload){
      state.count += payload;
    },
    minuCount(state, payload) {
      state.count -= payload;
    }
  },
  actions: {
    minuCount({commit}, payload) {
      setTimeout(() => {
        commit('minuCount', payload)
      }, 1000)
    }
  }
})
