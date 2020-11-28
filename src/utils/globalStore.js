import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		settings: {},
		settingTemplates: {},
		settingCategories: {},
		mqtt: null,
		loggedInUser: false,
		fullScreen: false,
		i18n: {},
		uiConnected: false,
		mqttMessage: {}
	},
	mutations: {
		setSettings(state, settings) {
			state.settings = settings
		},
		setSettingTemplates(state, templates) {
			state.settingTemplates = templates
		},
		setSettingCategories(state, categories) {
			state.settingCategories = categories
		},
		setMqtt(state, client) {
			state.mqtt = client
		},
		mqttMessage(state, msg) {
			state.mqttMessage = msg
		},
		userLogin(state, user) {
			state.loggedInUser = user
		},
		userLogout(state) {
			state.loggedInUser = {}
			Vue.$cookies.remove('username')
			Vue.$cookies.remove('apiToken')
		},
		startCinemaMode(state) {
			state.fullScreen = true
		},
		stopCinemaMode(state) {
			state.fullScreen = false
		},
		toggleCinemaMode(state) {
			state.fullScreen = !state.fullScreen
		},
		setI18n(state, obj) {
			state.i18n = obj
		},
		uiConnected(state, connected) {
			state.uiConnected = connected
		}
	}
})
