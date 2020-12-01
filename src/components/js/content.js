export default {
	name: 'pa-content',
	data: function() {
		return {
			connected: true,
			reconnected: false,
			checkHeartbeat: null
		}
	},
	created: function() {
		let self = this
		this.unwatch = this.$store.watch(
			function(state) {
				return state.mqttMessage
			},
			function(msg) {
				if (msg.topic === 'projectalice/devices/coreHeartbeat') {
					if (self.reconnected) return

					if (self.checkHeartbeat !== null) {
						clearTimeout(self.checkHeartbeat)
						if (!self.connected && !self.reconnected) {
							self.reconnected = true
							// Let 5 seconds go for the animation to complete
							setTimeout(function() {
								self.connected = true
								self.reconnected = false
							}, 5000)
							return
						}
					}
					self.checkHeartbeat = setTimeout(function(){
						self.connected = false
						self.reconnected = false
					}, 4500)

					self.connected = true
				}
			}
		)
	},
	beforeDestroy: function() {
		this.$store.state.mqtt.unsubscribe('projectalice/devices/coreHeartbeat')
		this.unwatch()
	}
}
