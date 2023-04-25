import axios from 'axios'

export default class AudioPlayer {
	constructor() {
		if (!window.AudioContext) {
			if (!window.webkitAudioContext) {
				console.warn('Your browser doesn\'t support audio playback.')
				return
			}
			window.AudioContext = window.webkitAudioContext
		}

		this.context = new AudioContext()
	}


	playBytes(msg) {
		let self = this
		let bytes = msg.payloadBytes
		let sessionId = msg.topic.split('/').pop()
		let buffer = new ArrayBuffer(bytes.length)
		let bufferView = new Uint8Array(buffer)
		for (let i = 0; i < bytes.length; i++) {
			bufferView[i] = bytes[i]
		}

		this.context.decodeAudioData(buffer, function (buffer) {
			self.play(buffer)
		}).then(buf => {
			let data = new FormData
			data.append('sessionId', sessionId)
			axios({
				method:  'POST',
				url:     `/dialog/playBytesFinished/`,
				data:    data,
				headers: {
					'auth':         this.$store.getters.apiToken,
					'Content-Type': 'multipart/form-data'
				}
			})
		})
	}


	play(buffer) {
		let source = this.context.createBufferSource()
		source.buffer = buffer
		source.connect(this.context.destination)
		source.start(0)
	}
}
