import * as C from '@/utils/constants'

export default {
	name: 'pa-header',
	data() {
		return {
			notifications: {
				1: {
					'type': 'alert',
					'data': 'This is an alert',
					'time': '1980523655'
				}
			},
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
				if (msg.topic === C.RESOURCE_USAGE_TOPIC) {
					self.resources = JSON.parse(msg.payloadString)
				}
			}
		)
	},
	beforeDestroy: function () {
		this.$store.state.mqtt.unsubscribe(C.RESOURCE_USAGE_TOPIC)
		this.unwatch()
	},
	watch: {
		$route: {
			immediate: true,
			handler(to) {
				this.title = this.$t(to.meta.title) || 'Home'
				document.title = `Project Alice - ${this.title.charAt(0).toUpperCase() + this.title.slice(1)}`
			}
		}
	}
}

