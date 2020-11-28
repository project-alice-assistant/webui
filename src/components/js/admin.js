import axios from 'axios'

export default {
	name: 'admin',
	data: function() {
		return {
			activePageId: 1,
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
		}
	}
}
