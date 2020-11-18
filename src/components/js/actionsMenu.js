export default {
	name: 'actionsMenu',
	data: function() {
		return {
			isExtended: false
		}
	},
	props: [
		'menuItems'
	],
	methods: {
		toggle: function() {
			this.isExtended = !this.isExtended
		},
		handleClick: function(item) {
			if (item.hasOwnProperty('isToggle') && item.isToggle) {
				this.toggle()
			}
			if (item.hasOwnProperty('click')) {
				item['click']()
			}
			if (item.hasOwnProperty('callback')) {
				item.callback()
			}
		}
	}
}
