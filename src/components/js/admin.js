import axios from 'axios'

export default {
	name:    'admin',
	data:    function () {
		return {
			activeTabId: 1,
			tabs:        {
				1: {
					'icon':     'fas fa-cogs',
					'id':       1,
					'position': 0
				},
				2: {
					'icon':     'fas fa-tools',
					'id':       2,
					'position': 1
				}
			},
			actions:     {
				'save': {'action': this.save}
			}
		}
	},
	methods: {
		save:                      function (event) {
			let self = this
			event.target['data-success'] = false
			axios({
				method:  'PATCH',
				url:     `/utils/config/`,
				headers: {
					'auth':         this.$store.getters.apiToken,
					'content-type': 'application/json'
				},
				data:    this.$store.state.settings
			}).then(function () {
				event.target['data-success'] = true
				self.$i18n.locale = self.$store.state.settings['activeLanguage']
			})
		},
		utilityRequestAndRedirect: function (id) {
			const icon = this.startIcon(id)
			const self = this

			axios({
				method:  'GET',
				url:     `/utils/${id}/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(function () {
				icon.classList.add('green')
				setTimeout(() => {
					icon.classList.remove('fa-spin')
					self.$router.replace('/syslog').catch(() => {
					}) //unused but required!
				}, 2000)
			}).catch(function () {
				icon.classList.add('red')
				setTimeout(() => {
					icon.classList.remove('fa-spin')
				}, 2000)
			}).finally(() => {
				setTimeout(() => {
					icon.classList.remove('fa-spin')
					icon.classList.remove('red')
					icon.classList.remove('green')
				}, 4000)
			})
		},
		utilityRequestAndCheck:    function (id, state) {
			const icon = this.startIcon(id)
			const self = this

			axios({
				method:  'GET',
				url:     `/utils/${id}/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(function () {
				self.checkState(state, icon)
			}).catch(function () {
				setTimeout(() => {
					icon.classList.remove('fa-spin')
					icon.classList.add('red')
				}, 1000)
			})
		},
		utilitySimpleRequest:      function (id) {
			const icon = this.startIcon(id)
			axios({
				method:  'GET',
				url:     `/utils/${id}/`,
				headers: {
					'auth': this.$store.getters.apiToken,
					'uid':  localStorage.getItem('interfaceUid')
				}
			}).then(response => {
				if ('success' in response.data && response.data['success']) {
					setTimeout(() => {
						icon.classList.remove('fa-spin')
						icon.classList.add('green')
					}, 2000)
				} else {
					icon.classList.add('red')
				}
			}).catch(function () {
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
				this.$router.replace('/dialogView').then()
			})
		},
		startIcon:                 function (id) {
			const icon = document.querySelector(`#utility${id.charAt(0).toUpperCase() + id.slice(1)}`)
			icon.classList.add('fa-spin')
			return icon
		},
		checkState:                function (state, icon) {
			let self = this
			axios({
				method:  'GET',
				url:     `/state/${state}/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(response => {
				if ('state' in response.data) {
					if (response.data['state'] === 4) {
						icon.classList.remove('fa-spin')
						icon.classList.add('green')
						setTimeout(function () {
							icon.classList.remove('green')
						}, 2000)
					} else if (response.data['state'] === 9) {
						icon.classList.remove('fa-spin')
						icon.classList.add('red')
					} else if (response.data['state'] === 1) {
						setTimeout(function () {
							self.checkState(state, icon)
						}, 1000)
					}
				} else {
					setTimeout(function () {
						self.checkState(state, icon)
					}, 1000)
				}
			}).catch(() => {
				icon.classList.remove('fa-spin')
				icon.classList.add('red')
			})
		}
	}
}
