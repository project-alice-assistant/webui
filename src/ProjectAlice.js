import paMain from './components/views/main'
import paConnect from './components/views/connect'

// noinspection JSUnusedGlobalSymbols
export default {
	name: 'ProjectAlice',
	components: {
		paMain,
		paConnect
	},
	mounted: function() {
		if (localStorage.getItem('fullscreen') === true) {
			this.$store.commit('startCinemaMode')
		}

		if (!this.$store.state.uiConnected) {
			if (this.$router.currentRoute.path !== '/connect') {
				this.$router.replace('/connect').then()
			}
		}
	}
}
