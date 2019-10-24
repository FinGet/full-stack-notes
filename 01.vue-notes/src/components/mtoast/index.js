import MToast from './index.vue';
import toast from './function.js';
export default (Vue) => {
	Vue.component(MToast.name, MToast);
	Vue.prototype.$mtoast = toast;
}