import axios from 'axios'

export default {
	name:    'skill',
	data:    function () {
		return {
			viewIntents:      false,
			viewInfos:        false,
			viewInstructions: false,
			viewSkill:        true
		}
	},
	props:   [
		'skill'
	],
	methods: {
		reloadSkill:  function () {
			if (this.$tours['skills'].currentStep !== -1) return
			axios({
				method:  'GET',
				url:     `/skills/${this.skill.name}/reload/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(response => {
				if ('skill' in response.data) {
					this.showSuccess(this.$parent.$t('notifications.successes.reloadTriggered'))
					this.$set(this.$store.state.installedSkills, response.data.skill.name, response.data.skill)
				}
			})
		},
		toggle:       function () {
			if (this.$tours['skills'].currentStep !== -1) return
			axios({
				method:  'GET',
				url:     `/skills/${this.skill.name}/toggleActiveState/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					this.skill.active = !this.skill.active
				} else {
					self.showError(self.$t('notifications.errors.skillNotActivated'))
				}
			})
		},
		update:       function () {
			if (this.$tours['skills'].currentStep !== -1) return
			axios({
				method:  'GET',
				url:     `/skills/${this.skill.name}/checkUpdate/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(() => {
			})
		},
		remove:       function () {
			if (this.$tours['skills'].currentStep !== -1) return

			let self = this
			this.$dialog
					.confirm(this.$t('dialogs.titles.confirmSkillDeletion'), {
						okText:     this.$t('dialogs.labels.yes'),
						cancelText: this.$t('dialogs.labels.cancel')
					})
					.then(function () {
						axios({
							method:  'DELETE',
							url:     `/skills/${self.skill.name}/`,
							headers: {'auth': self.$store.getters.apiToken}
						}).then(response => {
							if ('success' in response.data) {
								if (response.data.success) {
									self.showSuccess(this.$parent.$t('notifications.successes.skillDeleted'))
								} else {
									self.showError(this.$parent.$t('notifications.errors.skillDeleteFailed'))
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
				view:   'skillSettingsPromptDialog',
				skill:  this.skill,
				parent: this
			}

			this.$dialog.prompt({}, options).then(dialogue => {
				axios({
					method:  'PATCH',
					url:     `/skills/${this.skill.name}/`,
					headers: {
						'auth':         this.$store.getters.apiToken,
						'content-type': 'application/json'
					},
					data:    JSON.stringify(dialogue.data)
				}).then((response) => {
					if (this.checkResponse(response)) {
						backup = {}
						this.$set(this.$store.state.installedSkills, self.skill.name, self.skill)
					} else {
						self.skill['settings'] = backup
					}
				})
			}).catch(() => this.skill['settings'] = backup)
		}
	}
}
