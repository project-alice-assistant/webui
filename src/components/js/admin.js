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
		save: function() {
			const savers = document.querySelectorAll('.fa-save')
			for (const saver of savers) {
				saver.classList = 'fas fa-spinner fa-spin'
			}
			axios({
				method: 'PATCH',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/config/`,
				headers: {
					'auth': this.$store.state.loggedInUser['token'],
					'content-type': 'application/json'
				},
				data: this.$store.state.settings
			}).then(function() {
				setTimeout(function(){
					for (const saver of savers) {
						saver.classList = 'fas fa-check'
					}
				}, 500)
			}).catch(function() {
				setTimeout(function(){
					for (const saver of savers) {
						saver.classList = 'fas fa-times'
					}
				}, 500)
			}).finally(
				setTimeout(function(){
					for (const saver of savers) {
						saver.classList = 'far fa-save clickable'
					}
				}, 1500)
			)
		},
		displayOrHide: function(settingName, settingTemplate) {
			if (settingTemplate.hasOwnProperty('parent')) {
				const condition = settingTemplate['parent']['condition']
				const reqConfig = settingTemplate['parent']['config']
				const reqValue = settingTemplate['parent']['value']

				if (!this.$store.state.settings.hasOwnProperty(reqConfig)) {
					document.querySelector(`input_${settingName}`).classList.add('initialHidden')
					document.querySelector(`label_${settingName}`).classList.add('initialHidden')
				}

				const parentValue = this.$store.state.settings['reqConfig']

				if ((condition === 'is' && parentValue === reqValue) ||
					(condition === 'isnot' && parentValue !== reqValue) ||
					(condition === 'isgreater' && parentValue > reqValue) ||
					(condition === 'islower' && parentValue < reqValue)) {
					document.querySelector(`input_${settingName}`).classList.remove('initialHidden')
					document.querySelector(`label_${settingName}`).classList.remove('initialHidden')
				} else {
					document.querySelector(`input_${settingName}`).classList.add('initialHidden')
					document.querySelector(`label_${settingName}`).classList.add('initialHidden')
				}
			}
		},
		utilityRequestAndRedirect: function(id) {
			const icon = this.startIcon(id)
			const self = this

			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/${id}/`,
				headers: {'auth': this.$store.state.loggedInUser['token']},
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
				headers: {'auth': this.$store.state.loggedInUser['token']}
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
				headers: {'auth': this.$store.state.loggedInUser['token']}
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
				headers: {'auth': this.$store.state.loggedInUser['token']}
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
