import Vue from 'vue'
import Component from './func-toast.js'

const ToastConstructor = Vue.extend(Component) // 创建一个组件

const instances = [] // 保存多个toast
let seed = 1 // 每个toast一个id ，用以删除

const removeInstance = (instance) => {
	if (!instance) return
	const len = instances.length
	const index = instances.findIndex(inst => instance.id === inst.id)

	instances.splice(index, 1)
	// 调整当前删除的instance上面其他节点所在高度
	// if (len <= 1) return
	// const removeHeight = instance.vm.height
	// for (let i = index; i < len - 1; i++) {
	// 	instances[i].verticalOffset = parseInt(instances[i].verticalOffset - removeHeight - 16)
	// }
	if (len <= 1) return
  const removeHeight = instance.vm.height
  for (let i = index; i < len - 1; i++) {
    instances[i].verticalOffset =
      parseInt(instances[i].verticalOffset) - removeHeight - 16
  }
	
}

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

	const id = `toast_${seed++}`
	instance.id = id
	instance.vm = instance.$mount() // 这样没有指定挂载位置，但会生成一个节点
	document.body.appendChild(instance.vm.$el) // 放到body中
	instance.vm.visible = true // 当节点插入body，将显示

	let verticalOffset = 0 // 默认放在右下角，新增的往上顶

	instances.forEach(item => {
		verticalOffset += item.$el.offsetHeight + 16
	})
	verticalOffset += 16 // 默认比屏幕下面高16
	instance.verticalOffset = verticalOffset
	instances.push(instance)

	// 监听消失动画是否完成，完成后删除节点
	instance.vm.$on('closed', () => {
		removeInstance(instance)
		document.body.removeChild(instance.vm.$el) // 主动删除节点
		instance.vm.$destroy()
	})
	// 监听点击关闭事件
	instance.vm.$on('close', () => {
		instance.vm.visible = false
	})

	return instance.vm
}

export default toast;