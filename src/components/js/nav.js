export default {
	name:     'pa-nav',
	data:     function () {
		return {
			animateRetract: false,
			animateExtend:  false
		}
	},
	computed: {
		forceMinimized() {
			return this.$store.state.windowHeight <= 627
		}
	},
	methods:  {
		logout:        function () {
			this.$store.commit('userLogout')
			window.location.reload()
		},
		endAnimations: function () {
			this.animateExtend = false
			this.animateRetract = false
		},
		minimize:      function () {
			this.$store.commit('startMinimized')
			this.animateExtend = false
			this.animateRetract = true
		}
		,
		maximize: function () {
			this.$store.commit('stopMinimized')
			this.animateRetract = false
			this.animateExtend = true
		}
	}
}
