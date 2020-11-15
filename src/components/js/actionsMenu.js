export default {
	name: 'actionsMenu',
	data: function() {
		return {
			isExtended: false
		}
	},
	props: [
		'menuItems',
		'toggleMenu'
	],
	methods: {
		toggle: function() {
			this.isExtended = !this.isExtended
		}
	}
}
