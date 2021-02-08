import axios from 'axios'

export default {
	name: 'login',
	data: function() {
		return {
			username: '',
			pincode: '',
			rememberMe : false
		}
	},
	methods: {
		login: function() {
			let data = new FormData()
			data.append('username', this.username)
			data.append('pin', this.pincode)
			axios({
				method: 'POST',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/login/`,
				data: data,
				headers: {'Content-Type': 'multipart/form-data'}
			}).then(response => {
				if ('apiToken' in response.data) {
					this.$store.commit('userLogin', {
						user: this.username,
						token: response.data.apiToken,
						authLevel: response.data.authLevel
					})
					if (this.rememberMe) {
						localStorage.setItem('username', this.username)
						localStorage.setItem('apiToken', response.data.apiToken)
					}

					axios({
						method: 'GET',
						url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/config/`,
						headers: {'auth': response.data.apiToken}
					}).then(response => {
						this.$store.commit('setSettings', response.data['config'])
						this.$store.commit('setSettingTemplates', response.data['templates'])
						this.$store.commit('setSettingCategories', response.data['categories'])
						this.$store.state.connectVue.storeSessionSettings()
						this.$store.state.connectVue.helloAlice().then(this.$store.state.connectVue.startHeartbeat())
					})

					this.$router.replace('/').then()
				} else {
					this.username = ''
					this.pincode = ''

					let self = this
					this.$refs.form.classList.add('failed')
					setTimeout(function() {
						self.$refs.form.classList.remove('failed')
					}, 2000)
				}
			}).catch(response => {
				console.log('Connection failed: ' + response)
			})
		}
	}
}
