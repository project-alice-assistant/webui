import Vue from 'vue'
import App from './ProjectAlice.vue'

import VueCookies from 'vue-cookies'
import axios from 'axios'
import VueAxios from 'vue-axios';

Vue.config.productionTip = false
Vue.use(VueCookies)
Vue.use(VueAxios, axios)
Vue.$cookies.config('10y')

new Vue({
  render: h => h(App),
}).$mount('#projectalice')
