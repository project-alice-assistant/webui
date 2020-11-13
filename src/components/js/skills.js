import axios from 'axios';

export default {
	name: 'skills',
	data: function () {
		return {
			skills: []
		}
	},
	mounted: function() {
		axios({
			method: 'get',
			url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/`,
			headers: {'auth': this.$store.state.loggedInUser['token'] }
		}).then(response => {
			if ('data' in response.data) {
				this.skills = response.data.data
			}
		})
	}
}
