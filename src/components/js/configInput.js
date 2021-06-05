export default {
	name: 'configInput',
	props: [
		'template',
		'configName',
		'holder',
		'translate'
	],
	computed: {
		configValue: {
			get: function () {
				return this.holder[this.configName]
			},
			set: function (value) {
				return this.holder[this.configName] = value
			}
		}
	},
	methods: {
		hex2rgba() {
			let hex = this.holder['background']
			let alpha = this.holder['background-opacity']
			const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
			this.holder['rgba'] = `rgba(${r}, ${g}, ${b}, ${alpha})`
			console.log('new color ' + this.holder['rgba'])
		}
	}
}
