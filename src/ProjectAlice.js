import paHeader from './components/views/header';
import paNav from './components/views/nav';
import paContent from './components/views/content';

export default {
	name: 'ProjectAlice',
	components: {
		paContent,
		paHeader,
		paNav
	},
	data() {
		return {
			loading: true
		}
	},
	created() {
		this.$router.replace('home')

		this.axios.get('http://192.168.1.168:5001/api/v1.0.1/utils/config/')
			.then(response => {
				this.$store.commit('setSettings', response.data.config)
			})
			.catch(reason => (console.log('Error connecting to Alice ' + reason)))
			.finally(this.loading = false)
	}
}
