import Vue from 'vue'
import App from './ProjectAlice.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './utils/globalStore'
import VueCookies from 'vue-cookies'
import VueToggles from 'vue-toggles'
import VModal from 'vue-js-modal'
import VueTour from 'vue-tour'
import Overlay from 'vuejs-overlay'
import VueDialog from 'vuejs-dialog'
import VueTooltip from 'v-tooltip'
import VueDraggableResizable from 'vue-draggable-resizable'
import VueSimpleMarkdown from 'vue-simple-markdown'
import VueI18n from 'vue-i18n'

import Skill from './components/views/skill'
import StoreSkill from './components/views/storeSkill'
import ActionsMenu from './components/views/actionsMenu'
import Tabs from './components/views/tabs'

import 'vuejs-dialog/dist/vuejs-dialog.min.css'
import 'vue-tour/dist/vue-tour.css'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import 'vue-simple-markdown/dist/vue-simple-markdown.css'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueCookies)
Vue.use(VModal)
Vue.use(Overlay)
Vue.use(VueDialog)
Vue.use(VueTour)
Vue.use(VueTooltip)
Vue.use(VueSimpleMarkdown)
Vue.use(VueI18n)

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
import './components/css/overrides/overlay.css'
import './components/css/overrides/vue-simple-markdown.css'

import faIconOption from './components/views/fontawesomePromptDialog'
import widgetOption from './components/views/widgetOptionsDialog'
import skillSettings from './components/views/skillSettingsDialog'
Vue.dialog.registerComponent('fontawesomePromptDialog', faIconOption)
Vue.dialog.registerComponent('widgetOptionsPromptDialog', widgetOption)
Vue.dialog.registerComponent('skillSettingsPromptDialog', skillSettings)

// Jquery use ONLY FOR WIDGETS, DO NOT USE JQUERY FOR __ANYTHING ELSE__
global.jQuery = require('jquery')
const $ = global.jQuery
window.$ = global.jQuery

// Workaround to init v-models
Vue.directive('init', {
	bind(el, binding, vnode) {
		let vModel = vnode.data.directives.find(d => d.rawName === 'v-model')
		if (vModel) {
			vnode.context[vModel.expression] = binding.value
		}
	}
})

const i18n = new VueI18n({
	local: 'en',
	fallbackLocale: 'en',
	silentFallbackWarn: true,
	messages: {}
})
store.commit('setI18n', i18n)
//document.addEventListener('contextmenu', event => event.preventDefault())

new Vue({
	store,
	router,
	i18n,
	render: h => h(App)
}).$mount('#app')
