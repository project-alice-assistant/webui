export default {
	name: 'configInput',
	props: [
		'template',
		'configName',
		'holder',
		'parent'
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
	}
}
