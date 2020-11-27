import axios from 'axios'

export default {
	name: 'skills',
	data: function () {
		return {
			shopOpen: false,
			skills: [],
			storeSkills: {},
			skillsToDownload: [],
			menuItems: [
				{
					name: this.$t('tooltips.shop'),
					icon: 'fas fa-download',
					extendedIcon: 'fas fa-times-circle',
					extendedName: this.$t('tooltips.close'),
					isToggle: true,
					callback: this.toggleShop
				},
				{
					name: this.$t('tooltips.download'),
					icon: 'fas fa-check-circle',
					isToggle: true,
					callback: this.doDownload
				}
			],
			steps: [
				{
					target: '[data-tour="0"]',
					header: {
						title: 'Your skills'
					},
					content: this.$t('tours.skills.data0'),
					params: {
						highlight: true,
						placement: 'right'
					}
				},
				{
					target: '[data-tour="1"]',
					content: this.$t('tours.skills.data1'),
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="2"]',
					content: this.$t('tours.skills.data2'),
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="3"]',
					content: this.$t('tours.skills.data3'),
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="4"]',
					content: this.$t('tours.skills.data4'),
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="5"]',
					content: this.$t('tours.skills.data5'),
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="6"]',
					content: this.$t('tours.skills.data6'),
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="7"]',
					content: this.$t('tours.skills.data7'),
					params: {
						placement: 'right',
						highlight: true
					}
				},
				{
					target: '[data-tour="8"]',
					content: this.$t('tours.skills.data8'),
					params: {
						placement: 'right',
						highlight: true
					}
				},
				{
					target: '[data-tour="9"]',
					content: this.$t('tours.skills.data9'),
					params: {
						placement: 'right',
						highlight: true
					}
				},
				{
					target: '[data-tour="10"]',
					content: this.$t('tours.skills.data10'),
					params: {
						placement: 'left',
						highlight: true
					}
				}
			],
			tourCallbacks : {
				onSkip: this.finishTour,
				onFinish: this.finishTour
			}
		}
	},
	mounted: function() {
		if (!this.$cookies.isKey('skillsTourCompleted')) {
			// Add a dummy skill for function tour
			this.skills.push({
				name: 'ProjectAliceDemo',
				author: 'Alice',
				delayed: false,
				active: true,
				description: this.$t('demoDesc'),
				icon: 'fas fa-biohazard',
				instructions: this.$t('demoInstructions'),
				required: false,
				settings: {dummy: true},
				updateAvailable: true,
				version: '1.0.0',
				aliceMinVersion: '1.0.0-b4',
				category: 'system',
				maintainers: ['project', 'alice']
			})
			this.$tours['skills'].start()
		} else {
			this.fetchSkills()
		}

		setInterval(this.reloadStoreSkills, 5*60*1000)
		this.reloadStoreSkills()
	},
	methods: {
		fetchSkills: function() {
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/`,
				headers: {'auth': this.$store.state.loggedInUser['token'] }
			}).then(response => {
				if ('data' in response.data) {
					this.skills = response.data.data
				}
			})
		},
		finishTour: function() {
			this.$cookies.set('skillsTourCompleted', 1)
			this.fetchSkills()
		},
		toggleShop: function() {
			this.shopOpen = !this.shopOpen
		},
		reloadStoreSkills: function () {
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/getStore/`
			}).then(response => {
				if ('store' in response.data) {
					this.storeSkills = response.data.store
				}
			})
		},
		addSkillToDownload(skillName) {
			this.skillsToDownload.push(skillName)
		},
		removeSkillToDownload(skillName) {
			this.skillsToDownload = this.skillsToDownload.filter(e => e !== skillName)
		},
		doDownload: function() {
			if (this.skillsToDownload.length <= 0) {
				return
			}
			axios({
				method: 'put',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/installSkills/`,
				data: this.skillsToDownload,
				headers: {'auth': this.$store.state.loggedInUser['token']}
			}).then(response => {
				if ('status' in response.data) {
					for (const [skillName, status] of Object.entries(response.data.status)) {
						this.$refs[skillName.toLowerCase()][0].setIsDownloading()
					}
				}
			})
		}
	}
}
