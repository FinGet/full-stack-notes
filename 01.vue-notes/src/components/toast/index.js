import Toast from './index.vue';
import toast from './function.js';
export default (Vue) => {
	Vue.component(Toast.name, Toast);
	Vue.prototype.$toast = toast;
}