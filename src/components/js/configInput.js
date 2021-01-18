export default {
	name: 'configInput',
	props: [
		'template',
		'configName',
		'parent'
	],
	computed: {
		configValue: {
			get: function () {
				return this.parent.myHome.devices[this.parent.data['id']].deviceConfigs[this.configName]
			},
			set: function (value) {
				return this.parent.myHome.devices[this.parent.data['id']].deviceConfigs[this.configName] = value
			}
		}
	}
}
