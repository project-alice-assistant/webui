import axios from 'axios'

export default {
	name: 'tabs',
	data: function() {
		return {
			activeTab: 0,
			myTabs: this.tabs,
			adding: false
		}
	},
	props: [
		'tabs',
		'onChange'
	],
	created() {
	},
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
					this.tabs.push(JSON.parse(response.data.newpage))
				}
			}).finally(() => {
				this.adding = false
			})
		},
		removeTab: function(id) {
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
								self.myTabs = []
								for (const page of Object.values(response.data.pages)) {
									self.myTabs.push(JSON.parse(page))
								}
							}
						})
					}).catch(() => {})
			}
		},
		rename: function(id) {
			let self = this
			this.$dialog.prompt({
				title: 'New icon',
				body: 'Please enter the new fontawesome icon, including the prefix'
			}, {
				promptHelp: 'Example: fas fa-biohazard'
			}).then(dialog => {
				for (const page of this.myTabs) {
					if (page.id === id) {
						page.icon = dialog.data || 'fas fa-biohazard'
					}
				}

				if (dialog.data.length > 0 && dialog.data !== 'fas fa-biohazard') {
					axios({
						method: 'PATCH',
						url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/widgets/pages/${id}/`,
						data: {newIcon: dialog.data},
						headers: {'auth': self.$cookies.get('apiToken')}
					}).then()
				}
			})
		}
	}
}
