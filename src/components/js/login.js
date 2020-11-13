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
				method: 'post',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/login/`,
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
