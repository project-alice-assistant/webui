import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		settings: {}
	},
	mutations: {
		setSettings(state, settings) {
			state.settings = settings
		}
	}
})
