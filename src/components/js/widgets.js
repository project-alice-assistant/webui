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
					icon: 'fas fa-person-booth',
					callback: this.cinemaMode
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
	created() {
		let self = this;
		document.addEventListener('keypress', function(event) {
			if (event.key === 'Enter') {
				self.$store.commit('stopCinemaMode')
			}
		})
	},
	methods: {
		saveAndClose: function() {
			console.log('saved')
		},
		cinemaMode: function() {
			this.$store.commit('toggleCinemaMode')
		}
	}
}
