export default {
	name: 'pa-header',
	data() {
		return {
			title: '',
			unwatch: {},
			resources: {
				cpu: 0,
				ram: 0,
				swp: 0
			}
		}
	},
	created: function() {
		let self = this
		this.unwatch = this.$store.watch(
			function(state) {
				return state.mqttMessage
			},
			function(msg) {
				if (msg.topic === 'projectalice/devices/resourceUsage') {
					self.resources = JSON.parse(msg.payloadString)
				}
			}
		)
	},
	beforeDestroy: function() {
		this.$store.state.mqtt.unsubscribe('projectalice/devices/resourceUsage')
		this.unwatch()
	},
	watch: {
		$route: {
			immediate: true,
			handler(to, from) {
				this.title = to.meta.title || 'Home'
				document.title = `Project Alice - ${this.title.charAt(0).toUpperCase() + this.title.slice(1)}`
			}
		}
	}
}

