import axios from 'axios'
import '../css/tour.css'

export default {
	name: 'skills',
	data: function () {
		return {
			skills: [],
			steps: [
				{
					target: '[data-tour="0"]',
					header: {
						title: 'Your skills'
					},
					content: 'This is a skill that is installed on Project Alice.',
					params: {
						highlight: true,
						placement: 'right'
					}
				},
				{
					target: '[data-tour="1"]',
					content: 'If the skill has any user settings available, this icon will appear. Click it to configure your skill!',
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="2"]',
					content: 'You can stop any skill that isn\'t required for Alice to run using this icon',
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="3"]',
					content: 'You can also reload a skill that isn\'t critical for Alice',
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="4"]',
					content: 'You disabled skill auto update? In that case you\'ll still be able to update your skill using this icon!',
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="5"]',
					content: 'Not using this skill anymore? Well, you can delete it here! Keep in mind you can\'t delete Alice required skills!',
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="6"]',
					content: 'This shows the status of the skill.<br/><br/><div style="text-align: left;">Green: All good<br/>Yellow: The skill was disabled<br/>Red: The skill failed starting.</div>',
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="7"]',
					content: 'If the skill developer included some instructions on how to use this skill, you will find them here',
					params: {
						placement: 'right',
						highlight: true
					}
				},
				{
					target: '[data-tour="8"]',
					content: 'Don\'t know what to say to use this skill? Check here!',
					params: {
						placement: 'right',
						highlight: true
					}
				},
				{
					target: '[data-tour="9"]',
					content: 'Get some useful info about the skill, like, who made it, its actual version etc.',
					params: {
						placement: 'right',
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
				description: 'This is a UI tour demo skill',
				icon: 'fas fa-biohazard',
				instructions: 'This is a demo',
				required: false,
				settings: {dummy: true},
				updateAvailable: true,
				version: '1.0.0'
			})

			this.$tours['skills'].start()
		} else {
			this.fetchSkills()
		}
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
		}
	}
}
