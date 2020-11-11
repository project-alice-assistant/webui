import Vue from 'vue'
import App from './ProjectAlice.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './globalStore'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app')
