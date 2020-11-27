import axios from 'axios';

export default {
	name: 'syslog',
	data: function() {
		return {
			cmd: '',
			unwatch: {},
			follow: true,
			logs: [],
			menuItems: [
				{
					name: this.$t('tooltips.lock'),
					icon: 'far fa-pause-circle',
					extendedIcon: 'far fa-play-circle',
					extendedName: this.$t('tooltips.follow'),
					isToggle: true,
					onClick: () => {this.follow = !this.follow}
				}
			]
		}
	},
	created: function() {
		let self = this
		this.unwatch = this.$store.watch(
			function(state) {
				return state.mqttMessage
			},
			function(msg) {
				if (msg.topic === 'projectalice/logging/syslog') {
					self.logs.push(JSON.parse(msg.payloadString).msg)
				}
			}
		)
	},
	updated: function() {
		if (this.follow) {
			let terminal = this.$el.querySelector('#terminal')
			terminal.scrollTop = terminal.scrollHeight
		}
	},
	beforeDestroy: function() {
		this.$store.state.mqtt.unsubscribe('projectalice/devices/resourceUsage')
		this.unwatch()
	},
	methods: {
		sendCmd: function() {
			const data = new FormData
			data.append('cmd', this.cmd)
			axios({
				method: 'post',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/sysCmd/`,
				data: data,
				headers: {
					'auth': this.$store.state.loggedInUser['token'],
					'Content-Type': 'multipart/form-data'
				}
			})
		}
	}
}
