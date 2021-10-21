import * as C from '@/utils/constants'

let RecordRTC = require('recordrtc')

export default {
	name: 'micStreamer',
	props: [
		'icon'
	],
	data: function () {
		return {
			recorder: null,
			listening: false,
			microphoneSupport: false
		}
	},
	created: function () {
		navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(() => {
			this.microphoneSupport = true
		}).catch(() => {
			console.log('Audio recording not supported')
		})
		let self = this
		this.unwatch = this.$store.watch(
			function (state) {
				return state.mqttMessage
			},
			function (msg) {
				if (C.STOP_LISTENING_TOPIC === msg.topic || C.SESSION_ENDED_TOPIC === msg.topic) {
					let payload = JSON.parse(msg.payloadString)
					if (payload.siteId === localStorage.getItem('interfaceUid')) {
						self.stopRecording()
					}
				}
				if (C.START_LISTENING_TOPIC === msg.topic) {
					let payload = JSON.parse(msg.payloadString)
					if (payload.siteId === localStorage.getItem('interfaceUid')) {
						self.startStream()
					}
				}
			}
		)
	},
	methods: {
		toggleListening: function () {
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
		}
	}
}
