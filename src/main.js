import Vue from 'vue'
import App from './ProjectAlice.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './utils/globalStore'
import VueToggles from 'vue-toggles'
import VModal from 'vue-js-modal'
import VueTour from 'vue-tour'
import Overlay from 'vuejs-overlay'
import VueDialog from 'vuejs-dialog'
import VueTooltip from 'v-tooltip'
import VueSimpleMarkdown from 'vue-simple-markdown'
import VueI18n from 'vue-i18n'

import Skill from './components/views/skill'
import StoreSkill from './components/views/storeSkill'
import ActionsMenu from './components/views/actionsMenu'
import Tabs from './components/views/tabs'
import ReactiveIcon from './components/views/reactiveIcon'
import Location from './components/views/location'
import Furniture from './components/views/furniture'
import ConfigInput from './components/views/configInput'
import Construction from './components/views/construction'
import Device from './components/views/device'
import Widget from './components/views/widget'
import Notification from './components/views/notification'

import 'vuejs-dialog/dist/vuejs-dialog.min.css'
import 'vue-tour/dist/vue-tour.css'
import 'vue-simple-markdown/dist/vue-simple-markdown.css'
import './ProjectAlice.css'
import './components/css/overrides/vuejsdialog.css'
import './components/css/overrides/vuetour.css'
import './components/css/overrides/tooltips.css'
import './components/css/overrides/overlay.css'
import './components/css/overrides/vue-simple-markdown.css'
import './components/css/overrides/vuemovable.css'

import faIconOption from './components/views/fontawesomePromptDialog'
import widgetOption from './components/views/widgetOptionsDialog'
import skillSettings from './components/views/skillSettingsDialog'
import locationSettings from './components/views/locationOptionsDialog'
import deviceOptions from './components/views/deviceOptionsDialog'
import addDeviceDialog from './components/views/addDeviceDialog'
import deviceReplyListSelect from './components/views/deviceReplyListSelect'
import dialogView from './components/js/dialogView'

import notifyToast from './utils/notifyToast'

Vue.config.productionTip = false

Vue.use(notifyToast)

Vue.use(VueAxios, axios)
Vue.use(VModal)
Vue.use(Overlay)
Vue.use(VueDialog)
Vue.use(VueTour)
Vue.use(VueTooltip)
Vue.use(VueSimpleMarkdown)
Vue.use(VueI18n)

Vue.component('VueToggles', VueToggles)
Vue.component('skill', Skill)
Vue.component('storeSkill', StoreSkill)
Vue.component('actionsMenu', ActionsMenu)
Vue.component('tabs', Tabs)
Vue.component('reactive-icon', ReactiveIcon)
Vue.component('location', Location)
Vue.component('dialogView', dialogView)
Vue.component('furniture', Furniture)
Vue.component('construction', Construction)
Vue.component('device', Device)
Vue.component('configInput', ConfigInput)
Vue.component('widget', Widget)
Vue.component('notification', Notification)

Vue.dialog.registerComponent('fontawesomePromptDialog', faIconOption)
Vue.dialog.registerComponent('widgetOptionsPromptDialog', widgetOption)
Vue.dialog.registerComponent('skillSettingsPromptDialog', skillSettings)
Vue.dialog.registerComponent('locationSettingsPromptDialog', locationSettings)
Vue.dialog.registerComponent('addDevicePromptDialog', addDeviceDialog)
Vue.dialog.registerComponent('deviceOptionsPromptDialog', deviceOptions)
Vue.dialog.registerComponent('deviceReplyListSelect', deviceReplyListSelect)


// Workaround to init v-models
Vue.directive('init', {
	bind(el, binding, vnode) {
		// noinspection JSUnresolvedVariable
		let vModel = vnode.data.directives.find(d => d.rawName === 'v-model')
		if (vModel) {
			vnode.context[vModel.expression] = binding.value
		}
	}
})

const i18n = new VueI18n({
	local: 'en',
	fallbackLocale: 'en',
	messages: {}
})

new Vue({
	store,
	router,
	i18n,
	render: h => h(App)
}).$mount('#app')
