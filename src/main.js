import Vue from 'vue'
import App from './App'
import router from './router'
import Router from 'vue-router';

Vue.config.productionTip = false
Vue.use(Router)

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	template: '<App/>',
	watch: {
		$route: {
			immediate: true,
			handler(to, from) {
				document.title = to.meta.title !== undefined ? `Project Alice - ${to.meta.title}` : 'Project Alice - Home'
			}
		}
	}
})
