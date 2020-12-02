export default {
	name: 'actionsMenu',
	data: function() {
		return {
			isExtended: false,
			extend: false,
			retract: false
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
				this.extend = false
				this.retract = true
			} else if (this.isExtended && item.hasOwnProperty('onOpen')) {
				item['onOpen']()
				this.retract = false
				this.extend = true
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
		},
		animationEnd: function() {
			this.extend = false
			this.retract = false
		}
	}
}
