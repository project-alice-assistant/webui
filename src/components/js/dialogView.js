import axios from 'axios'
import * as C from '@/utils/constants'
import SpeechBubble from '@/components/views/speechBubble'

export default {
	name: 'dialogView',
	components: {
		SpeechBubble
	},
	data: function () {
		return {
			cmd: '',
			unwatch: {},
			msgs: [],
			say: '',
			currentSpeech: undefined,
			currentSession: undefined,
			menuItems: [
				{
					name: this.$t('tooltips.close'),
					icon: 'far fa-pause-circle',
					extendedIcon: 'far fa-play-circle',
					extendedName: this.$t('tooltips.close'),
					isToggle: true,
					onClick: () => { }
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
				if (C.SESSION_ENDED_TOPIC === msg.topic) {
					self.currentSession = undefined
				}
				if ([C.NLU_QUERY_TOPIC, C.SAY_TOPIC, C.SESSION_ENDED_TOPIC].includes(msg.topic)) {
					self.msgs.push(msg)
					//start timer to remove from memory
					//setTimeout(()=>{ self.msgs.shift(); }, 20000);
				}
				if ([C.ASR_TOPIC, C.ASR_PART_TOPIC].includes(msg.topic)) {
					self.currentSpeech = msg
				}
				if (C.NLU_QUERY_TOPIC === msg.topic) {
					self.currentSpeech = undefined
				}
			}
		)
	},
	activated: function () {
		let terminal = this.$el.querySelector('#messageContainer')
		terminal.scrollTop = terminal.scrollHeight
	},
	updated: function () {
		let terminal = this.$el.querySelector('#messageContainer')
		terminal.scrollTop = terminal.scrollHeight
	},
	beforeDestroy: function () {
		this.$store.state.mqtt.unsubscribe(C.NLU_QUERY_TOPIC)
		this.$store.state.mqtt.unsubscribe(C.SAY_TOPIC)
		this.$store.state.mqtt.unsubscribe(C.SESSION_ENDED_TOPIC)
		this.unwatch()
	},
	methods: {
		sendQuery: function () {
			if (this.say === '') return

			const data = new FormData
			data.append('query', this.say)
			data.append('deviceUid', localStorage.getItem('interfaceUid'))
			//if no session is available start new one
			if (this.currentSession === undefined) {
				axios({
					method: 'POST',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/dialog/process/`,
					data: data,
					headers: {
						'auth': this.$store.getters.apiToken,
						'Content-Type': 'multipart/form-data'
					}
				}).then(response => {
					if ('sessionId' in response.data) {
						this.currentSession = response.data.sessionId
					}
				})
			} else {
				//if session is available - continueSession
				data.append( 'sessionId', this.currentSession)
				axios({
					method: 'POST',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/dialog/continue/`,
					data: data,
					headers: {
						'auth': this.$store.getters.apiToken,
						'Content-Type': 'multipart/form-data'
					}
				})
			}
			this.say = ''
		}
	}
}
