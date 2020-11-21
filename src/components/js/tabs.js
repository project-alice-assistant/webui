import axios from 'axios'

export default {
	name: 'tabs',
	data: function() {
		return {
			activeTab: 0,
			adding: false
		}
	},
	props: [
		'tabs',
		'onChange'
	],
	methods: {
		handleClick: function(position, id) {
			this.activeTab = position
			this.activeTabId = id

			if (this.onChange) {
				this.onChange(id)
			}
		},
		addTab: function() {
			this.adding = true
			axios({
				method: 'PUT',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/addPage/`,
				headers: {'auth': this.$cookies.get('apiToken')}
			}).then(response => {
				if ('newpage' in response.data) {
					let page = response.data.newpage
					this.tabs[page.id] = page
				}
			}).finally(() => {
				this.adding = false
			})
		},
		removeTab: function(id) {
			if (!this.$store.state.loggedInUser) {
				return
			}
			let self = this
			if (id <= 1) {
				this.$dialog.alert('You can\'t delete the default page').then()
			} else {
				this.$dialog.confirm('Do you really want to delete this page?')
					.then(function() {
						axios({
							method: 'DELETE',
							url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/widgets/pages/${id}/`,
							headers: {'auth': self.$cookies.get('apiToken')}
						}).then(response => {
							if ('pages' in response.data) {
								delete self.tabs[id]
								self.$forceUpdate()
							}
						})
					}).catch(() => {})
			}
		},
		rename: function(id) {
			if (!this.$store.state.loggedInUser) {
				return
			}

			let self = this

			const message = {}
			const options = {
				view: 'fontawesomePromptDialog'
			}

			this.$dialog.prompt(message, options).then(dialogue => {
				let icon = dialogue.data || 'fas fa-biohazard'
				axios({
					method: 'PATCH',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/widgets/pages/${id}/`,
					data: {newIcon: icon},
					headers: {'auth': self.$cookies.get('apiToken')}
				}).then(response => {
					if ('success' in response.data && response.data.success) {
						this.tabs[id].icon = icon
						this.$forceUpdate()
					}
				})
			}).catch(() =>{})
		}
	}
}
