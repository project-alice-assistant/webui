
export default {
	name: 'actionsMenu',
	data: function() {
		return {
			extended: false
		}
	},
	props: [
		'menuItems',
		'toggleMenu'
	],
	methods: {
		toggle: function() {
			this.extended = !this.extended
		}
	}
}
