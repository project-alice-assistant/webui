import axios from 'axios'

export default {
	name: 'admin',
	data: function() {
		return {
			activeTab: 0,
			tabs: {
				1: {
					'icon': 'fas fa-cogs',
					'id': 1,
					'position': 0
				},
				2: {
					'icon': 'fas fa-tools',
					'id': 2,
					'position': 1
				}
			}
		}
	},
	methods: {
		checkSettingVisibility: function(settingName) {
			if ('parent' in this.$store.state.settingTemplates[settingName]) {
				const parentTemplate = this.$store.state.settingTemplates[settingName]['parent']
				const parentConfig = parentTemplate['config']
				const reqCondition = parentTemplate['condition']
				const reqValue = parentTemplate['value']
				const parentValue = this.$store.state.settings[parentConfig]

				return (reqCondition === 'is' && parentValue === reqValue) || (reqCondition === 'isnot' && parentValue !== reqValue) || (reqCondition === 'isgreater' && parentValue > reqValue) || (reqCondition === 'islower' && parentValue < reqValue);
			} else {
				return true
			}
		},
		save: function(event) {
			let self = this
			event.target['data-success'] = false
			axios({
				method: 'PATCH',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/config/`,
				headers: {
					'auth': localStorage.getItem('apiToken'),
					'content-type': 'application/json'
				},
				data: this.$store.state.settings
			}).then(function () {
				event.target['data-success'] = true
				self.$i18n.locale = self.$store.state.settings['activeLanguage']
			})
		},
		utilityRequestAndRedirect: function(id) {
			const icon = this.startIcon(id)
			const self = this

			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/${id}/`,
				headers: {'auth': localStorage.getItem('apiToken')},
			}).then(function() {
				setTimeout(() =>{
					icon.classList.add('green')
					self.$router.replace('/syslog').then()
				}, 2000)
			}).catch(function() {
				setTimeout(() => {
					icon.classList.add('red')
				}, 2000)
			}).finally(() => {
				setTimeout(() => {
					icon.classList.remove('fa-spin')
					icon.classList.remove('red')
					icon.classList.remove('green')
				}, 4000)
			})
		},
		utilityRequestAndCheck: function(id, state) {
			const icon = this.startIcon(id)
			const self = this

			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/${id}/`,
				headers: {'auth': localStorage.getItem('apiToken')}
			}).then(function() {
				self.checkState(state, icon)
			}).catch(function() {
				setTimeout(() => {
					icon.classList.remove('fa-spin')
					icon.classList.add('red')
				}, 1000)
			})
		},
		utilitySimpleRequest: function(id) {
			const icon = this.startIcon(id)
			const self = this

			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/${id}/`,
				headers: {'auth': localStorage.getItem('apiToken')}
			}).then(response => {
				if ('success' in response.data && response.data['success']) {
					setTimeout(() => {
						icon.classList.remove('fa-spin')
						icon.classList.add('green')
					}, 2000)
				} else {
					icon.classList.add('red')
				}
			}).catch(function() {
				setTimeout(() => {
					icon.classList.remove('fa-spin')
					icon.classList.add('red')
				}, 2000)
			}).finally(() => {
				setTimeout(() => {
					icon.classList.remove('fa-spin')
					icon.classList.remove('red')
					icon.classList.remove('green')
				}, 4000)
			})
		},
		startIcon: function(id) {
			const icon = document.querySelector(`#utility${id.charAt(0).toUpperCase() + id.slice(1)}`)
			icon.classList.add('fa-spin')
			return icon
		},
		checkState: function(state, icon) {
			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/state/${state}/`,
				headers: {'auth': localStorage.getItem('apiToken')}
			}).then(response => {
				if ('state' in response.data) {
					if (response.data['state'] === 4) {
						icon.classList.remove('fa-spin')
						icon.classList.add('green')
						setTimeout(function() {
							icon.classList.remove('green')
						}, 2000)
					} else if (response.data['state'] === 9) {
						icon.classList.remove('fa-spin')
						icon.classList.add('red')
					} else if (response.data['state'] === 1) {
						setTimeout(this.checkState(state, icon), 1000)
					}
				} else {
					setTimeout(this.checkState(state, icon), 1000)
				}
			}).catch(() => {
				icon.classList.remove('fa-spin')
				icon.classList.add('red')
			})
		}
	}
}
