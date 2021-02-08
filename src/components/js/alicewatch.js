import htmlFormatter from '@/utils/htmlFormatter'
import * as C from '@/utils/constants'

export default {
	name: 'alicewatch',
	data: function() {
		return {
			verbosity: 1,
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
		let verbosity = localStorage.getItem('alicewatchVerbosity') || 1
		this.verbosity = parseInt(verbosity)

		let self = this
		this.unwatch = this.$store.watch(
			function(state) {
				return state.mqttMessage
			},
			function(msg) {
				if (msg.topic === C.ALICE_WATCH_TOPIC) {
					let payload = JSON.parse(msg.payloadString)
					if (payload.verbosity > self.verbosity) {
						return
					}

					payload.text = htmlFormatter(payload.text)
					self.logs.push(payload)
				}
			}
		)
	},
	activated: function () {
		if (this.follow) {
			let terminal = this.$el.querySelector('#terminal')
			terminal.scrollTop = terminal.scrollHeight
		}
	},
	updated: function () {
		if (this.follow) {
			let terminal = this.$el.querySelector('#terminal')
			terminal.scrollTop = terminal.scrollHeight
		}
	},
	beforeDestroy: function () {
		this.$store.state.mqtt.unsubscribe(C.ALICE_WATCH_TOPIC)
		this.unwatch()
	},
	methods: {
		setVerbosity: function(add) {
			this.verbosity = Math.max(0, Math.min(this.verbosity + add, 4))
			if (isNaN(this.verbosity)) {
				this.verbosity = 0
			}
			localStorage.setItem('alicewatchVerbosity', this.verbosity)
		}
	}
}
