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
					let payload = JSON.parse(msg.payloadString)
					payload.msg = payload.msg.replace(/\*\*(.*?)\*\*/gi, '<span class="logBold">$1</span>')
					payload.msg = payload.msg.replace(/--(.*?)--/gi, '<span class="logDim">$1</span>')
					payload.msg = payload.msg.replace(/__(.*?)__/gi, '<span class="logUnderlined">$1</span>')
					payload.msg = payload.msg.replace(/!\[(red|green|yellow|blue|grey)]\((.*?)\)/gi, '<span class="$1">$2</span>')
					self.logs.push(payload)
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
