import axios from 'axios';
import htmlFormatter from '../../utils/htmlFormatter'

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
		if (this.$cookies.isKey('verbosity')) {
			this.verbosity = parseInt(this.$cookies.get('verbosity'))
		} else {
			this.verbosity = 1
		}

		let self = this
		this.unwatch = this.$store.watch(
			function(state) {
				return state.mqttMessage
			},
			function(msg) {
				if (msg.topic === 'projectalice/logging/alicewatch') {
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
	updated: function() {
		if (this.follow) {
			let terminal = this.$el.querySelector('#terminal')
			terminal.scrollTop = terminal.scrollHeight
		}
	},
	beforeDestroy: function() {
		this.$store.state.mqtt.unsubscribe('projectalice/logging/alicewatch')
		this.unwatch()
	},
	methods: {
		setVerbosity: function(add) {
			this.verbosity = Math.max(0, Math.min(this.verbosity + add, 4))
			if (isNaN(this.verbosity)) {
				this.verbosity = 0
			}
			this.$cookies.set('verbosity', this.verbosity)
		}
	}
}
