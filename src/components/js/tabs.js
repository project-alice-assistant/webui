export default {
	name: 'tabs',
	data: function() {
		return {
			activeTabId: 1
		}
	},
	props: [
		'tabs',
		'onChange',
		'addTab',
		'removeTab',
		'renameTab'
	],
	methods: {
		handleClick: function (id) {
			this.activeTabId = id
			this.$parent.activeTabId = id

			if (this.onChange) {
				this.onChange(id)
			}

			if (this.tabs[id].hasOwnProperty('onChangeTo')) {
				// noinspection JSUnresolvedFunction
				this.tabs[id].onChangeTo()
			}

			if (this.tabs[id].hasOwnProperty('onLeaveFrom')) {
				// noinspection JSUnresolvedFunction
				this.tabs[id].onLeaveFrom()
			}
		},
		rename: function (id) {
			if (this.renameTab) {
				this.renameTab(id)
			}
		}
		,
		add: function () {
			if (this.addTab) {
				this.addTab()
			}
		},
		remove: function (id) {
			if (this.removeTab) {
				this.removeTab(id)
			}
		}
	}
}
