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

	playBytes(bytes) {
		let self = this
		let buffer = new ArrayBuffer(bytes.length)
		let bufferView = new Uint8Array(buffer)
		for (let i = 0; i < bytes.length; i++) {
			bufferView[i] = bytes[i]
		}

		this.context.decodeAudioData(buffer, function (buffer) {
			self.play(buffer)
		}).then()
	}

	play(buffer) {
		let source = this.context.createBufferSource()
		source.buffer = buffer
		source.connect(this.context.destination)
		source.start(0)
	}
}
