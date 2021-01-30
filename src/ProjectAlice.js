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
		const self = this
		this.$i18n.locale = 'en'

		if (localStorage.getItem('fullscreen') === 'true') {
			this.$store.commit('startCinemaMode')
		}

		if (localStorage.getItem('minimized') === 'true') {
			this.$store.commit('startMinimized')
		}

		if (process.env.NODE_ENV === 'production') {
			document.addEventListener('contextmenu', function (event) {
				event.preventDefault()
			})
		}

		document.addEventListener('keyup', function (event) {
			if (event.key === 'Enter' || event.key === 'Escape') {
				if (self.$store.state.fullScreen) {
					self.$store.commit('stopCinemaMode')
				}
			}
		})

		if (!this.$store.state.uiConnected) {
			if (this.$router.currentRoute.path !== '/connect') {
				this.$router.replace('/connect').then()
			}
		}
	}
}
