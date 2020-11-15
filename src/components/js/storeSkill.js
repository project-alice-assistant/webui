
export default {
	name: 'storeSkill',
	data: function() {
		return {
			isWanted: false,
			isDownloading: false
		}
	},
	props: [
		'skill',
		'addMethod',
		'removeMethod'
	],
	methods: {
		handleDownloadClick: function() {
			if (!this.isWanted && !this.isDownloading) {
				this.isWanted = true
				this.addMethod(this.skill.name)
			} else if (this.isWanted && !this.isDownloading) {
				this.isWanted = false
				this.removeMethod(this.skill.name)
			}
		}
	}
}
