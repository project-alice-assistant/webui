export default {
	name: 'tabs',
	props: [
		'tabs',
		'onChange',
		'addTab',
		'removeTab',
		'renameTab',
		'activeTabId',
		'parent'
	],
	methods: {
		handleClick: function (id) {

			if (this.$parent.activeTabId !== id) {
				if (this.onChange) {
					this.onChange(id)
				} else {
					this.$parent.activeTabId = id
				}
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
