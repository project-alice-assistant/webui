import axios from 'axios'

export default {
	name: 'skill',
	data: function () {
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
		reloadSkill: function () {
			if (this.$tours['skills'].currentStep !== -1) return
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}/reload/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(response => {
				if ('skill' in response.data) {
					this.showSuccess('notifications.successes.reloadTriggered')
					this.$parent.updateSkillData(response.data.skill)
				}
			})
		},
		toggle: function () {
			if (this.$tours['skills'].currentStep !== -1) return
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}/toggleActiveState/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(() => (this.skill.active = !this.skill.active))

		},
		update: function () {
			if (this.$tours['skills'].currentStep !== -1) return
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}/checkUpdate/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(() => {
			})
		},
		remove: function () {
			if (this.$tours['skills'].currentStep !== -1) return

			let self = this
			this.$dialog
				.confirm(this.$t('dialogs.titles.confirmSkillDeletion'), {okText: this.$t('dialogs.labels.yes'), cancelText: this.$t('dialogs.labels.cancel')})
				.then(function() {
					axios({
						method: 'delete',
						url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/skills/${self.skill.name}/`,
						headers: {'auth': this.$store.getters.apiToken}
					}).then(response => {
						if ('success' in response.data) {
							if (response.data.success) {
								self.showSuccess('notifications.successes.skillDeleted')
							} else {
								self.showError('notifications.errors.skillDeleteFailed ')
							}
						}
					})
				})
				.catch()
		},
		showSettings: function () {
			if (this.$tours['skills'].currentStep !== -1) return

			let backup = JSON.parse(JSON.stringify(this.skill['settings']))
			let self = this
			const options = {
				view: 'skillSettingsPromptDialog',
				skill: this.skill,
				parent: this
			}

			this.$dialog.prompt({}, options).then(dialogue => {
				axios({
					method: 'PATCH',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.skill.name}/`,
					headers: {
						'auth': this.$store.getters.apiToken,
						'content-type': 'application/json'
					},
					data: JSON.stringify(dialogue.data)
				}).then((response) => {
					if (this.checkResponse(response)){
						backup = {}
						self.$parent.updateSkillData(self.skill)
					} else {
						self.skill['settings'] = backup
					}
				})
			}).catch(() => this.skill['settings'] = backup)
		}
	}
}
