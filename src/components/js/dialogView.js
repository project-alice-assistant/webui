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
					ondataavailable: (_blob) => {
						let internalRecorder = self.recorder.getInternalRecorder()
						let leftChannel = [...internalRecorder.leftchannel]
						let rightChannel = internalRecorder.numberOfAudioChannels === 1 ? [] : [...internalRecorder.rightchannel]

						self.mergeLeftRightBuffers({
							desiredSampRate: internalRecorder.desiredSampRate,
							sampleRate: internalRecorder.sampleRate,
							numberOfAudioChannels: internalRecorder.numberOfAudioChannels,
							internalInterleavedLength: internalRecorder.recordingLength,
							leftBuffers: leftChannel,
							rightBuffers: rightChannel
						}, function (buffer, _view) {
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
		mergeLeftRightBuffers: function (config, callback) { // Shameless copy of https://github.com/muaz-khan/RecordRTC/blob/master/simple-demos/raw-pcm.html Thank you for the example!
			function mergeAudioBuffers(config, cb) {
				let numberOfAudioChannels = config.numberOfAudioChannels

				let leftBuffers = config.leftBuffers.slice(0)
				let rightBuffers = config.rightBuffers.slice(0)
				let sampleRate = config.sampleRate
				let internalInterleavedLength = config.internalInterleavedLength
				let desiredSampRate = config.desiredSampRate

				if (numberOfAudioChannels === 2) {
					leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength)
					rightBuffers = mergeBuffers(rightBuffers, internalInterleavedLength)
					if (desiredSampRate) {
						leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate)
						rightBuffers = interpolateArray(rightBuffers, desiredSampRate, sampleRate)
					}
				}

				if (numberOfAudioChannels === 1) {
					leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength)
					if (desiredSampRate) {
						leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate)
					}
				}

				// set sample rate as desired sample rate
				if (desiredSampRate) {
					sampleRate = desiredSampRate
				}

				// for changing the sampling rate, reference:
				// http://stackoverflow.com/a/28977136/552182
				function interpolateArray(data, newSampleRate, oldSampleRate) {
					let fitCount = Math.round(data.length * (newSampleRate / oldSampleRate))
					let newData = []
					let springFactor = Number((data.length - 1) / (fitCount - 1))
					newData[0] = data[0] // for new allocation
					for (let i = 1; i < fitCount - 1; i++) {
						let tmp = i * springFactor
						let before = Number(Math.floor(tmp)).toFixed()
						let after = Number(Math.ceil(tmp)).toFixed()
						let atPoint = tmp - before
						newData[i] = linearInterpolate(data[before], data[after], atPoint)
					}
					newData[fitCount - 1] = data[data.length - 1] // for new allocation
					return newData;
				}

				function linearInterpolate(before, after, atPoint) {
					return before + (after - before) * atPoint
				}

				function mergeBuffers(channelBuffer, rLength) {
					let result = new Float64Array(rLength)
					let offset = 0
					let lng = channelBuffer.length

					for (let i = 0; i < lng; i++) {
						let buffer = channelBuffer[i]
						result.set(buffer, offset)
						offset += buffer.length
					}

					return result
				}

				function interleave(leftChannel, rightChannel) {
					let length = leftChannel.length + rightChannel.length
					let result = new Float64Array(length)
					let inputIndex = 0

					for (let index = 0; index < length;) {
						result[index++] = leftChannel[inputIndex]
						result[index++] = rightChannel[inputIndex]
						inputIndex++
					}
					return result
				}

				function writeUTFBytes(view, offset, string) {
					let lng = string.length
					for (let i = 0; i < lng; i++) {
						view.setUint8(offset + i, string.charCodeAt(i))
					}
				}

				// interleave both channels together
				let interleaved

				if (numberOfAudioChannels === 2) {
					interleaved = interleave(leftBuffers, rightBuffers)
				}

				if (numberOfAudioChannels === 1) {
					interleaved = leftBuffers
				}

				let interleavedLength = interleaved.length

				// create wav file
				let resultingBufferLength = 44 + interleavedLength * 2
				let buffer = new ArrayBuffer(resultingBufferLength)
				let view = new DataView(buffer)

				// RIFF chunk descriptor/identifier
				writeUTFBytes(view, 0, 'RIFF')

				// RIFF chunk length
				view.setUint32(4, 44 + interleavedLength * 2, true)

				// RIFF type
				writeUTFBytes(view, 8, 'WAVE')

				// format chunk identifier
				// FMT sub-chunk
				writeUTFBytes(view, 12, 'fmt ')

				// format chunk length
				view.setUint32(16, 16, true)

				// sample format (raw)
				view.setUint16(20, 1, true)

				// stereo (2 channels)
				view.setUint16(22, numberOfAudioChannels, true)

				// sample rate
				view.setUint32(24, sampleRate, true)

				// byte rate (sample rate * block align)
				view.setUint32(28, sampleRate * 2, true)

				// block align (channel count * bytes per sample)
				view.setUint16(32, numberOfAudioChannels * 2, true)

				// bits per sample
				view.setUint16(34, 16, true)

				// data sub-chunk
				// data chunk identifier
				writeUTFBytes(view, 36, 'data')

				// data chunk length
				view.setUint32(40, interleavedLength * 2, true)

				// write the PCM samples
				let lng = interleavedLength
				let index = 44
				let volume = 1
				for (let i = 0; i < lng; i++) {
					view.setInt16(index, interleaved[i] * (0x7FFF * volume), true)
					index += 2
				}

				if (cb) {
					return cb({
						buffer: buffer,
						view: view
					})
				}
			}

			mergeAudioBuffers(config, function (data) {
				callback(data.buffer, data.view)
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
