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
		this.$i18n.locale = 'en'

		if (localStorage.getItem('fullscreen') === 'true') {
			this.$store.commit('startCinemaMode')
		}

		if (localStorage.getItem('minimized') === 'true') {
			this.$store.commit('startMinimized')
		}

		if (!this.$store.state.uiConnected) {
			if (this.$router.currentRoute.path !== '/connect') {
				this.$router.replace('/connect').then()
			}
		}
	}
}
