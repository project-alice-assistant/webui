import axios from 'axios'
import * as C from '@/utils/constants'
import SpeechBubble from '@/components/views/speechBubble'

let RecordRTC = require('recordrtc')

export default {
	name: 'dialogView',
	components: {
		SpeechBubble
	},
	data: function () {
		return {
			recorder: null,
			listening: false,
			microphoneSupport: false,
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
					onClick: () => {
					}
				}
			]
		}
	},
	created: function () {
		navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(this.microphoneSupport = true).catch(() => {
			console.log('Audio recording not supported')
		})

		let self = this
		this.unwatch = this.$store.watch(
			function (state) {
				return state.mqttMessage
			},
			function (msg) {
				let payload = JSON.parse(msg.payloadString)

				if (C.SESSION_ENDED_TOPIC === msg.topic) {
					self.currentSession = undefined
					self.stopRecording()
				}
				if (C.STOP_LISTENING_TOPIC === msg.topic) {
					if (payload.siteId === localStorage.getItem('interfaceUid')) {
						self.stopRecording()
					}
				}
				if (C.START_LISTENING_TOPIC === msg.topic) {
					if (payload.siteId === localStorage.getItem('interfaceUid')) {
						self.startStream()
					}
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
		startListening: function () {
			if (this.listening) {
				this.stopRecording()
				return
			}
			this.listening = true
			this.$store.state.mqtt.publish('hermes/hotword/default/detected', JSON.stringify({
				siteId: localStorage.getItem('interfaceUid'),
				modelType: 'universal'
			}))
		},
		startStream: function () {
			let self = this
			navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(async function (stream) {
				self.recorder = RecordRTC(stream, {
					type: 'audio',
					mimeType: 'audio/wav',
					desiredSampRate: 16000,
					timeSlice: 100,
					recorderType: RecordRTC.StereoAudioRecorder,
					numberOfAudioChannels: 1,
					ondataavailable: (blob) => {
						blob.arrayBuffer().then(buffer => {
							self.$store.state.mqtt.publish(C.AUDIO_FRAME_TOPIC.replace('{}', localStorage.getItem('interfaceUid')), buffer)
						})
					}
				})
				self.recorder.startRecording()
			}).catch(error => {
				console.log('Audio recording not supported:', error)
				self.stopRecording()
			})
		},
		stopRecording: function () {
			this.listening = false
			if (this.recorder !== null) {
				this.recorder.stopRecording()
			}
		},
		sendQuery: function () {
			if (this.say === '') return

			const data = new FormData
			data.append('query', this.say)
			data.append('deviceUid', localStorage.getItem('interfaceUid'))
			//if no session is available start new one
			if (this.currentSession === undefined) {
				axios({
					method: 'POST',
					url: `/dialog/process/`,
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
				data.append('sessionId', this.currentSession)
				axios({
					method: 'POST',
					url: `/dialog/continue/`,
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
