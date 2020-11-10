export default {
	name: 'pa-header',
	data() {
		return {
			title: ''
		}
	},
	watch: {
		$route: {
			immediate: true,
			handler(to, from) {
				this.title = to.meta.title || 'Home'
			}
		}
	}
}

