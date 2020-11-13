export default {
	name: 'pa-nav',
	methods: {
		logout: function() {
			this.$store.commit('userLogout')
			window.location.reload()
		}
	}
}
