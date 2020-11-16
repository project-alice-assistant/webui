import axios from 'axios'

export default {
	name: 'pa-widgets',
	data: function() {
		return {
			tabs: [],
			menuItems: [
				{
					name: 'edit',
					icon: 'fas fa-pen-square',
					isToggle: true,
					extendedIcon: 'fas fa-times-circle'
				},
				{
					name: 'theater mode',
					icon: 'fas fa-person-booth',
					isToggle: true,
					callback: this.cinemaMode
				},
				{
					name: 'settings',
					icon: 'fas fa-cog'
				},
				{
					name: 'add widget',
					icon: 'far fa-plus-square'
				},
				{
					name: 'remove widget',
					icon: 'far fa-minus-square'
				},
				{
					name: 'save',
					icon: 'fas fa-save',
					callback: this.saveAndClose
				}
			]
		}
	},
	created: function() {
		let self = this;
		document.addEventListener('keypress', function(event) {
			if (event.key === 'Enter') {
				self.$store.commit('stopCinemaMode')
			}
		})

		axios({
			method: 'get',
			url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/pages/`,
			headers: {'auth': this.$cookies.get('apiToken')}
		}).then(response => {
			if ('pages' in response.data) {
				for (const page of Object.values(response.data.pages)) {
					this.tabs.push(JSON.parse(page))
				}
			}
		})
	},
	methods: {
		saveAndClose: function() {
			console.log('saved')
		},
		cinemaMode: function() {
			this.$store.commit('toggleCinemaMode')
		}
	}
}
