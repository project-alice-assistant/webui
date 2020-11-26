export default {
	name: 'syslog',
	data: function() {
		return {
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
	beforeDestroy: function() {
		this.$store.state.mqtt.unsubscribe('projectalice/devices/resourceUsage')
		this.unwatch()
	}
}
