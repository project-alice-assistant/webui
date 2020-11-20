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
import Overlay from 'vuejs-overlay'
import VueDialog from 'vuejs-dialog'
import VueTooltip from 'v-tooltip'
import VueDraggableResizable from 'vue-draggable-resizable'

import Skill from './components/views/skill'
import StoreSkill from './components/views/storeSkill'
import ActionsMenu from './components/views/actionsMenu'
import Tabs from './components/views/tabs'

import 'vuejs-dialog/dist/vuejs-dialog.min.css'
import './components/css/overlay.css'
import 'vue-tour/dist/vue-tour.css'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueCookies)
Vue.use(VModal)
Vue.use(Overlay)
Vue.use(VueDialog)
Vue.use(VueTour)
Vue.use(VueTooltip)

Vue.$cookies.config('10y')

Vue.component('VueToggles', VueToggles)
Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.component('skill', Skill)
Vue.component('storeSkill', StoreSkill)
Vue.component('actionsMenu', ActionsMenu)
Vue.component('tabs', Tabs)

import './ProjectAlice.css'
import './components/css/overrides/vuejsdialog.css'
import './components/css/overrides/vuetour.css'
import './components/css/overrides/tooltips.css'

import CustomView from './components/views/fontawesomePromptDialog'
Vue.dialog.registerComponent('fontawesomePromptDialog', CustomView)

// Jquery use ONLY FOR WIDGETS, DO NOT USE JQUERY FOR __ANYTHING ELSE__
global.jQuery = require('jquery')
const $ = global.jQuery
window.$ = global.jQuery

//document.addEventListener('contextmenu', event => event.preventDefault())

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app')
