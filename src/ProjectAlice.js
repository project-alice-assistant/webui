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
	mounted() {
		this.$router.replace('home')
	}
}
