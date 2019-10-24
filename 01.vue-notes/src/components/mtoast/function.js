import Vue from 'vue'
import Component from './index.vue'

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
	console.log(instance)
	// console.log(instance.$mount())
	instance.vm = instance.$mount() // 这样没有指定挂载位置，但会生成一个节点(vue实例)
	document.body.appendChild(instance.vm.$el) // 放到body中


	// 监听点击关闭事件
	instance.vm.$on('close', () => {
		instance.vm.visible = false
	})
}
export default toast