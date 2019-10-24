import Vue from 'vue';
import Router from 'vue-router';
import Todo from './views/todo.vue';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'todo',
			component: Todo,
		},
		{
			path: '/show',
			name: 'show',
			component: () => import(/* webpackChunkName: "show" */ './views/show.vue'),
		},
	],
});
