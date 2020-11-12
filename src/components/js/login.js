import axios from 'axios'

export default {
	name: 'login',
	data: function() {
		return {
			host: this.$store.state.settings['aliceIp'] || 'localhost',
			port: this.$store.state.settings['apiPort'] || '5001',
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
				method: 'post',
				url: `http://${this.host}:${this.port}/api/v1.0.1/login/`,
				data: data,
				headers: {'Content-Type': 'multipart/form-data' }
			}).then(response => {
				if ('apiToken' in response.data) {
					this.$store.commit('userLogin', {
						user: this.username,
						token: response.data.apiToken
					})
					if (this.rememberMe) {
						this.$cookies.set('username', this.username)
						this.$cookies.set('apiToken', response.data.apiToken)
						this.$cookies.set('host', this.host)
						this.$cookies.set('apiPort', this.port)
					}
					this.$router.replace('widgets')
				} else {
					console.log('nope')
				}
			}).catch(response => {
				console.log('Connection failed: ' + response)
			})
		}
	}
}
