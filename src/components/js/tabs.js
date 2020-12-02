export default {
	name: 'tabs',
	data: function() {
		return {
			activeTab: 0,
			activeId: 1
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
		handleClick: function(position, id) {
			this.activeTab = position

			this.$parent.activeTab = position

			if (this.onChange) {
				this.onChange(id)
			}

			if (this.tabs[id].hasOwnProperty('onChangeTo')) {
				// noinspection JSUnresolvedFunction
				this.tabs[id].onChangeTo()
			}

			if (this.tabs[this.activeId].hasOwnProperty('onLeaveFrom')) {
				// noinspection JSUnresolvedFunction
				this.tabs[this.activeId].onLeaveFrom()
			}

			this.activeId = id
		},
		rename: function(wid) {
			if (this.renameTab) {
				this.renameTab(wid)
			}
		}
		,
		add: function() {
			if (this.addTab) {
				this.addTab()
			}
		},
		remove: function(wid) {
			if (this.removeTab) {
				this.removeTab(wid)
			}
		}
	}
}
