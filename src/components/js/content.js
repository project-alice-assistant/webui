import * as C from '@/utils/constants'
import paScenariosIframe from '../views/scenariosIframe'

export default {
	name: 'pa-content',
	components: {
		paScenariosIframe
	},
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
				if (msg.topic === C.CORE_HEARTBEAT_TOPIC || msg.topic === C.CORE_RECONNECTION_TOPIC) {
					if (self.reconnected) return

					if (self.checkHeartbeat !== null) {
						clearTimeout(self.checkHeartbeat)
						if (!self.connected && !self.reconnected) {
							self.reconnected = true
							// Let 5 seconds go for the animation to complete
							setTimeout(function () {
								self.connected = true
								self.reconnected = false
							}, 5000)
							return
						}
					}
					self.checkHeartbeat = setTimeout(function () {
						self.connected = false
						self.reconnected = false
					}, 4500)

					self.connected = true
				} else if (msg.topic === C.CORE_DISCONNECTION_TOPIC) {
					self.connected = false
					if (self.checkHeartbeat !== null) {
						clearTimeout(self.checkHeartbeat)
					}
				}
			}
		)
	},
	beforeDestroy: function () {
		this.$store.state.mqtt.unsubscribe(C.CORE_HEARTBEAT_TOPIC)
		this.$store.state.mqtt.unsubscribe(C.CORE_RECONNECTION_TOPIC)
		this.$store.state.mqtt.unsubscribe(C.CORE_DISCONNECTION_TOPIC)
		this.unwatch()
	},
	watch: {
		$route: {
			immediate: true,
			handler(to) {
				if (this.$store.state.uiConnected) {
					localStorage.setItem('showPage', to.path)
				}
			}
		}
	}
}
