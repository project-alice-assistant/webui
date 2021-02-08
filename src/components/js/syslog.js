import axios from 'axios'
import htmlFormatter from '@/utils/htmlFormatter'
import * as C from '@/utils/constants'

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
			function (state) {
				return state.mqttMessage
			},
			function (msg) {
				if (msg.topic === C.SYSLOG_TOPIC) {
					let payload = JSON.parse(msg.payloadString)
					payload.msg = htmlFormatter(payload.msg)
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
		this.$store.state.mqtt.unsubscribe(C.SYSLOG_TOPIC)
		this.unwatch()
	},
	methods: {
		sendCmd: function () {
			const data = new FormData
			data.append('cmd', this.cmd)
			axios({
				method: 'POST',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/utils/sysCmd/`,
				data: data,
				headers: {
					'auth': this.$store.getters.apiToken,
					'Content-Type': 'multipart/form-data'
				}
			})
		}
	}
}
