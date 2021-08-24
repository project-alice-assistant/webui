export default {
	name: 'tabs',
	props: [
		'tabs',
		'onChange',
		'addTab',
		'removeTab',
		'renameTab',
		'activeTabId',
		'parent',
		'store'
	],
	methods: {
		handleClick: function (id) {
			let oldId = this.$parent.activeTabId
			if (oldId === id) return;

			if (this.tabs[oldId].hasOwnProperty('checkAllowLeaveFrom')) {
				// noinspection JSUnresolvedFunction
				this.tabs[oldId].checkAllowLeaveFrom().then(() => {
					this.handleClickAllowed(id)
				}).catch( () => {})
			} else {
				this.handleClickAllowed(id)
			}
		},
		handleClickAllowed(id) {
			let oldId = this.$parent.activeTabId
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

			if (this.tabs[oldId].hasOwnProperty('onLeaveFrom')) {
				// noinspection JSUnresolvedFunction
				this.tabs[oldId].onLeaveFrom()
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
