import Vue from 'vue'
import App from './ProjectAlice.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './globalStore'
import VueCookies from 'vue-cookies'
import VueToggles from 'vue-toggles'
import VModal from 'vue-js-modal'
import VueTour from 'vue-tour'

import Skill from './components/views/skill'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueCookies)
Vue.use(VModal)

require('vue-tour/dist/vue-tour.css')
Vue.use(VueTour)

Vue.$cookies.config('10y')

Vue.component('VueToggles', VueToggles);
Vue.component('skill', Skill);

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app')
