export default {
	name: 'tabs',
	data: function() {
		return {
			activeTab: 0
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
			this.activeTabId = id

			this.$parent.activeTab = position

			if (this.onChange) {
				this.onChange(id)
			}
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
