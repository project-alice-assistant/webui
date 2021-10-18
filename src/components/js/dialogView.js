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
			audioContext: null,
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
					onClick: () => { }
				}
			]
		}
	},
	created: function() {
		navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(this.microphoneSupport = true).catch(() => {
			console.log('Audio recording not supported')
		})

		let self = this
		this.unwatch = this.$store.watch(
			function (state) {
				return state.mqttMessage
			},
			function (msg) {
				if (C.SESSION_ENDED_TOPIC === msg.topic) {
					self.currentSession = undefined
					self.listening = false
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
		startStream: function () {
			if (this.listening) {
				this.listening = false
				if (this.audioContext !== null) {
					this.audioContext.close()
				}
				return
			}

			this.listening = true
			let self = this
			navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(stream => {
				self.$store.state.mqtt.publish('hermes/hotword/default/detected', JSON.stringify({
					siteId: localStorage.getItem('interfaceUid'),
					modelType: 'universal'
				}))

				this.audioContext = new AudioContext({sampleRate: 16000})
				let source = this.audioContext.createMediaStreamSource(stream)
				let processor = this.audioContext.createScriptProcessor(512, 2, 2)
				source.connect(processor)
				processor.connect(this.audioContext.destination)
				processor.onaudioprocess = function (e) {
					const [left, right] = [e.inputBuffer.getChannelData(0), e.inputBuffer.getChannelData(1)]

					const interleaved = new Float32Array(left.length + right.length)
					for (let src = 0, dst = 0; src < left.length; src++, dst += 2) {
						interleaved[dst] = left[src]
						interleaved[dst + 1] = right[src]
					}

					const wavBytes = self.getWavBytes(interleaved.buffer, {
						isFloat: false,
						numChannels: 1,
						sampleRate: self.audioContext.sampleRate
					})

					self.$store.state.mqtt.publish(C.AUDIO_FRAME_TOPIC.replace('{}', localStorage.getItem('interfaceUid')), wavBytes)

					if (!self.listening) {
						self.audioContext.close()
					}
				}
			}).catch(error => {
				console.log('Audio recording not supported:', error)
				this.listening = false
			})
		},
		getWavBytes(buffer, options) {
			const type = options.isFloat ? Float32Array : Uint16Array
			const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT

			const headerBytes = this.getWavHeader(Object.assign({}, options, {numFrames}))
			const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength)

			// prepend header, then add pcmBytes
			wavBytes.set(headerBytes, 0)
			wavBytes.set(new Uint8Array(buffer), headerBytes.length)

			return wavBytes
		},
		getWavHeader(options) {
			const numFrames = options.numFrames
			const numChannels = options.numChannels || 2
			const sampleRate = options.sampleRate || 44100
			const bytesPerSample = options.isFloat ? 4 : 2
			const format = options.isFloat ? 3 : 1

			const blockAlign = numChannels * bytesPerSample
			const byteRate = sampleRate * blockAlign
			const dataSize = numFrames * blockAlign

			const buffer = new ArrayBuffer(44)
			const dv = new DataView(buffer)

			let p = 0

			function writeString(s) {
				for (let i = 0; i < s.length; i++) {
					dv.setUint8(p + i, s.charCodeAt(i))
				}
				p += s.length
			}

			function writeUint32(d) {
				dv.setUint32(p, d, true)
				p += 4
			}

			function writeUint16(d) {
				dv.setUint16(p, d, true)
				p += 2
			}

			writeString('RIFF')              // ChunkID
			writeUint32(dataSize + 36)       // ChunkSize
			writeString('WAVE')              // Format
			writeString('fmt ')              // Subchunk1ID
			writeUint32(16)                  // Subchunk1Size
			writeUint16(format)              // AudioFormat
			writeUint16(numChannels)         // NumChannels
			writeUint32(sampleRate)          // SampleRate
			writeUint32(byteRate)            // ByteRate
			writeUint16(blockAlign)          // BlockAlign
			writeUint16(bytesPerSample * 8)  // BitsPerSample
			writeString('data')              // Subchunk2ID
			writeUint32(dataSize)            // Subchunk2Size

			return new Uint8Array(buffer)
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
				data.append( 'sessionId', this.currentSession)
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
