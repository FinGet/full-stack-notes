import Toast from './index.vue';

export default {
	extends: Toast,
	computed: {
		// 在这里申明style 来覆盖模板里面的
		style () {
			return {
				position: 'fixed',
				right: '20px',
				bottom: `${this.verticalOffset}px`
			}
		}
	},
	mounted () {
		this.createTimer()
	},
	data () {
		return {
			verticalOffset: 0,
			autoClose: 3000,
			height: 0,
			visible: false
		}
	},
	methods: {
		createTimer () {
			// 这里并没有删除节点
			if (this.autoClose) {
				this.timer = setTimeout(() => {
					this.visible = false
				},this.autoClose)
			}
		},
		clearTimer () {
			if (this.timer) {
				clearTimeout(this.timer)
			}
		},
		// 只有当进入动画结束后 才能拿到它的实际高度
		afterEnter () {
			this.height = this.$el.offsetHeight
		}
	},
	beforeDestory () {
		this.clearTimer()
	}
}

