import axios from 'axios';

export default {
	name: 'skill',
	data: function() {
		return {
			viewIntents: false,
			viewInfos: false,
			viewInstructions: false,
			viewSkill: true
		}
	},
	props: [
		'skill'
	],
	methods: {
		reloadSkill: function() {
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}/reload`,
				headers: {'auth': this.$store.state.loggedInUser['token'] }
			}).then(response => {
				if ('skill' in response.data) {
					this.skill = response.data.skill
				}
			})
		},
		toggle: function() {
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}/toggleActiveState`,
				headers: {'auth': this.$store.state.loggedInUser['token'] }
			}).then(response => (this.skill.active = !this.skill.active))

		},
		update: function() {
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}/checkUpdate`,
				headers: {'auth': this.$store.state.loggedInUser['token'] }
			}).then(response => {})
		},
		remove: function() {
			axios({
				method: 'delete',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}`,
				headers: {'auth': this.$store.state.loggedInUser['token'] }
			}).then(response => {
				this.$destroy()
				this.$el.parentNode.removeChild(this.$el)
			})
		}
	}
}
