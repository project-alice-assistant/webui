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
		utilityRestart: function() {
			const icon = document.querySelector('#utilityRestart')
			icon.classList.add('fa-spin')
			const self = this
			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/restart/`,
				headers: {'auth': this.$store.state.loggedInUser['token']},
			}).then(function() {
				setTimeout(() =>{
					icon.classList.add('green')
					self.$router.replace('/syslog').then()
				}, 1000)
			}).catch(function() {
				setTimeout(() => {
					icon.classList.add('red')
				}, 1000)
			}).finally(() => {
				setTimeout(() => {
					icon.classList.remove('fa-spin')
					icon.classList.remove('red')
					icon.classList.remove('green')
				}, 2000)
			})
		},
		utilityReboot: function() {
			const icon = document.querySelector('#utilityReboot')
			icon.classList.add('fa-spin')
			const self = this
			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/reboot/`,
				headers: {'auth': this.$store.state.loggedInUser['token']}
			}).then(function() {
				setTimeout(() =>{
					icon.classList.add('green')
					self.$router.replace('/syslog').then()
				}, 1000)
			}).catch(function() {
				setTimeout(() => {
					icon.classList.add('red')
				}, 1000)
			}).finally(() => {
				setTimeout(() => {
					icon.classList.remove('fa-spin')
					icon.classList.remove('red')
					icon.classList.remove('green')
				}, 2000)
			})
		},
		utilityUpdate: function() {
			const icon = document.querySelector('#utilityUpdate')
			icon.classList.add('fa-spin')
			const self = this

			const check = setTimeout(function() {
				if (self.checkState('projectalice.core.updating') !== 4) {
					self.check()
				} else {
					icon.classList.remove('fa-spin')
					icon.classList.add('green')
				}
			}, 1000)

			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/updateAlice/`,
				headers: {'auth': this.$store.state.loggedInUser['token']}
			}).then(function() {
				self.check()
			}).catch(function() {
				setTimeout(() => {
					icon.classList.remove('fa-spin')
					icon.classList.add('red')
				}, 1000)
			})
		},
		checkState: function(state) {
			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/state/${state}/`,
				headers: {'auth': this.$store.state.loggedInUser['token']}
			}).then(response => {
				if ('state' in response.data) {
					return response.data['state']
				} else {
					return false
				}
			}).catch(() => {
				return false
			})
		}
	}
}
