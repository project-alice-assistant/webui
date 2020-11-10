import paHeader from '@/components/vue/header';
import paNav from '@/components/vue/nav';
import PaContent from '@/components/vue/content';

export default {
	name: 'ProjectAlice',
	components: {
		PaContent,
		paHeader,
		paNav
	},
	data() {
		return {
			settings: {}
		}
	},
	beforeMount() {
		this.axios
			.get('http://192.168.1.168:5001/api/v1.0.1/utils/config/')
			.then(response => (this.settings = response.data.config))
			.catch(reason => (console.log('Error connecting to Alice ' + reason)))
	}
}
