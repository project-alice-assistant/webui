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
		}
	}
}
