import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		settings: {},
		mqtt: null,
		resourceUsage: {}
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
		}
	}
})
