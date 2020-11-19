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
		toggle: function(item) {
			this.isExtended = !this.isExtended

			if (!this.isExtended && item.hasOwnProperty('onClose')) {
				item['onClose']()
			} else if (this.isExtended && item.hasOwnProperty('onOpen')) {
				item['onOpen']()
			}
		},
		handleClick: function(item) {
			if (item.hasOwnProperty('isToggle') && item.isToggle) {
				this.toggle(item)
			}
			if (item.hasOwnProperty('onClick')) {
				item['onClick']()
			}
			if (item.hasOwnProperty('callback')) {
				item.callback(item)
			}
		}
	}
}
