import axios from 'axios'

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
		'skill',
		'index' //only first skill gets tour marking
	],
	methods: {
		reloadSkill: function() {
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}/reload/`,
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
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}/toggleActiveState/`,
				headers: {'auth': this.$store.state.loggedInUser['token'] }
			}).then(() => (this.skill.active = !this.skill.active))

		},
		update: function() {
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}/checkUpdate/`,
				headers: {'auth': this.$store.state.loggedInUser['token'] }
			}).then(() => {})
		},
		remove: function() {
			axios({
				method: 'delete',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}/`,
				headers: {'auth': this.$store.state.loggedInUser['token'] }
			}).then(() => {
				this.$destroy()
				this.$el.parentNode.removeChild(this.$el)
			})
		},
		showSettings: function(skill) {
			let backup = JSON.parse(JSON.stringify(skill['settings']))
			const options = {
				view: 'skillSettingsPromptDialog',
				skill: skill
			}

			this.$dialog.prompt({}, options).then(dialogue => {
				axios({
					method: 'PATCH',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}/`,
					headers: {
						'auth': this.$store.state.loggedInUser['token'],
						'content-type': 'application/json'
					},
					data: JSON.stringify(dialogue.data)
				}).then(() => backup = {})
			}).catch(() => skill['settings'] = backup)
		}
	}
}
