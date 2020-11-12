import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		settings: {},
		mqtt: null,
		resourceUsage: {},
		loggedInUser: false
	},
	mutations: {
		setSettings(state, settings) {
			state.settings = settings
		},
		setMqtt(state, client) {
			state.mqtt = client
		},
		setResourceUsage(state, usage) {
			state.resourceUsage = usage
		},
		userLogin(state, user) {
			state.loggedInUser = user
		},
		userLogOut(state) {
			state.loggedInUser = {}
		}
	}
})
