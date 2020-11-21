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

			if (this.onChange) {
				this.onChange(id)
			}
		},
		rename: function(wid) {
			this.renameTab(wid)
		},
		add: function() {
			this.addTab()
		},
		remove: function(wid) {
			this.removeTab(wid)
		}
	}
}
