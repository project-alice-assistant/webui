import axios from 'axios'

export default {
	name: 'admin',
	data: function() {
		return {
			activeTabId: 1,
			settingSearchKeyword: '',
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
			},
			categoriesVisibility: ''
		}
	},
	computed: {
		categorySettings() {
			return (categoryName) => {
				let settings = {}
				for (const [settingName, settingTemplate] of Object.entries(this.$store.state.settingTemplates)) {
					if (!settingTemplate['hidden'] && settingTemplate['category'].toLowerCase() === categoryName.toLowerCase() && this.checkSettingVisibility(settingName)) {
						settings[settingName] = settingTemplate
					}
				}
				return settings
			}
		},
		settingsCategories() {
			if (this.settingSearchKeyword === '') {
				return this.$store.state.settingCategories
			} else {
				let self = this
				return Object.values(this.$store.state.settingCategories).filter(categoryName => {
					return self.checkCategoryVisibility(categoryName)
				})
			}
		}
	},
	methods: {
		checkSetters: function (settingName) {
			if ('sets' in this.$store.state.settingTemplates[settingName]) {
				let setters = this.$store.state.settingTemplates[settingName]['sets']
				const myValue = this.$store.state.settings[settingName]
				let values
				if (setters.includes(' - ')) {
					setters = setters.split(' - ')
					values = this.$store.state.settingTemplates[settingName]['values'] || this.$store.state.settingTemplates[settingName]['defaultValue']
					for (const [text, value] of Object.entries(values)) {
						if (value.toLowerCase() !== myValue.toLowerCase()) continue
						values = text.split(' - ')
					}
				} else {
					setters = [setters]
					values = [myValue]
				}
				setters.forEach((setter, index) => {
					this.$store.state.settings[setter] = values[index]
				})
			}
		},
		checkCategoryVisibility: function (categoryName) {
			const parent = document.querySelector(`#${categoryName.toLowerCase().replace(' ', '_')}`)
			if (parent !== null) {
				return parent.querySelector('.input') !== null
			}
		},
		checkSettingVisibility: function (settingName) {
			let visible = true
			if ('parent' in this.$store.state.settingTemplates[settingName]) {
				const parentTemplate = this.$store.state.settingTemplates[settingName]['parent']
				const parentConfig = parentTemplate['config']
				const reqCondition = parentTemplate['condition']
				const reqValue = parentTemplate['value']
				let parentValue = this.$store.state.settings[parentConfig]

				if (Array.isArray(parentConfig)) {
					const type = parentTemplate['checkType'] || 'and'
					for (const parent of parentConfig) {
						parentValue = this.$store.state.settings[parent]
						visible = (reqCondition === 'is' && parentValue === reqValue) || (reqCondition === 'isnot' && parentValue !== reqValue) || (reqCondition === 'isgreater' && parentValue > reqValue) || (reqCondition === 'islower' && parentValue < reqValue)
						if (type === 'or' && visible) {
							break
						} else if (type === 'and' && !visible) {
							break
						}
					}
				} else {
					visible = (reqCondition === 'is' && parentValue === reqValue) || (reqCondition === 'isnot' && parentValue !== reqValue) || (reqCondition === 'isgreater' && parentValue > reqValue) || (reqCondition === 'islower' && parentValue < reqValue)
				}

				if (visible && this.settingSearchKeyword !== '') {
					visible = settingName.toLowerCase().includes(this.settingSearchKeyword.toLowerCase());
				}
			} else {
				if (this.settingSearchKeyword !== '') {
					visible = settingName.toLowerCase().includes(this.settingSearchKeyword.toLowerCase());
				}
			}

			return visible
		},
		save: function(event) {
			let self = this
			event.target['data-success'] = false
			axios({
				method: 'PATCH',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/config/`,
				headers: {
					'auth': this.$store.getters.apiToken,
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
				headers: {'auth': this.$store.getters.apiToken},
			}).then(function() {
				setTimeout(() => {
					icon.classList.add('green')
					self.$router.replace('/syslog').catch()
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
				headers: {'auth': this.$store.getters.apiToken}
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
			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/${id}/`,
				headers: {
					'auth': this.$store.getters.apiToken,
					'uid': localStorage.getItem('interfaceUid')
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
				this.$router.replace('/dialogView').then()
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
				headers: {'auth': this.$store.getters.apiToken}
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
