import axios from 'axios'
import * as C from '@/utils/constants';

export default {
	name: 'skills',
	data: function () {
		return {
			shopOpen: false,
			skillsToDownload: [],
			dummySkills: {},
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
						title: this.$t('tours.skills.yourSkills')
					},
					content: this.$t('tours.skills.data0'),
					before: _ => new Promise((resolve) => {
						// Add a dummy skill for function tour
						this.dummySkills['dummy'] = {
							name: 'ProjectAliceDemo',
							author: 'Alice',
							delayed: false,
							active: true,
							description: this.$t('skill.demoDesc'),
							icon: 'fas fa-biohazard',
							instructions: this.$t('skill.demoInstructions'),
							required: false,
							settings: {dummy: true},
							updateAvailable: true,
							version: '1.0.0',
							aliceMinVersion: '1.0.0',
							category: 'system',
							maintainers: ['project', 'alice']
						}
						setTimeout(resolve, 500)
					}),
					params: {
						highlight: true
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
			tourCallbacks: {
				onSkip: this.finishTour,
				onFinish: this.finishTour
			}
		}
	},
	computed: {
		skillsToDisplay: function () {
			if (this.$store.state.skillTourCompleted) {
				return this.$store.state.installedSkills
			} else {
				return this.dummySkills
			}
		}
	},
	mounted: function () {
		if (!this.$store.state.skillTourCompleted) {
			this.$tours['skills'].start()
		}

		setInterval(this.reloadStoreSkills, 5 * 60 * 1000)
		this.reloadStoreSkills()
	},
	created: function () {
		let self = this
		this.unwatch = this.$store.watch(
			function (state) {
				return state.mqttMessage
			},
			function (msg) {
				if (msg.topic === C.SKILL_INSTALLED_TOPIC) {
					const payload = JSON.parse(msg.payloadString)
					axios({
						method: 'GET',
						url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/skills/${payload.skillName}/`,
						headers: {'auth': self.$store.getters.apiToken}
					}).then(response => {
						if ('skill' in response.data) {
							const newSkill = response.data.skill
							self.$set(self.$store.state.installedSkills, newSkill.name, newSkill)
							self.skillsToDownload.splice(self.skillsToDownload.indexOf(newSkill.name), 1)
							self.$store.state.connectVue.loadWidgetTemplates().then()
							self.$store.state.connectVue.loadDeviceTypes().then()
							self.$forceUpdate()
						}
					})
				} else if (msg.topic === C.SKILL_DELETED_TOPIC) {
					const payload = JSON.parse(msg.payloadString)
					self.$delete(self.$store.state.installedSkills, payload.skillName)
					self.$store.state.connectVue.loadWidgetTemplates().then()
					self.$store.state.connectVue.loadDeviceTypes().then()
					self.$store.state.connectVue.loadWidgetInstances().then()
					self.$forceUpdate()
				}
			}
		)
	},
	activated: function () {
		this.shopOpen = false
	},
	methods: {
		finishTour: function () {
			this.$store.commit('setSkillTourCompleted')
		},
		toggleShop: function () {
			if (this.$tours['skills'].currentStep !== -1) return
			this.shopOpen = !this.shopOpen
		},
		reloadStoreSkills: function () {
			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/getStore/`
			}).then(response => {
				if ('store' in response.data) {
					this.$store.commit('setStoreSkills', response.data['store'])
				} else {
					console.error('Error fetching store skills')
				}
			})
		},
		addSkillToDownload(skillName) {
			this.skillsToDownload.push(skillName)
		},
		removeSkillToDownload(skillName) {
			this.skillsToDownload = this.skillsToDownload.filter(e => e !== skillName)
		},
		doDownload: function () {
			if (this.skillsToDownload.length <= 0) {
				this.toggleShop()
				return
			}
			axios({
				method: 'PUT',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/installSkills/`,
				data: this.skillsToDownload,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(response => {
				if ('status' in response.data) {
					for (const skillName of Object.keys(response.data.status)) {
						this.$refs[skillName.toLowerCase()][0].setIsDownloading()
						this.shopOpen = false
					}
				}
			})
		}
	}
}
