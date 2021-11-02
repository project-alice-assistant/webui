import VueDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'

export default {
	mixins:   [VueDialogMixin],
	data:     function () {
		return {
			parent: this.options['parent'],
			data:   this.options['data']
		}
	},
	computed: {
		myConfigTemplates:      function () {
			return this.parent.myHome.getDeviceType(this).deviceConfigsTemplates
		},
		myLinkConfigTemplates:  function () {
			return this.parent.myHome.getDeviceType(this).linkConfigsTemplates
		},
		deviceTemplates:        function () {
			return Object.assign({}, this.myConfigTemplates, this.genericDeviceTemplates)
		},
		genericDeviceTemplates: function () {
			let template = {
				'displayName': {
					'defaultValue': '',
					'dataType':     'string',
					'isSensitive':  false,
					'description':  'The name to display for this device'
				}
			}
			if (this.data['allowHeartbeatOverride']) {
				template['heartbeat'] = {
					'defaultValue': 0,
					'dataType':     'integer',
					'isSensitive':  false,
					'description':  'Allow overwriting of the heartbeat'
				}
			}
			return template
		},
		configValue() {
			return (configName) => {
				return this.data.deviceConfigs[configName] || ''
			}
		}
	},
	methods:  {
		handleConfirm() {
			this.proceed()
		},
		handleDismiss() {
			this.cancel()
		}
	}
}
