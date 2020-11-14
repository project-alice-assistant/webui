export default {
	name: 'pa-widgets',
	data: function() {
		return {
			menuItems: [
				{
					name: 'edit',
					icon: 'fas fa-pen-square',
					extendedIcon: 'fas fa-times-circle'
				},
				{
					name: 'theater mode',
					icon: 'fas fa-person-booth'
				},
				{
					name: 'settings',
					icon: 'fas fa-cog'
				},
				{
					name: 'add widget',
					icon: 'far fa-plus-square'
				},
				{
					name: 'remove widget',
					icon: 'far fa-minus-square'
				},
				{
					name: 'save',
					icon: 'fas fa-save',
					callback: this.saveAndClose
				}
			]
		}
	},
	methods: {
		saveAndClose: function() {
			console.log('saved')
		}
	}
}
