import Vue from 'vue'
import App from './App'
import router from './router'
import Router from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
Vue.use(Router)
Vue.use(VueAxios, axios)


/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	data() {
		return {
			settings: {}
		}
	},
	created() {
		this.fetchInitialData()
	},
	template: '<App/>',
	watch: {
		$route: {
			immediate: true,
			handler(to, from) {
				document.title = to.meta.title !== undefined ? `Project Alice - ${to.meta.title}` : 'Project Alice - Home'
			}
		}
	},
	methods: {
		fetchInitialData() {
			this.$root.settings = {}
			axios.get('http://192.168.1.168:5001/api/v1.0.1/utils/config/')
				.then(response => (this.$root.settings = response.data.config))
				.catch(reason => (console.log('Error connecting to Alice ' + reason)))
		}
	}
})
