export default {
	name: 'myhome',
	data: function() {
		return {
			menuItems: [
				{
					name: this.$t('tooltips.edit'),
					icon: 'fas fa-pen-square',
					isToggle: true,
					extendedIcon: 'fas fa-times-circle',
					extendedName: this.$t('tooltips.close')
				},
				{
					name: this.$t('tooltips.theaterMode'),
					icon: 'fas fa-person-booth',
					isToggle: true,
					callback: this.cinemaMode
				}
			]
		}
	},
	created: function() {
		let self = this;
		document.addEventListener('keypress', function (event) {
			if (event.key === 'Enter') {
				self.$store.commit('stopCinemaMode')
			}
		})
	},
	methods: {
		cinemaMode: function () {
			this.$store.commit('toggleCinemaMode')
		}
	}
}
