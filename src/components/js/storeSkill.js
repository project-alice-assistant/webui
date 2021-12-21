export default {
	name:     'storeSkill',
	data:     function () {
		return {
			isWanted:      false,
			isDownloading: false
		}
	},
	props:    [
		'skill',
		'addMethod',
		'removeMethod'
	],
	computed: {
		isCompatible:           function () {
			return this.skill['compatible']
		},
		notCompatibleExplained: function () {
			let text = `${this.$t('tooltips.notCompatible')}<br>`
			for (const offendingCondition of this.skill['offendingConditions']) {
				for (const [condition, value] of Object.entries(offendingCondition)) {
					text = `${text}${condition} => ${value}<br>`
				}
			}
			return text
		}
	},
	methods:  {
		handleDownloadClick: function () {
			if (this.skill['compatible'] || this.$store.state.settings['devMode']) {
				if (!this.isWanted && !this.isDownloading) {
					this.isWanted = true
					this.addMethod(this.skill.name)
				} else if (this.isWanted && !this.isDownloading) {
					this.isWanted = false
					this.removeMethod(this.skill.name)
				}
			} else {
				this.showError(this.$t('notifications.errors.skillIncompatible'))
			}
		},
		setIsDownloading:    function () {
			this.isWanted = false
			this.isDownloading = true
		}
	}
}
